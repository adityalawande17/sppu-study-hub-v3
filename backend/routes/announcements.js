import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { query } from '../db/index.js';
import { requireAdmin, requireUser } from '../middleware/auth.js';

const router = Router();
const BATCH_SIZE = 100; // Resend's per-call batch cap

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// Reuses ADMIN_JWT_SECRET as a plain HMAC key — this token carries a
// different, unrelated payload shape ({ uid }, not { role: 'admin' }) and is
// verified only here, never through requireAdmin, so there's no overlap.
function signUnsubscribeToken(userId) {
  return jwt.sign({ uid: userId }, process.env.ADMIN_JWT_SECRET, { expiresIn: '365d' });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderEmailHtml(subject, body, userId) {
  const frontendUrl = (process.env.FRONTEND_URL || 'https://sppustudyhub.in').replace(/\/$/, '');
  const token = signUnsubscribeToken(userId);
  const unsubscribeUrl = `${frontendUrl}/unsubscribe?token=${token}`;
  const safeBody = escapeHtml(body).replace(/\n/g, '<br>');

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
      <h2 style="color:#0a1628; margin: 0 0 16px;">SPPUStudyHUB</h2>
      <h3 style="color:#0a1628; margin: 0 0 12px;">${escapeHtml(subject)}</h3>
      <p style="font-size:14px; line-height:1.6; margin: 0 0 20px;">${safeBody}</p>
      <hr style="border:none;border-top:1px solid #e5e3de;margin:24px 0;">
      <p style="font-size:11px;color:#9ca3af;">
        You're receiving this because you have an account on SPPUStudyHUB.
        <a href="${unsubscribeUrl}" style="color:#9ca3af;">Unsubscribe</a> from these emails.
      </p>
    </div>
  `;
}

// GET /api/announcements — history, for the admin panel
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, subject, body, sent_by, recipient_count, sent_at
       FROM announcements ORDER BY sent_at DESC LIMIT 50`
    );
    return res.json({ announcements: result.rows });
  } catch (err) {
    console.error('Announcements list error:', err.message);
    return res.status(500).json({ error: 'Could not fetch announcements.' });
  }
});

// POST /api/announcements/send — admin composes and sends to every
// signed-in user who hasn't opted out.
router.post('/send', requireAdmin, async (req, res) => {
  const { subject, body } = req.body;
  if (!subject?.trim() || !body?.trim()) {
    return res.status(400).json({ error: 'Subject and body are required.' });
  }

  let resend;
  try {
    resend = getResend();
  } catch {
    return res.status(500).json({ error: 'Email sending is not configured (missing RESEND_API_KEY).' });
  }

  try {
    const recipientsRes = await query(
      `SELECT u.id, u.email
       FROM auth.users u
       LEFT JOIN email_preferences ep ON ep.user_id = u.id
       WHERE COALESCE(ep.opted_out, false) = false AND u.email IS NOT NULL`
    );
    const recipients = recipientsRes.rows;
    const from = process.env.RESEND_FROM_EMAIL || 'SPPUStudyHUB <onboarding@resend.dev>';

    let sent = 0;
    let failed = 0;
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const chunk = recipients.slice(i, i + BATCH_SIZE);
      const payload = chunk.map((r) => ({
        from,
        to: r.email,
        subject: subject.trim(),
        html: renderEmailHtml(subject.trim(), body.trim(), r.id),
      }));
      try {
        const { error } = await resend.batch.send(payload);
        if (error) {
          failed += chunk.length;
        } else {
          sent += chunk.length;
        }
      } catch {
        failed += chunk.length;
      }
    }

    await query(
      `INSERT INTO announcements (subject, body, sent_by, recipient_count) VALUES ($1, $2, $3, $4)`,
      [subject.trim(), body.trim(), process.env.ADMIN_EMAIL ?? 'admin', sent]
    );

    return res.json({ total: recipients.length, sent, failed });
  } catch (err) {
    console.error('Announcement send error:', err.message);
    return res.status(500).json({ error: 'Could not send announcement.' });
  }
});

// GET /api/announcements/preferences — this user's current opt-out state
router.get('/preferences', requireUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT opted_out FROM email_preferences WHERE user_id = $1`,
      [req.userId]
    );
    return res.json({ optedOut: result.rows[0]?.opted_out ?? false });
  } catch (err) {
    console.error('Preferences fetch error:', err.message);
    return res.status(500).json({ error: 'Could not fetch preferences.' });
  }
});

// POST /api/announcements/preferences — toggle from the dashboard
router.post('/preferences', requireUser, async (req, res) => {
  const optedOut = !!req.body.optedOut;
  try {
    await query(
      `INSERT INTO email_preferences (user_id, opted_out, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET opted_out = $2, updated_at = NOW()`,
      [req.userId, optedOut]
    );
    return res.json({ ok: true, optedOut });
  } catch (err) {
    console.error('Preferences update error:', err.message);
    return res.status(500).json({ error: 'Could not update preferences.' });
  }
});

// POST /api/announcements/unsubscribe — public, one-click link from the
// email itself. The signed token IS the auth; no session required.
router.post('/unsubscribe', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Missing token.' });

  let userId;
  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    userId = payload.uid;
    if (!userId) throw new Error('no uid in token');
  } catch {
    return res.status(400).json({ error: 'Invalid or expired unsubscribe link.' });
  }

  try {
    await query(
      `INSERT INTO email_preferences (user_id, opted_out, updated_at)
       VALUES ($1, true, NOW())
       ON CONFLICT (user_id) DO UPDATE SET opted_out = true, updated_at = NOW()`,
      [userId]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('Unsubscribe error:', err.message);
    return res.status(500).json({ error: 'Could not process unsubscribe.' });
  }
});

export default router;
