# sppuwalestudent v2 — React Project

Complete SPPU engineering study platform. React 18 + Vite 5 + React Router v6.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # builds to dist/
npm run preview    # preview production build
```

---

## Deploy to Netlify (3 minutes)

```bash
npm run build
```
Drag the `dist/` folder to **netlify.com/drop**. Done.

For auto-deploy on every push: connect your GitHub repo on Netlify.
- Build command: `npm run build`
- Publish directory: `dist`

The `netlify.toml` file handles React Router URL routing automatically.

---

## Project Structure

```
src/
├── context/AppContext.jsx     Global state: pattern, dark mode, bookmarks
├── hooks/useSEO.js            Dynamic title + meta + JSON-LD per page
├── data/
│   ├── branches.js            All branches, subjects for 2019 + 2024 patterns
│   ├── feSubjects.js          First Year subjects for 2019 + 2024
│   ├── trending.js            Trending materials (edit to update)
│   ├── news.js                News feed (edit to add announcements)
│   └── subjects/
│       ├── _template.json     Copy this to add a new subject's content
│       └── TE-CS-502.json     Example: Computer Networks
├── styles/global.css          Complete design system
├── components/                Reusable UI components
└── pages/                     One file per page
```

---

## How to Add a Subject's Content (Notes, PYQ Links)

1. Copy `src/data/subjects/_template.json`
2. Rename it to the subject code, e.g. `SE-CS-302.json`
3. Fill in the `units`, `practicals`, `pyq`, and `books` arrays
4. In `src/pages/Subject.jsx`, import the file and use it (follow the TE-CS-502 example already there)

**For Google Drive links:**
- Upload PDF to Google Drive → Share → Anyone with link → Copy link
- Convert: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`
- Paste as the `url` value in the JSON file

---

## How to Add a News Item

Edit `src/data/news.js` and add an object to the `newsItems` array:

```js
{
  id: 7,
  title: 'Your announcement title',
  date: '2025-04-10',
  category: 'result',   // result | exam | syllabus | notice | new
  link: 'https://...',  // or null
  description: 'Description of the announcement.',
}
```

Push to GitHub → Netlify rebuilds in ~30 seconds.

---

## How to Add Google AdSense

1. Get approved on google.com/adsense
2. Add the AdSense `<script>` tag inside `<head>` in `index.html`
3. Replace `.ad-slot` divs in each page with your `<ins class="adsbygoogle">` tags

---

## Patterns (2019 / 2024)

The pattern switcher in the navbar persists to localStorage. All subject data is organised under `branchData['2019']` and `branchData['2024']` in `branches.js`. Adding subjects for a new pattern is just adding entries under the correct key.

---

## Tech Stack

- React 18, Vite 5, React Router v6
- No UI library — custom design system in `global.css`
- Inter + DM Serif Display fonts via Google Fonts
- Context API for global state (no Redux needed)
- localStorage for dark mode, pattern preference, bookmarks
