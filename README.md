# SPPUStudyHUB

**Free study platform for SPPU engineering students across 7 branches and 2019/2024 syllabus patterns.**

[![Live Site](https://img.shields.io/badge/live-sppustudyhub.in-1d3461?style=flat-square)](https://sppustudyhub.in)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169e1?style=flat-square&logo=postgresql)](https://supabase.com)
[![Claude API](https://img.shields.io/badge/AI-Claude%20Haiku-d97706?style=flat-square)](https://anthropic.com)
[![Status](https://img.shields.io/badge/status-active-22c55e?style=flat-square)](#)

> 4,300+ students · 30,000+ page views in the first 29 days — no paid promotion.

---

## What it does

- Notes, PYQs, and practicals for 7 engineering branches across both 2019 and 2024 SPPU syllabus patterns — content loads from static JSON files bundled at build 
  time, keeping the site fully functional even if the backend goes down

- AI-powered PYQ explainer using Claude API — answers streamed token by token, calibrated to marks allocation (~40 words per mark) and structured in SPPU exam format

- Cache-first AI architecture — answers stored in PostgreSQL after the first request; pgvector semantic similarity extends the cache to rephrased questions above
  a 0.92 cosine threshold, reducing AI API calls by 65–70%

- Google OAuth via Supabase Auth with JWKS/ES256 JWT verification on the backend — all authorization enforced server-side from verified token identity, never 
  client-supplied IDs

- Per-user AI rate limiting (3 calls/24h) keyed by authenticated user ID with automatic IP fallback for guests, tracked in PostgreSQL

- Six SPPU-specific calculators — SGPA to percentage, CGPA to percentage, grade calculator, attendance tracker, semester GPA, and KT/ATKT checker

- Personalised dashboard — branch and year selection with automatic July progression, current semester subject tracker, CGPA/SGPA academic record across all semesters,
  and a GitHub-style activity heatmap built from scratch without any charting library

- Per-question PYQ progress tracker synced to Supabase for logged-in users with localStorage fallback for guests

- Admin-triggered email announcements via Resend with one-click unsubscribe and delivery tracking

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18, Vite 5, React Router v6 | SPA with static JSON bundling |
| Backend | Node.js, Express | REST API, AI routes, auth middleware |
| Database | PostgreSQL on Supabase + pgvector | Structured queries + semantic similarity |
| Auth | Supabase Auth, Google OAuth, JWKS/ES256 | Asymmetric key verification, auto-rotating |
| AI | Claude Haiku (`claude-haiku-4-5-20251001`) | Exam answer generation |
| Embeddings | OpenAI `text-embedding-ada-002` (1536-dim) | Semantic question similarity via fetch |
| Frontend CDN | Vercel | Static build deployment |
| Backend host | Render | Always-on Node.js service |
| Email | Resend | Announcement blasts with unsubscribe tokens |

---

## Architecture Decisions

**Frontend independent of backend**
All study content — notes, PYQs, practicals — loads from static JSON files bundled at Vite build time, not from API calls. The backend only powers AI features, the questions database, and user-specific data. If the backend goes down, 95% of the site still works. Deliberate tradeoff: reliability over edit convenience.

**Cache-first AI architecture**
Before every Claude API call the backend checks the `ai_answers` table for a cached response keyed by `question_id`. Cache hit rate is estimated at 65–70% based on SPPU question repeat patterns across exam years. One API call serves unlimited users for that question forever. Cached responses are served in both the streaming and non-streaming endpoints, appearing to stream from the client's perspective.

**Semantic similarity cache via pgvector**
When there is no exact cache hit, the backend calls OpenAI `text-embedding-ada-002` to embed the question and queries the `question_embedding` column using pgvector cosine distance (`<=>`). Questions within a cosine distance of 0.15 (very similar phrasing) share the same cached answer — so "Explain stack" and "What is a stack?" resolve to the same response without an additional Claude call. The embedding and cached answer are written back asynchronously after the response is sent, so latency is not affected.

**Direct PostgreSQL over ORM with Supavisor pooling**
The backend connects directly to PostgreSQL via Supabase's Supavisor connection pooler rather than an ORM. This gives full SQL control for complex queries including the pgvector cosine similarity searches that ORMs handle poorly. Supavisor safely manages concurrent connections within the free tier's connection limit. The `pg` pool and a shared `query()` helper are the only database abstractions in use.

**Dual authentication systems on one backend**
End users authenticate via Google OAuth with JWKS/ES256-verified JWTs issued by Supabase (`jose` handles key rotation automatically via the remote JWKS endpoint). The admin role uses a separate HS256 JWT scheme issued at `/api/admin/login`. Both are verified server-side — `req.userId` is always derived from the verified token, never from a client-supplied value. This matters because the backend talks directly to Postgres and bypasses Supabase RLS entirely.

**Rate limiter keyed by user ID, not IP**
The AI rate limiter (3 calls/24h) and general limiter (300 requests/15 min) both key by the JWT `sub` claim when a valid token is present, falling back to IP only for anonymous requests. This prevents students sharing campus or hostel Wi-Fi from consuming each other's request budget — a real problem in a college-use context.

**N+1 query elimination on dashboard**
The dashboard originally made one API call per saved subject — roughly 20 requests per page load. All dashboard data is consolidated into batched endpoints (`/api/profile`, `/api/progress`, `/api/academic`) that return a user's complete state in a small number of queries, reducing both request count and concurrent database connections significantly.

**Static JSON over a CMS for content**
Adding a subject means dropping a JSON file under `src/data/subjects/` and pushing to git — Vercel redeploys in under a minute. A database-backed CMS would add backend dependency to every page load, eliminating the reliability advantage. The tradeoff is that content edits require a git push; this is acceptable since contributors are developers.

---

## Screenshots

<img width="1516" height="699" alt="Screenshot 2026-07-26 124235" src="https://github.com/user-attachments/assets/a024fdc9-4f83-4448-a83a-73ddf2e641e7" />
<img width="1882" height="1594" alt="Screenshot_26-7-2026_124652_www sppustudyhub in" src="https://github.com/user-attachments/assets/4a2ba9ae-f3e8-4dc0-8796-cb0c6e41d7e9" />
<img width="1507" height="694" alt="Screenshot 2026-07-26 124735" src="https://github.com/user-attachments/assets/3813b7fd-0f7e-48d3-8d18-3c3680cafd76" />
<img width="1161" height="412" alt="Screenshot 2026-07-26 124532" src="https://github.com/user-attachments/assets/6558250a-9d6d-4d9c-a6e7-5126c7e2b111" />
<img width="1236" height="584" alt="sppustudyhub_one_month" src="https://github.com/user-attachments/assets/f61c67c4-2586-43d8-8986-15abcf1a1576" />


---

## Local Setup

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- Anthropic API key
- OpenAI API key (for question embeddings)

### 1. Clone the repo

```bash
git clone https://github.com/adityalawande17/sppu-study-hub-v3.git
cd sppu-study-hub-v3
```

### 2. Frontend setup

```bash
npm install
```

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=http://localhost:3001
```

```bash
npm run dev   # http://localhost:5173
```

### 3. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret
FRONTEND_URLS=http://localhost:5173
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-admin-password
ADMIN_JWT_SECRET=a-long-random-secret
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=YourSite <no-reply@yourdomain.com>
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev   # http://localhost:3001
```

Health check: `curl http://localhost:3001/health`

### 4. Database setup

Run `backend/db/schema.sql` in the Supabase SQL Editor. This creates all tables and indexes in one shot, including pgvector extension setup.

### Environment variables reference

| Variable | Location | Where to get it |
|---|---|---|
| `VITE_SUPABASE_URL` | frontend `.env.local` | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | frontend `.env.local` | Supabase → Settings → API |
| `VITE_BACKEND_URL` | frontend `.env.local` | `http://localhost:3001` for dev |
| `ANTHROPIC_API_KEY` | backend `.env` | [console.anthropic.com](https://console.anthropic.com) |
| `OPENAI_API_KEY` | backend `.env` | [platform.openai.com](https://platform.openai.com) |
| `DATABASE_URL` | backend `.env` | Supabase → Settings → Database → Connection Pooler |
| `SUPABASE_URL` | backend `.env` | Supabase → Settings → API |
| `SUPABASE_JWT_SECRET` | backend `.env` | Supabase → Settings → API |
| `ADMIN_EMAIL` | backend `.env` | Your choice — admin login credential |
| `ADMIN_PASSWORD` | backend `.env` | Your choice — admin login credential |
| `ADMIN_JWT_SECRET` | backend `.env` | Any long random string |
| `RESEND_API_KEY` | backend `.env` | [resend.com](https://resend.com) |
| `RESEND_FROM_EMAIL` | backend `.env` | Verified sender on Resend |

---

## Project Structure

```
SPPUStudyHUB/
├── src/                              # React frontend
│   ├── components/                   # Reusable UI components
│   │   ├── Navbar.jsx                # Top nav + slide-in mobile sidebar
│   │   ├── ActivityHeatmap.jsx       # GitHub-style heatmap (dashboard)
│   │   ├── CgpaTracker.jsx           # CGPA/SGPA tracker card
│   │   ├── EmailPreferenceToggle.jsx # Email opt-out toggle (dashboard)
│   │   ├── PYQAccordion.jsx          # PYQ list + AI explain panel
│   │   └── ...
│   ├── context/AppContext.jsx        # Auth, theme, pattern, saved subjects
│   ├── data/                         # Static JSON — bundled at build time
│   │   ├── branches.js               # Branch metadata + subject lists
│   │   └── subjects/                 # One JSON file per subject
│   ├── hooks/                        # Custom React hooks (useSEO, etc.)
│   ├── pages/                        # Route-level page components
│   │   ├── AdminQuestions.jsx        # PYQ manager (/admin/questions)
│   │   ├── AdminAnnouncements.jsx    # Email blast composer (/admin/announcements)
│   │   ├── Unsubscribe.jsx           # One-click unsubscribe (/unsubscribe?token=...)
│   │   └── ...
│   └── styles/global.css             # Design system + CSS custom properties
└── backend/                          # Express API
    ├── db/
    │   ├── schema.sql                # All tables + pgvector setup (run once)
    │   └── index.js                  # pg Pool + shared query() helper
    ├── middleware/
    │   ├── auth.js                   # requireUser, optionalUser, requireAdmin
    │   └── rateLimiter.js            # AI limiter (3/24h) + general limiter (300/15m)
    ├── prompts/
    │   └── explainer.js              # Claude prompt builder (marks-aware)
    ├── utils/
    │   └── embedding.js              # OpenAI text-embedding-ada-002 via fetch
    └── routes/
        ├── ai.js                     # POST /explain, POST /explain/stream, GET /usage
        ├── questions.js              # Questions CRUD + admin add/delete
        ├── admin.js                  # POST /login, GET /me
        ├── profile.js                # GET/POST user branch + semester profile
        ├── progress.js               # Unit and question completion tracking
        ├── academic.js               # SGPA records per semester
        └── announcements.js          # Email blast + preferences + unsubscribe
```

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploys on git push to `main`; `vercel.json` handles SPA routing |
| Backend | Render | Node.js web service; start command: `node server.js` |
| Database | Supabase | PostgreSQL + pgvector + Auth + JWKS endpoint |
| Domain | BigRock (.in) | DNS A/CNAME pointed to Vercel |

**Backend env vars on Render:** set `FRONTEND_URLS=https://sppustudyhub.in,https://www.sppustudyhub.in` (comma-separated, no spaces). Use the Supabase Connection Pooler URL (port 5432) as `DATABASE_URL`.

---

## Admin Panel

The admin panel is independent of Google auth — it uses a separate email/password stored in `.env`.

| Route | Purpose |
|---|---|
| `/admin/login` | Password login — issues a 7-day HS256 JWT |
| `/admin/questions` | Add and delete PYQ questions per subject |
| `/admin/announcements` | Compose and send email blasts to all subscribed users |

---

## Contributing

Found incorrect notes or want to add content? Use the [Contribute page](https://sppustudyhub.in) on the site or open a GitHub issue.

Pull requests for bug fixes are welcome. Open an issue before starting any large change.

---

## License

MIT
