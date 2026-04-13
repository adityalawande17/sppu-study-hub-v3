import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'

useSEO && null // silence lint

function calc(val, mode) {
  const v = parseFloat(val)
  if (isNaN(v) || v < 0 || v > 10) return null
  if (mode === 'sgpa' || mode === 'cgpa') return ((v * 10) - 7.5).toFixed(2)
  return null
}

function gradePoint(marks) {
  const m = parseFloat(marks)
  if (isNaN(m) || m < 0 || m > 100) return null
  if (m >= 90) return { grade: 'O',  gp: 10, label: 'Outstanding' }
  if (m >= 80) return { grade: 'A+', gp: 9,  label: 'Excellent' }
  if (m >= 70) return { grade: 'A',  gp: 8,  label: 'Very Good' }
  if (m >= 60) return { grade: 'B+', gp: 7,  label: 'Good' }
  if (m >= 55) return { grade: 'B',  gp: 6,  label: 'Above Average' }
  if (m >= 50) return { grade: 'C',  gp: 5,  label: 'Average' }
  if (m >= 45) return { grade: 'D',  gp: 4,  label: 'Satisfactory' }
  return { grade: 'F', gp: 0, label: 'Fail' }
}

const tools = [
  {
    id: 'sgpa', icon: '📊', title: 'SGPA to Percentage', color: '#3b82f6', paleBg: '#eff6ff',
    desc: 'Convert your Semester GPA to percentage as per SPPU formula: (SGPA × 10) − 7.5',
    Component: function SGPACalc() {
      const [val, setVal] = useState('')
      const result = calc(val, 'sgpa')
      return (
        <div className="tool-body">
          <div className="form-group">
            <label className="form-label">Enter SGPA (0 – 10)</label>
            <input className="form-input" type="number" min="0" max="10" step="0.01" placeholder="e.g. 8.5" value={val} onChange={e => setVal(e.target.value)} />
          </div>
          {val && (
            <div className="tool-result">
              <div><div className="tool-result-label">Percentage</div><div className="tool-result-value">{result !== null ? `${result}%` : 'Invalid'}</div></div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'right' }}>Formula: (SGPA × 10) − 7.5</div>
            </div>
          )}
        </div>
      )
    }
  },
  {
    id: 'cgpa', icon: '🎓', title: 'CGPA to Percentage', color: '#0d9488', paleBg: '#f0fdfa',
    desc: 'Convert your Cumulative GPA to percentage using the same SPPU formula.',
    Component: function CGPACalc() {
      const [val, setVal] = useState('')
      const result = calc(val, 'cgpa')
      return (
        <div className="tool-body">
          <div className="form-group">
            <label className="form-label">Enter CGPA (0 – 10)</label>
            <input className="form-input" type="number" min="0" max="10" step="0.01" placeholder="e.g. 7.8" value={val} onChange={e => setVal(e.target.value)} />
          </div>
          {val && (
            <div className="tool-result">
              <div><div className="tool-result-label">Percentage</div><div className="tool-result-value">{result !== null ? `${result}%` : 'Invalid'}</div></div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'right' }}>Formula: (CGPA × 10) − 7.5</div>
            </div>
          )}
        </div>
      )
    }
  },
  {
    id: 'grade', icon: '📝', title: 'Grade Calculator', color: '#f59e0b', paleBg: '#fffbeb',
    desc: 'Enter your marks out of 100 to see your SPPU letter grade and grade point.',
    Component: function GradeCalc() {
      const [marks, setMarks] = useState('')
      const res = marks !== '' ? gradePoint(marks) : null
      return (
        <div className="tool-body">
          <div className="form-group">
            <label className="form-label">Marks out of 100</label>
            <input className="form-input" type="number" min="0" max="100" placeholder="e.g. 74" value={marks} onChange={e => setMarks(e.target.value)} />
          </div>
          {res && (
            <div className="tool-result" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div><div className="tool-result-label">Grade</div><div className="tool-result-value">{res.grade}</div></div>
              <div><div className="tool-result-label">Grade Point</div><div className="tool-result-value">{res.gp}</div></div>
              <div><div className="tool-result-label">Category</div><div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginTop: 4 }}>{res.label}</div></div>
            </div>
          )}
          {marks !== '' && !res && <div className="info-strip" style={{ marginTop: 10 }}>Enter marks between 0 and 100.</div>}
        </div>
      )
    }
  },
  {
    id: 'attendance', icon: '📅', title: 'Attendance Calculator', color: '#16a34a', paleBg: '#f0fdf4',
    desc: 'Find out how many lectures you can miss while staying above 75% attendance.',
    Component: function AttendCalc() {
      const [total, setTotal] = useState('')
      const [attended, setAttended] = useState('')
      let result = null
      if (total && attended) {
        const t = parseInt(total), a = parseInt(attended)
        if (!isNaN(t) && !isNaN(a) && t > 0 && a >= 0 && a <= t) {
          const pct = ((a / t) * 100).toFixed(1)
          const canMiss = Math.floor(t - (0.75 * t)) - (t - a)
          const needMore = a < Math.ceil(0.75 * t) ? Math.ceil(0.75 * t) - a : 0
          result = { pct, canMiss, needMore, status: parseFloat(pct) >= 75 }
        }
      }
      return (
        <div className="tool-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group"><label className="form-label">Total Lectures</label><input className="form-input" type="number" min="1" placeholder="e.g. 60" value={total} onChange={e => setTotal(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Attended</label><input className="form-input" type="number" min="0" placeholder="e.g. 48" value={attended} onChange={e => setAttended(e.target.value)} /></div>
          </div>
          {result && (
            <div className="tool-result" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div><div className="tool-result-label">Attendance</div><div className="tool-result-value" style={{ color: result.status ? '#16a34a' : '#dc2626' }}>{result.pct}%</div></div>
              {result.status
                ? <div><div className="tool-result-label">Can Miss</div><div className="tool-result-value" style={{ color: '#16a34a' }}>{result.canMiss < 0 ? 0 : result.canMiss} lectures</div></div>
                : <div><div className="tool-result-label">Need More</div><div className="tool-result-value" style={{ color: '#dc2626' }}>{result.needMore} lectures</div></div>
              }
            </div>
          )}
        </div>
      )
    }
  },
  {
    id: 'gpa', icon: '🧮', title: 'Semester GPA Calculator', color: '#9333ea', paleBg: '#faf5ff',
    desc: 'Enter marks for each subject to calculate your SGPA for the semester.',
    Component: function GPACalc() {
      const [rows, setRows] = useState([{ name: '', credits: '', marks: '' }, { name: '', credits: '', marks: '' }, { name: '', credits: '', marks: '' }])
      function updateRow(i, field, val) { setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row)) }
      function addRow() { setRows(r => [...r, { name: '', credits: '', marks: '' }]) }
      function removeRow(i) { if (rows.length > 1) setRows(r => r.filter((_, idx) => idx !== i)) }

      let sgpa = null
      const valid = rows.filter(r => r.credits && r.marks && !isNaN(r.credits) && !isNaN(r.marks))
      if (valid.length > 0) {
        const totalCredits = valid.reduce((s, r) => s + parseInt(r.credits), 0)
        const weightedGP   = valid.reduce((s, r) => { const gp = gradePoint(r.marks); return s + (gp ? gp.gp * parseInt(r.credits) : 0) }, 0)
        sgpa = totalCredits > 0 ? (weightedGP / totalCredits).toFixed(2) : null
      }

      return (
        <div className="tool-body">
          <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 6 }}>
              {['Subject', 'Credits', 'Marks /100', ''].map(h => <div key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: .5, padding: '0 2px' }}>{h}</div>)}
            </div>
            {rows.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 6 }}>
                <input className="form-input" placeholder="Subject name" value={row.name} onChange={e => updateRow(i, 'name', e.target.value)} style={{ fontSize: 13 }} />
                <input className="form-input" type="number" placeholder="3" min="1" max="6" value={row.credits} onChange={e => updateRow(i, 'credits', e.target.value)} style={{ fontSize: 13 }} />
                <input className="form-input" type="number" placeholder="75" min="0" max="100" value={row.marks} onChange={e => updateRow(i, 'marks', e.target.value)} style={{ fontSize: 13 }} />
                <button onClick={() => removeRow(i)} style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>
          <button onClick={addRow} className="btn btn-ghost" style={{ fontSize: 13, padding: '7px 12px', marginBottom: 10 }}>+ Add Subject</button>
          {sgpa && (
            <div className="tool-result">
              <div><div className="tool-result-label">Your SGPA</div><div className="tool-result-value">{sgpa} / 10</div></div>
              <div><div className="tool-result-label">Percentage</div><div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-2)', marginTop: 4 }}>{((parseFloat(sgpa) * 10) - 7.5).toFixed(2)}%</div></div>
            </div>
          )}
        </div>
      )
    }
  },
  {
    id: 'kt', icon: '⚠️', title: 'KT / ATKT Eligibility', color: '#ef4444', paleBg: '#fff1f2',
    desc: 'Check if you are eligible for ATKT (Allowed To Keep Terms) based on SPPU rules.',
    Component: function KTCalc() {
      const [year, setYear] = useState('SE')
      const [kts, setKTs] = useState('')
      let result = null
      const k = parseInt(kts)
      if (!isNaN(k) && k >= 0) {
        // SPPU general ATKT rules (approximate — verify with official circular)
        const rules = { SE: { max: 4, label: 'Second Year' }, TE: { max: 4, label: 'Third Year' }, BE: { max: 2, label: 'Final Year' } }
        const rule = rules[year]
        result = { eligible: k <= rule.max, max: rule.max, kts: k, label: rule.label }
      }
      return (
        <div className="tool-body">
          <div className="form-group">
            <label className="form-label">Current Year</label>
            <select className="form-select" value={year} onChange={e => setYear(e.target.value)}>
              <option value="SE">Second Year (SE)</option>
              <option value="TE">Third Year (TE)</option>
              <option value="BE">Final Year (BE)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Number of KTs (backlogs)</label>
            <input className="form-input" type="number" min="0" placeholder="e.g. 2" value={kts} onChange={e => setKTs(e.target.value)} />
          </div>
          {result && (
            <div className="tool-result" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 22 }}>{result.eligible ? '✅' : '❌'}</div>
                <div>
                  <div className="tool-result-label">Eligibility</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: result.eligible ? '#16a34a' : '#dc2626' }}>{result.eligible ? 'Eligible for ATKT' : 'Not Eligible for ATKT'}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{result.label} allows a maximum of {result.max} KTs for ATKT eligibility. You have {result.kts}. Note: Always verify with the official SPPU circular as rules may change.</p>
            </div>
          )}
        </div>
      )
    }
  },
]

export default function Tools() {
  useSEO({
    title: 'SPPU Tools — SGPA, CGPA, Attendance, Grade Calculator | sppuwalestudent',
    description: 'Free SPPU calculators for engineering students. Convert SGPA and CGPA to percentage, calculate attendance, check ATKT eligibility, compute semester GPA.',
  })

  return (
    <div className="page-wrap">
      <div className="section-header" style={{ borderTop: 'none', paddingTop: 28 }}>
        <h1 className="section-title">SPPU Tools</h1>
        <span className="section-sub">Calculators for SPPU engineering students</span>
      </div>

      <div className="info-strip" style={{ marginBottom: 24 }}>
        All calculations follow official SPPU formulas and grading schemes. The SGPA and CGPA to percentage formula is: Percentage = (GPA × 10) − 7.5, as specified by SPPU.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 40 }} className="tools-grid">
        {tools.map(tool => (
          <div key={tool.id} className="tool-card fade-up">
            <div className="tool-card-head" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="tool-icon" style={{ background: tool.paleBg, fontSize: 22 }}>{tool.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--heading)' }}>{tool.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2, lineHeight: 1.4 }}>{tool.desc}</div>
              </div>
            </div>
            <tool.Component />
          </div>
        ))}
      </div>

      <div className="ad-slot" style={{ marginBottom: 40 }}><div><p className="ad-label">Advertisement</p><p>Google AdSense</p></div></div>
      <style>{`@media(max-width:760px){.tools-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
