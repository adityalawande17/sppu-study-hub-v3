import { Link, useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useApp } from '../context/AppContext'

export default function Saved() {
  const navigate = useNavigate()
  const { saved, toggleSaved } = useApp()
  useSEO({ title: 'Saved Subjects | sppuwalestudent', description: 'Your bookmarked SPPU engineering subjects for quick access.' })

  return (
    <div className="page-wrap">
      <div className="subject-header" style={{ paddingTop: 28 }}>
        <h1>Saved Subjects</h1>
        <div className="subject-meta"><span><span className="meta-dot" /> {saved.length} subject{saved.length !== 1 ? 's' : ''} saved</span></div>
      </div>
      {saved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 24px' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 80, color: 'var(--border)', lineHeight: 1, marginBottom: 16 }}>0</div>
          <h3 style={{ fontSize: 22, color: 'var(--heading)', marginBottom: 8 }}>No saved subjects yet</h3>
          <p style={{ color: 'var(--text-3)', marginBottom: 26, lineHeight: 1.6 }}>Open any subject and click the Save button to bookmark it here for quick access.</p>
          <Link to="/" className="btn btn-primary">Browse Subjects</Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
            {saved.map(s => (
              <div key={s.code} className="subject-item" style={{ alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: 'pointer', minWidth: 0 }} onClick={() => navigate(`/subject/${s.code}`, { state: s })}>
                  <span className="subject-code">{s.code}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="subject-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                    <div className="subject-credits">{s.branch} · {s.sem}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                  <button onClick={() => navigate(`/subject/${s.code}`, { state: s })}
                    className="btn btn-outline" style={{ padding: '6px 13px', fontSize: 12 }}>Open</button>
                  <button onClick={() => toggleSaved(s)}
                    style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/" className="btn btn-outline" style={{ fontSize: 14 }}>Browse More Subjects</Link>
        </>
      )}
    </div>
  )
}
