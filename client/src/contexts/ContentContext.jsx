import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getContent, putContent } from '../api/client'
import * as fallback from '../data/content'

const ContentContext = createContext(null)

const PAGE_FALLBACK = {
  home: { site: fallback.site, professor: fallback.professor, news: fallback.news },
  about: { professor: fallback.professor, news: fallback.news },
  research: { researchHighlights: fallback.researchHighlights },
  members: { researchers: fallback.researchers, students: fallback.students, alumni: fallback.alumni },
  openings: { openings: fallback.openings },
  contact: { contact: fallback.contact },
}

export function ContentProvider({ children }) {
  const [cache, setCache] = useState({})

  const load = useCallback(async (page) => {
    if (cache[page]) return cache[page]
    try {
      const data = await getContent(page)
      const merged = { ...(PAGE_FALLBACK[page] || {}), ...data }
      setCache((c) => ({ ...c, [page]: merged }))
      return merged
    } catch {
      return PAGE_FALLBACK[page] || {}
    }
  }, [cache])

  const save = useCallback(async (page, section, content) => {
    await putContent(page, section, content)
    setCache((c) => {
      const next = { ...(c[page] || {}), [section]: content }
      return { ...c, [page]: next }
    })
  }, [])

  return (
    <ContentContext.Provider value={{ load, save, cache }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent(page) {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  const [data, setData] = useState(() => PAGE_FALLBACK[page] || {})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ctx.load(page).then((d) => {
      if (!cancelled) setData(d)
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [page, ctx.load])

  const updateSection = useCallback((section, content) => {
    setData((prev) => ({ ...prev, [section]: content }))
    return ctx.save(page, section, content)
  }, [page, ctx.save])

  return { data, loading, updateSection }
}
