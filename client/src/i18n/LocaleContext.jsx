import { createContext, useContext, useEffect, useState } from 'react'
import { messages } from './messages'

const STORAGE_KEY = 'aai-locale'
const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'ko') return saved
    } catch {
      /* ignore */
    }
    return 'en'
  })

  const setLocale = (next) => {
    const value = next === 'ko' ? 'ko' : 'en'
    setLocaleState(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.lang = locale === 'ko' ? 'ko' : 'en'
    document.title =
      locale === 'ko'
        ? 'Applied AI Lab - 전북대학교 소프트웨어공학과'
        : 'Applied AI Lab | Jeonbuk National University'
  }, [locale])

  const t = (key) => {
    const table = messages[locale] || messages.en
    return table[key] ?? messages.en[key] ?? key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isKo: locale === 'ko' }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
