import { useEffect } from 'react'

export function useSEO({ title, description, schema }) {
  useEffect(() => {
    document.title = title
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.setAttribute('content', description)
    if (schema) {
      let s = document.getElementById('ld-json')
      if (!s) { s = document.createElement('script'); s.id = 'ld-json'; s.type = 'application/ld+json'; document.head.appendChild(s) }
      s.textContent = JSON.stringify(schema)
    }
  }, [title, description])
}
