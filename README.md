# SPPUStudyHUB

Free SPPU engineering study platform — notes, previous year question papers, practicals, and AI-powered explanations for all branches. Live at **[sppustudyhub.in](https://sppustudyhub.in)**.

---

## What's Inside

- Unit-wise notes and PYQ downloads for all SPPU engineering branches
- 2019 and 2024 pattern support with a one-click switcher
- First Year (FE) subjects — Semester 1 and 2
- AI explanations for previous year questions (Claude Haiku, streamed)
- Google OAuth login via Supabase
- AI answer history — localStorage for guests, Supabase sync for logged-in users
- Personal dashboard with saved subjects
- Dark / light mode (persisted to localStorage)
- Subject bookmarks
- News and announcements feed
- Tools page — CGPA calculator and study utilities
- Contributors page with college name and LinkedIn
- Syllabus PDF modal per branch
- Mobile-first design with bottom navigation bar
- Content notice popup on homepage (dismissible per session)
- SEO: per-page title, meta description, JSON-LD structured data

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| Styling | Custom design system (`global.css`) — no UI library |
| Fonts | Inter + DM Serif Display (Google Fonts) |
| Auth | Supabase JS (`@supabase/supabase-js`) |
| Analytics | Vercel Analytics |
| State | Context API — no Redux |
| Persistence | localStorage (theme, pattern, bookmarks), sessionStorage (popup dismiss) |
| Deploy | Vercel (SPA routing via `vercel.json`) |

### Backend
| | |
|---|---|
| Runtime | Node.js (ES modules) |
| Framework | Express.js |
| AI | Claude Haiku (`claude-haiku-4-5-20251001`) via Anthropic SDK — SSE streaming |
| Database | Supabase PostgreSQL (connection pooler, port 6543, IPv4) |
| Rate limiting | express-rate-limit — 3 AI calls / user / day |
| CORS | Multi-origin via comma-separated `FRONTEND_URLS` env var |
| Deploy | Render |

---

## Quick Start

### Frontend

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # output to dist/
npm run preview    # preview production build
```

Create `src/.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=http://localhost:3001
```

### Backend

```bash
cd backend
npm install
npm run dev        # http://localhost:3001
```

Create `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres
PORT=3001
FRONTEND_URLS=http://localhost:5173
```

Health check: `curl http://localhost:3001/health`

---

## Project Structure

```
├── index.html                     Favicon, fonts, meta
├── vercel.json                    SPA routing rewrites
├── src/
│   ├── main.jsx                   App entry point
│   ├── App.jsx                    Routes + AppProvider wrapper
│   ├── context/AppContext.jsx     Global state: pattern, theme, auth, bookmarks
│   ├── lib/supabase.js            Supabase client (guards missing env vars)
│   ├── utils/aiHistory.js         AI history — localStorage + Supabase sync
│   ├── hooks/useSEO.js            Dynamic title, meta, JSON-LD per page
│   ├── styles/global.css          Full design system, dark/light themes, mobile
│   ├── data/
│   │   ├── branches.js            All branches + subjects for 2019 and 2024 patterns
│   │   ├── feSubjects.js          First Year subjects
│   │   ├── contributors.js        Contributors list (name, college, LinkedIn)
│   │   ├── news.js                News/announcements feed
│   │   ├── trending.js            Trending materials on homepage
│   │   └── subjects/              Per-subject JSON files (units, practicals, PYQ, books)
│   ├── components/
│   │   ├── Navbar.jsx             Mega menu, pattern switcher, auth, dark mode
│   │   ├── BottomNav.jsx          Mobile bottom navigation bar
│   │   ├── UnitAccordion.jsx      Unit notes accordion with file rows
│   │   ├── PYQAccordion.jsx       PYQ grid + AI explain slide-in panel
│   │   ├── PracticalAccordion.jsx Practical steps + resources
│   │   ├── SubjectItem.jsx        Subject row on branch pages
│   │   ├── SyllabusModal.jsx      Syllabus PDF modal
│   │   ├── ContributeModal.jsx    Contribution form modal
│   │   ├── Footer.jsx
│   │   └── NoticeStrip.jsx        Top announcement strip
│   └── pages/
│       ├── Home.jsx               Landing page + content notice popup
│       ├── Branches.jsx           Branch grid
│       ├── BranchDetail.jsx       SE/TE/BE year tabs + subject list
│       ├── FirstYear.jsx          FE Sem 1 and 2 subjects
│       ├── Subject.jsx            Notes, PYQ, practicals, books for one subject
│       ├── Tools.jsx              CGPA calculator and study tools
│       ├── Dashboard.jsx          User profile + saved subjects (auth required)
│       ├── History.jsx            AI answer history
│       ├── News.jsx               Announcements
│       ├── Contributions.jsx      Contributors page
│       ├── Saved.jsx              Bookmarked subjects
│       ├── About.jsx
│       ├── Contact.jsx
│       ├── Privacy.jsx
│       └── Terms.jsx
└── backend/
    ├── server.js                  Express app, CORS, routes
    ├── middleware/rateLimiter.js  AI rate limiter (3/day) + general limiter
    ├── routes/
    │   ├── ai.js                  POST /api/ai/explain/stream — SSE AI answers
    │   └── questions.js           GET /api/questions/:subjectCode
    ├── db/
    │   ├── index.js               pg.Pool with SSL, query helper
    │   ├── schema.sql             All tables (run once in Supabase SQL editor)
    │   └── seed.js                Bulk question seed script
    └── prompts/explainer.js       Claude prompt builder
```

---

## Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. SQL Editor → run `backend/db/schema.sql`
3. Go to **Project → Connect** → copy the **Connection Pooler** URL (port 6543) — use this as `DATABASE_URL`
4. Authentication → Providers → Google → add your Google OAuth Client ID and Secret
5. Add `https://sppustudyhub.in` to Authorized JavaScript Origins in Google Cloud Console

Tables created by the schema:
- `branches` — branch registry
- `subjects` — subject registry (linked to branches)
- `questions` — PYQ bank with optional pgvector embeddings
- `ai_answers` — cached AI responses per question
- `api_usage` — rate-limit audit log
- `user_ai_history` — per-user AI answer history (synced from frontend)

---

## How to Add a Subject's Content

1. Copy any existing file from `src/data/subjects/` as a template
2. Name it after the subject code, e.g. `SE-CS-302.json`
3. Fill in the arrays:

```json
{
  "code": "SE-CS-302",
  "name": "Subject Name",
  "pattern": "2019",
  "units": [
    {
      "title": "Unit 1 - Introduction",
      "files": [
        { "name": "Unit 1 Notes", "size": "2.1 MB", "type": "PDF", "url": "DRIVE_LINK" }
      ]
    }
  ],
  "practicals": [...],
  "pyq": [
    { "year": "2024", "exam": "Nov / Dec 2024", "url": "DRIVE_LINK" }
  ],
  "books": [...]
}
```

**Google Drive link format:**
- Upload PDF → Share → Anyone with link → copy the file ID from the URL
- Use: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`

The file is auto-discovered via `import.meta.glob` — no import needed in `Subject.jsx`.

---

## How to Bulk Add Questions (AI feature)

1. Create a `backend/db/questions-seed.json` file:

```json
[
  {
    "subject_code": "TE-CS-502",
    "subject_name": "Computer Networks",
    "branch": "cs",
    "year": "TE",
    "semester": 5,
    "pattern": "2019",
    "questions": [
      {
        "unit": 1,
        "question_text": "Explain the OSI model with all 7 layers.",
        "marks": 8,
        "exam_year": 2023,
        "exam_month": "Nov",
        "question_type": "long"
      }
    ]
  }
]
```

2. Run: `node backend/db/seed.js`

The script upserts subjects and skips duplicate question text per subject — safe to run multiple times.

---

## How to Add a News Item

Edit `src/data/news.js`:

```js
{
  id: 8,
  title: 'Your announcement',
  date: '2025-06-01',
  category: 'result',   // result | exam | syllabus | notice | new
  link: 'https://...',  // or null
  description: 'Short description.',
}
```

---

## Deployment

### Frontend (Vercel)
- Connect GitHub repo → Vercel auto-deploys on push to `main`
- Add env vars in Vercel dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_BACKEND_URL`
- `vercel.json` handles SPA routing (all paths → `index.html`)

### Backend (Render)
- Connect GitHub repo → Render web service
- Build command: `npm install`
- Start command: `node server.js`
- Add env vars: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `FRONTEND_URLS`
- Set `FRONTEND_URLS=https://sppustudyhub.in,https://www.sppustudyhub.in` (comma-separated, no spaces)

**Important:** Use the Supabase **Connection Pooler** URL (port 6543) as `DATABASE_URL`, not the direct connection URL (port 5432). Render's free tier cannot reach IPv6, and the direct URL uses IPv6.

---

## Auth Flow

1. User clicks Sign In → `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. Supabase redirects to Google consent → back to `window.location.origin`
3. `onAuthStateChange` in `AppContext` picks up the session → `user` state updates
4. Session persists in localStorage — restored on page reload via `getSession()`
5. Dashboard is auth-guarded: renders `null` while session loads, then redirects if no user

---

## Pattern System

Students toggle between **2019** and **2024** SPPU patterns in the navbar. The selected pattern persists in `localStorage`. All branch/subject data is organised under `branchData['2019']` and `branchData['2024']` in `branches.js`.

2019 pattern subject codes are alphanumeric (`TE-CS-502`).
2024 pattern subject codes are purely numeric (`210241`).
