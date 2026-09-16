import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getContent, putContent } from '../api/client'
import { useLocale } from '../i18n/LocaleContext'
import * as fallback from '../data/content'

const ContentContext = createContext(null)

function pageFallback(page, locale) {
  const en = {
    home: { site: fallback.site, professor: fallback.professor, news: fallback.news },
    about: { professor: fallback.professor, news: fallback.news },
    research: { researchHighlights: fallback.researchHighlights },
    members: {
      researchers: fallback.researchers,
      students: fallback.students,
      alumni: fallback.alumni,
    },
    openings: { openings: fallback.openings },
    contact: { contact: fallback.contact },
  }

  if (locale !== 'ko') return en[page] || {}

  // Korean defaults: reuse EN structure with KO overlays where we have them
  const koProfessor = {
    ...fallback.professor,
    biography: [
      '보건복지부 GFID 위원장',
      '산업통상자원부 산업지능·AI 반도체·차세대 센서',
      '과학기술정보통신부 Package R&D AI',
      '국토교통부 SBAS, 스마트시티',
      '해양수산부 e-Navigation 자문위원회',
      '주요 IT 기업 연구소장 (LG CNS)',
      '2024 환경 R&D 우수성과 20선',
      '전북대학교 77주년 미래인재상 대상, 공과대학 우수교수상',
      "스탠포드대·엘스비어 '세계 상위 2% 연구자' 선정 (2025)",
    ],
  }

  const ko = {
    ...en,
    home: { ...en.home, professor: koProfessor, news: fallback.news },
    about: { ...en.about, professor: koProfessor, news: fallback.news },
    research: {
      researchHighlights: {
        publications: [
          'SCI IF 10% 저널에 30편 이상 논문 게재',
          '생성형 AI, 자율학습, 머신러닝 등 관련 논문 다수 게재',
          '의료 및 스마트 시티 분야에서 AI 응용 연구 논문 발표',
          'AI 기반 다학제적 연구를 통한 첨단 기술 논문 다수 출판',
        ],
        patent: [
          '2023년 이후 특허 출원 23건 (AI, IoT 및 환경 모니터링 관련)',
          '실시간 재난 대응 시스템 및 AI 기반 기술 다수 등록',
          'IoT 기반 빅데이터 수집 및 관리 기술 관련 기술 이전',
          '환경유해인자 및 건강영향인자 모니터링 기술의 상용화',
          '소프트웨어 저작권 등록 16건',
        ],
        projects: [
          { period: '2021-2024', title: 'IoT 기반 환경 보건 빅데이터 시스템 구축', org: '환경부', budget: '60억 원, 3+1년' },
          { period: '2021-2023', title: 'AI 플랫폼 및 디지털 오픈랩 구축', org: '과학기술정보통신부', budget: '20억 원, 5년' },
          { period: '2020-2024', title: '센서 기반 SoC', org: '산업통상자원부', budget: '3억 원, 4년' },
          { period: '2019-2023', title: '5G 기반 스마트 센서 플랫폼', org: '과학기술정보통신부', budget: '50억 원, 5년' },
          { period: '2019-2021', title: '의료 공통 데이터 모델', org: '보건복지부', budget: '5억 원, 3년' },
        ],
      },
    },
  }

  return ko[page] || en[page] || {}
}

export function ContentProvider({ children }) {
  const [cache, setCache] = useState({})

  const load = useCallback(async (page, locale = 'en') => {
    const key = `${page}::${locale}`
    if (cache[key]) return cache[key]
    try {
      const data = await getContent(page, locale)
      const merged = { ...pageFallback(page, locale), ...data }
      setCache((c) => ({ ...c, [key]: merged }))
      return merged
    } catch {
      return pageFallback(page, locale)
    }
  }, [cache])

  const save = useCallback(async (page, section, content, locale = 'en') => {
    await putContent(page, section, content, locale)
    const key = `${page}::${locale}`
    setCache((c) => {
      const next = { ...(c[key] || pageFallback(page, locale)), [section]: content }
      return { ...c, [key]: next }
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
  const { locale, t } = useLocale()
  const [data, setData] = useState(() => pageFallback(page, locale))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ctx.load(page, locale).then((d) => {
      if (!cancelled) setData(d)
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [page, locale, ctx.load])

  const updateSection = useCallback((section, content) => {
    setData((prev) => ({ ...prev, [section]: content }))
    return ctx.save(page, section, content, locale)
  }, [page, locale, ctx.save])

  return { data, loading, updateSection, locale, t }
}
