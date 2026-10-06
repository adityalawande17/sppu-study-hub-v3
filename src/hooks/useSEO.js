import { useEffect } from 'react'

const SITE = 'https://sppustudyhub.in'
const DEFAULT_IMAGE = `${SITE}/og-image.png`

function setMeta(attr, key, value) {
  let m = document.querySelector(`meta[${attr}="${key}"]`)
  if (!m) { m = document.createElement('meta'); m.setAttribute(attr, key); document.head.appendChild(m) }
  m.setAttribute('content', value)
}

function setLink(rel, href) {
  let l = document.querySelector(`link[rel="${rel}"]`)
  if (!l) { l = document.createElement('link'); l.setAttribute('rel', rel); document.head.appendChild(l) }
  l.setAttribute('href', href)
}

export function useSEO({ title, description = '', schema, image, noindex = false } = {}) {
  // Callers pass a fresh `schema` object literal on every render, so a
  // reference-identity dependency would rerun this effect (and rewrite the
  // DOM) on every re-render, not just on real navigation. Depend on its
  // serialized value instead — stable across renders unless the content
  // actually changes.
  const schemaKey = schema ? JSON.stringify(schema) : null

  useEffect(() => {
    if (!title) return
    const img = image || DEFAULT_IMAGE
    const url = SITE + window.location.pathname

    document.title = title

    // Reset on every page so a visit to a noindex page (e.g. admin) doesn't
    // leave the tag behind for whatever page is opened next in the same tab.
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    setMeta('name', 'description', description)

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'SPPUStudyHUB')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', img)

    setLink('canonical', url)

    if (schema) {
      let s = document.getElementById('ld-json')
      if (!s) { s = document.createElement('script'); s.id = 'ld-json'; s.type = 'application/ld+json'; document.head.appendChild(s) }
      s.textContent = JSON.stringify(schema)
    }
  }, [title, description, schemaKey, image, noindex])
}
