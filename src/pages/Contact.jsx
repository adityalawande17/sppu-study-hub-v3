import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'

export default function Contact() {
  const [done, setDone] = useState(false)
  useSEO({ title: 'Contact Us | sppuwalestudent', description: 'Contact sppuwalestudent — report broken links, request materials, or send feedback.' })

  function handle(e) { e.preventDefault(); setDone(true) }

  return (
    <div className="page-wrap">
      <div className="subject-header" style={{ paddingTop: 28 }}>
        <h1>Contact Us</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 6 }}>Get in touch with the sppuwalestudent team</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 40 }} className="contact-grid">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: 'var(--heading)', marginBottom: 18 }}>Send a Message</h2>
          {done ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#dcfce7', border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>✓</div>
              <p style={{ fontSize: 15, color: 'var(--text-3)', lineHeight: 1.6 }}>Message sent. We will reply within 2 to 3 working days.</p>
              <button className="btn btn-outline" style={{ marginTop: 16, fontSize: 13 }} onClick={() => setDone(false)}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handle}>
              {[['Your Name','text','Enter your name'],['Email Address','email','your@email.com']].map(([l,t,p]) => (
                <div className="form-group" key={l}><label className="form-label">{l}</label><input className="form-input" type={t} placeholder={p} required /></div>
              ))}
              <div className="form-group">
                <label className="form-label">Topic</label>
                <select className="form-select" required>
                  <option value="">Select a topic</option>
                  <option>Report incorrect information</option>
                  <option>Request notes for a subject</option>
                  <option>Want to contribute materials</option>
                  <option>Broken download link</option>
                  <option>General inquiry</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Describe your query..." required /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 15 }}>Send Message</button>
            </form>
          )}
        </div>
        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          {[
            { title: 'Report a broken link', text: 'If a download link is not working, tell us the subject name and the broken link. We fix them within 24 hours.' },
            { title: 'Request missing materials', text: 'Do not see notes for your subject? Submit a request and we will try to add them. You can also contribute your own notes.' },
            { title: 'Response time', text: 'We respond to messages within 2 to 3 working days. Contribution submissions are reviewed within a week.' },
          ].map(c => (
            <div key={c.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--heading)', marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
