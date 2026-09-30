import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
import jwt from 'jsonwebtoken';

// getSupabaseJWKS() in auth.js builds lazily on first use, so it's enough
// to set this before any test runs — no need to set it before importing.
process.env.SUPABASE_URL = 'https://example-test.supabase.co';

const { requireUser, optionalUser, getVerifiedUserId } = await import('./auth.js');

let validToken;
let hs256Token;

beforeAll(async () => {
  // A real Supabase-shaped token: ES256, verifiable only via a JWKS
  // endpoint — this is what the app actually receives in production.
  const { publicKey, privateKey } = await generateKeyPair('ES256');
  const publicJwk = await exportJWK(publicKey);
  publicJwk.kid = 'test-key-1';
  publicJwk.alg = 'ES256';
  publicJwk.use = 'sig';

  // auth.js's createRemoteJWKSet fetches SUPABASE_URL over the global
  // fetch — stub it to serve our test key instead of a real network call.
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      new Response(JSON.stringify({ keys: [publicJwk] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ),
  );

  validToken = await new SignJWT({ email: 'student@example.com' })
    .setProtectedHeader({ alg: 'ES256', kid: 'test-key-1' })
    .setSubject('user-123')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  // Shaped exactly like what the original, broken code assumed Supabase
  // used: a shared HS256 secret. The mocked JWKS above only publishes an
  // ES256 key, so jose must reject this outright — this is the regression
  // guard for the JWKS/shared-secret mismatch bug.
  hs256Token = jwt.sign({ sub: 'user-123' }, 'some-shared-secret', { algorithm: 'HS256' });
});

function mockReqRes(token) {
  const req = { headers: token ? { authorization: `Bearer ${token}` } : {} };
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  const next = vi.fn();
  return { req, res, next };
}

describe('requireUser', () => {
  it('accepts a real Supabase-shaped (ES256/JWKS) token', async () => {
    const { req, res, next } = mockReqRes(validToken);
    await requireUser(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.userId).toBe('user-123');
  });

  it('rejects an HS256 shared-secret token — the exact bug this guards against', async () => {
    const { req, res, next } = mockReqRes(hs256Token);
    await requireUser(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
  });

  it('rejects a missing token', async () => {
    const { req, res, next } = mockReqRes(null);
    await requireUser(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
  });
});

describe('optionalUser', () => {
  it('attaches userId for a valid token but still calls next', async () => {
    const { req, res, next } = mockReqRes(validToken);
    await optionalUser(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.userId).toBe('user-123');
  });

  it('continues as anonymous (userId null) for an invalid token, instead of blocking the request', async () => {
    const { req, res, next } = mockReqRes(hs256Token);
    await optionalUser(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.userId).toBeNull();
  });
});

describe('getVerifiedUserId (used by both rate limiters)', () => {
  it('returns the real user id for a valid token', async () => {
    const { req } = mockReqRes(validToken);
    await expect(getVerifiedUserId(req)).resolves.toBe('user-123');
  });

  it('returns null for a forged/wrong-scheme token — the rate-limit bypass this closes', async () => {
    const { req } = mockReqRes(hs256Token);
    await expect(getVerifiedUserId(req)).resolves.toBeNull();
  });
});
