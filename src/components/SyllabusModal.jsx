import Modal from './Modal'

const yearLabels = { FE: 'First Year (FE)', SE: 'Second Year (SE)', TE: 'Third Year (TE)', BE: 'Final Year (BE)' }
const feBranches = [{ name: 'All Branches — Common Syllabus', note: 'Single syllabus applies to all engineering branches' }]
const otherBranches = [
  'Computer Science Engineering',
  'Information Technology Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics and Telecommunication Engineering',
].map(name => ({ name }))

const DlIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

export default function SyllabusModal({ open, onClose, year, pattern = '2019' }) {
  if (!year) return null
  const branches = year === 'FE' ? feBranches : otherBranches
  return (
    <Modal open={open} onClose={onClose} title={`SPPU ${yearLabels[year]} Syllabus — ${pattern} Pattern`}>
      <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 18 }}>
        Official syllabus PDFs released by Savitribai Phule Pune University. Replace the links below with actual PDF URLs once you have them.
      </p>
      <div style={{ display: 'grid', gap: 8 }}>
        {branches.map(b => (
          <div key={b.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface2)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--heading)' }}>{b.name}</div>
              {b.note && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{b.note}</div>}
            </div>
            <a href="#" className="syllabus-dl-btn" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
              <DlIcon /> Download
            </a>
          </div>
        ))}
      </div>
    </Modal>
  )
}
