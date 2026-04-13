import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { branchMeta } from '../data/branches'
import { searchIndex } from '../data/branches'
import { feSearchIndex } from '../data/feSubjects'

const allIndex = [...feSearchIndex, ...searchIndex]

const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const MoonIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
const SunIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
const BookIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
const ChevronDown = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
const ExternalLink = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>

export default function Navbar() {
  const { isDark, toggleTheme, saved, pattern, switchPattern } = useApp()
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const megaRef = useRef(null)
  const searchRef = useRef(null)

  // Close mega on route change
  useEffect(() => { setMegaOpen(false); setMobileOpen(false) }, [pathname])

  // Search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(allIndex.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q)
    ).slice(0, 7))
  }, [query])

  function pickResult(sub) {
    setQuery(''); setSearchOpen(false)
    navigate(`/subject/${sub.code}`, { state: sub })
  }

  return (
    <>
      {/* ── Top bar ───────────────────────────────────────────── */}
      <header style={{ background: 'var(--navy)', position: 'sticky', top: 0, zIndex: 200, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Main row */}
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 60, gap: 12 }}>

          {/* Logo */}
          <Link to="/" style={{ fontFamily: "'DM Serif Display', serif", color: '#fff', fontSize: 20, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, letterSpacing: '-0.3px' }}>
            sppu<span style={{ color: 'var(--gold)' }}>wale</span>student
          </Link>

          {/* Pattern switcher — desktop */}
          <div className="pattern-pill hide-sm" style={{ marginLeft: 8 }}>
            {['2019','2024'].map(p => (
              <button key={p} className={`pattern-opt ${pattern === p ? 'active' : ''}`} onClick={() => switchPattern(p)}>{p}</button>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Search bar — desktop */}
          <div ref={searchRef} style={{ position: 'relative', width: 300 }} className="hide-sm">
            <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.35)', pointerEvents: 'none' }}><SearchIcon /></div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
              placeholder="Search subjects, notes..."
              style={{ width: '100%', padding: '8px 14px 8px 36px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'all .2s' }}
            />
            {searchOpen && results.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', zIndex: 300, overflow: 'hidden' }}>
                {results.map(r => (
                  <div key={r.code} onMouseDown={() => pickResult(r)} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center', transition: 'background .1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold-dim)', background: 'var(--gold-pale)', padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap', flexShrink: 0 }}>{r.code}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.branch} · {r.sem}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hide-sm">
            {/* Browse mega trigger */}
            <button
              onClick={() => setMegaOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 12px', borderRadius: 8, border: 'none', background: megaOpen ? 'rgba(255,255,255,.12)' : 'transparent', color: megaOpen ? '#fff' : 'rgba(255,255,255,.8)', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all .18s' }}>
              Browse <ChevronDown />
            </button>

            {[
              ['/tools', 'Tools'],
              ['/news', 'News'],
            ].map(([path, label]) => (
              <Link key={path} to={path} style={{ padding: '7px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: pathname === path ? '#fff' : 'rgba(255,255,255,.8)', textDecoration: 'none', background: pathname === path ? 'rgba(255,255,255,.12)' : 'transparent', transition: 'all .18s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,.08)' }}
                onMouseLeave={e => { e.currentTarget.style.color = pathname === path ? '#fff' : 'rgba(255,255,255,.8)'; e.currentTarget.style.background = pathname === path ? 'rgba(255,255,255,.12)' : 'transparent' }}>
                {label}
              </Link>
            ))}

            {/* Result button */}
            <a href="https://results.unipune.ac.in" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(240,165,0,.18)', color: 'var(--gold)', border: '1px solid rgba(240,165,0,.3)', textDecoration: 'none', transition: 'all .18s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#111' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,165,0,.18)'; e.currentTarget.style.color = 'var(--gold)' }}>
              Check Result <ExternalLink />
            </a>
          </nav>

          {/* Saved badge + theme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Link to="/saved" style={{ position: 'relative', width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.8)', textDecoration: 'none', transition: 'all .18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              {saved.length > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, background: 'var(--gold)', borderRadius: '50%', fontSize: 9, fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--navy)' }}>{saved.length}</span>
              )}
            </Link>
            <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            {/* Hamburger */}
            <button onClick={() => setMobileOpen(o => !o)} className="show-sm" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.8)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <span style={{ width: 16, height: 1.5, background: 'currentColor', borderRadius: 1, display: 'block' }} />
              <span style={{ width: 16, height: 1.5, background: 'currentColor', borderRadius: 1, display: 'block' }} />
              <span style={{ width: 16, height: 1.5, background: 'currentColor', borderRadius: 1, display: 'block' }} />
            </button>
          </div>
        </div>

        {/* ── Mega menu ─────────────────────────────────────── */}
        {megaOpen && (
          <div ref={megaRef} style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="container" style={{ padding: '28px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
              {/* Branches */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 14 }}>Branches</p>
                <div style={{ display: 'grid', gap: 4 }}>
                  {Object.values(branchMeta).map(b => (
                    <Link key={b.key} to={`/branches/${b.key}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 8, textDecoration: 'none', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{b.abbr}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{b.short}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>B.E. Engineering</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Years + FE */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 14 }}>By Year</p>
                <div style={{ display: 'grid', gap: 4, marginBottom: 20 }}>
                  {[
                    { path: '/first-year', label: 'First Year (FE)', sub: 'Common for all branches' },
                    { path: '/branches?year=SE', label: 'Second Year (SE)', sub: 'Semester 3 and 4' },
                    { path: '/branches?year=TE', label: 'Third Year (TE)', sub: 'Semester 5 and 6' },
                    { path: '/branches?year=BE', label: 'Final Year (BE)', sub: 'Semester 7 and 8' },
                  ].map(item => (
                    <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 8, textDecoration: 'none', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookIcon />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: 14 }}>Quick Links</p>
                <div style={{ display: 'grid', gap: 4 }}>
                  {[
                    { path: '/tools', label: 'SPPU Tools', sub: 'SGPA, CGPA, attendance calculators', icon: '⚙' },
                    { path: '/news',  label: 'News and Updates', sub: 'Latest SPPU announcements', icon: '📰' },
                    { path: '/saved', label: 'Saved Subjects', sub: `${saved.length} subject${saved.length !== 1 ? 's' : ''} bookmarked`, icon: '🔖' },
                    { path: '/about', label: 'About and Contribute', sub: 'Share your notes with us', icon: '✋' },
                  ].map(item => (
                    <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 8, textDecoration: 'none', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Result CTA in mega */}
                <a href="https://results.unipune.ac.in" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'var(--gold-pale)', border: '1px solid var(--gold-dim)', textDecoration: 'none', transition: 'all .18s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--gold-pale)'}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--heading)' }}>Check SPPU Result</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>results.unipune.ac.in</div>
                  </div>
                  <ExternalLink />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile drawer ─────────────────────────────────── */}
        {mobileOpen && (
          <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '16px 20px 20px' }}>
            {/* Mobile search */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }}><SearchIcon /></div>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search subjects..."
                style={{ width: '100%', padding: '9px 12px 9px 32px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
              {results.length > 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginTop: 4 }}>
                  {results.map(r => (
                    <div key={r.code} onMouseDown={() => pickResult(r)} style={{ padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text)' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold-dim)', marginRight: 8 }}>{r.code}</span>{r.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Pattern */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Pattern</p>
              <div className="pattern-pill">
                {['2019','2024'].map(p => (
                  <button key={p} className={`pattern-opt ${pattern === p ? 'active' : ''}`} onClick={() => switchPattern(p)}>{p}</button>
                ))}
              </div>
            </div>
            {/* Links */}
            <div style={{ display: 'grid', gap: 2 }}>
              {[['/', 'Home'], ['/first-year', 'First Year'], ['/branches', 'Branches'], ['/tools', 'Tools'], ['/news', 'News'], ['/saved', `Saved (${saved.length})`], ['/about', 'About']].map(([path, label]) => (
                <Link key={path} to={path} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '9px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: 'var(--text)', textDecoration: 'none', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {label}
                </Link>
              ))}
              <a href="https://results.unipune.ac.in" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: 'var(--gold-dim)', textDecoration: 'none' }}>
                Check Result <ExternalLink />
              </a>
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) { .hide-sm { display: none !important; } }
        @media (min-width: 769px) { .show-sm { display: none !important; } }
      `}</style>
    </>
  )
}
