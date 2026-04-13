import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { useApp } from '../context/AppContext'
import { feSubjects } from '../data/feSubjects'
import SubjectItem from '../components/SubjectItem'
import SyllabusModal from '../components/SyllabusModal'

const DlIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>

export default function FirstYear() {
  const { pattern } = useApp()
  const [activeSem, setActiveSem] = useState('sem1')
  const [syllabusOpen, setSyllabusOpen] = useState(false)

  useSEO({
    title: 'First Year FE Notes and Question Papers — SPPU | sppuwalestudent',
    description: 'First Year FE SPPU engineering notes, question papers and practicals. Semester 1 and 2 for all branches. 2019 and 2024 pattern.',
  })

  const subjects = feSubjects[pattern]?.[activeSem] || feSubjects['2019'][activeSem]

  return (
    <div className="page-wrap">
      {/* Banner */}
      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: 36, margin: '28px 0 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center', position: 'relative', overflow: 'hidden' }} className="fy-banner">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.03) 1px, transparent 0)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: '#fff', marginBottom: 8 }}>First Year Engineering</h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.6 }}>Common syllabus for all branches — FE. Updated as per the SPPU {pattern} pattern syllabus.</p>
        </div>
        <span style={{ background: 'var(--gold)', color: 'var(--heading)', padding: '7px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', alignSelf: 'flex-start', position: 'relative' }}>FE — {pattern} Pattern</span>
      </div>

      {/* Syllabus strip */}
      <div className="syllabus-strip">
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--heading)' }}>SPPU First Year Complete Syllabus — {pattern} Pattern</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Official PDF covering all FE subjects across both semesters</div>
        </div>
        <button onClick={() => setSyllabusOpen(true)} className="syllabus-dl-btn"><DlIcon /> Download PDF</button>
      </div>

      <div className="info-strip">First Year at SPPU has a common syllabus across all engineering branches. Select a semester to access notes, question papers, and practicals.</div>

      <div className="sem-tabs">
        <button className={`sem-tab ${activeSem === 'sem1' ? 'active' : ''}`} onClick={() => setActiveSem('sem1')}>Semester 1</button>
        <button className={`sem-tab ${activeSem === 'sem2' ? 'active' : ''}`} onClick={() => setActiveSem('sem2')}>Semester 2</button>
      </div>

      <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {subjects.map(s => <SubjectItem key={s.code} subject={s} branch="First Year" branchKey="fe" yearKey="FE" sem={activeSem === 'sem1' ? 'Semester 1' : 'Semester 2'} />)}
      </div>

      <div className="ad-slot" style={{ margin: '24px 0 40px' }}><div><p className="ad-label">Advertisement</p><p>Google AdSense</p></div></div>
      <SyllabusModal open={syllabusOpen} onClose={() => setSyllabusOpen(false)} year="FE" pattern={pattern} />
      <style>{`@media(max-width:640px){.fy-banner{grid-template-columns:1fr!important;padding:24px 20px!important}}`}</style>
    </div>
  )
}
