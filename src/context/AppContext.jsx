import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [pattern, setPattern] = useState(() => {
    try { return localStorage.getItem('sppu_pattern') || '2019' } catch { return '2019' }
  })
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('sppu_theme') === 'dark' } catch { return false }
  })
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sppu_saved') || '[]') } catch { return [] }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '')
    try { localStorage.setItem('sppu_theme', isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  useEffect(() => {
    try { localStorage.setItem('sppu_pattern', pattern) } catch {}
  }, [pattern])

  function toggleTheme() { setIsDark(d => !d) }

  function switchPattern(p) { setPattern(p) }

  function toggleSaved(subject) {
    setSaved(prev => {
      const exists = prev.some(s => s.code === subject.code)
      const next = exists ? prev.filter(s => s.code !== subject.code) : [...prev, subject]
      try { localStorage.setItem('sppu_saved', JSON.stringify(next)) } catch {}
      return next
    })
  }

  function isSaved(code) { return saved.some(s => s.code === code) }

  return (
    <AppContext.Provider value={{ pattern, switchPattern, isDark, toggleTheme, saved, toggleSaved, isSaved }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
