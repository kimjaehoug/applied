import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import EditableSection from '../components/EditableSection'
import EditJsonModal from '../components/EditJsonModal'
import MembersEditorModal from '../components/MembersEditorModal'
import ResearchEditorModal from '../components/ResearchEditorModal'
import OpeningsEditorModal from '../components/OpeningsEditorModal'
import ProfessorEditorModal from '../components/ProfessorEditorModal'
import NewsCarousel from '../components/NewsCarousel'
import { useContent } from '../contexts/ContentContext'
import { useAuth } from '../contexts/AuthContext'
import { research as researchTopics, vision as visionContent } from '../data/content'
import { getNewsList, deleteNews } from '../api/client'

function PersonCard({ name, role, period, research, profile_image }) {
  const initial = name?.charAt(0) || '?'
  return (
    <div className="p-6 bg-white/95 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#c9a227] flex items-center justify-center text-xl font-bold text-white mb-3 shadow-md overflow-hidden">
        {profile_image ? (
          <img src={profile_image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#1e3a5f]/10 text-xs font-semibold text-[#1e3a5f]">
          {role}
        </span>
        <span className="text-xs text-gray-500">{period}</span>
      </div>
      {research && <p className="text-sm text-gray-600 mt-3 leading-relaxed">{research}</p>}
    </div>
  )
}

const gridItems = [
  { title: 'AI Research', desc: 'SOTA AI · 의료·환경 데이터' },
  { title: 'Industry Collaboration', desc: '산학협력 및 기술이전' },
  { title: 'Publications', desc: '논문 · 특허 · R&D' },
  { title: 'R&D Projects', desc: '국가·산업 R&D 과제' },
]

export default function SinglePage() {
  const { data: homeData, loading: homeLoading, updateSection: updateHome } = useContent('home')
  const { data: researchData, loading: researchLoading, updateSection: updateResearch } = useContent('research')
  const { data: membersData, loading: membersLoading, updateSection: updateMembers } = useContent('members')
  const { data: openingsData, loading: openingsLoading, updateSection: updateOpenings } = useContent('openings')
  const { data: contactData } = useContent('contact')
  const { isAdmin } = useAuth()
  const [newsItems, setNewsItems] = useState([])
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)
  const [aboutExpanded, setAboutExpanded] = useState(false)
  const [researchExpanded, setResearchExpanded] = useState(false)
  const [visionExpanded, setVisionExpanded] = useState(false)
  const aboutSectionRef = useRef(null)
  const researchSectionRef = useRef(null)
  const visionSectionRef = useRef(null)

  useEffect(() => {
    getNewsList().then(setNewsItems).catch(() => {})
  }, [])

  const handleDeleteNews = async (id) => {
    if (!window.confirm('이 뉴스를 삭제하시겠습니까?')) return
    try {
      await deleteNews(id)
      setNewsItems((prev) => prev.filter((n) => n.id !== id))
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const site = homeData.site || {}
  const professor = homeData.professor || {}
  const news = newsItems.length > 0 ? newsItems : (homeData.news || [])
  const researchHighlights = researchData.researchHighlights || {}
  const { publications = [], patent = [], projects = [] } = researchHighlights
  const researchers = membersData.researchers || []
  const students = membersData.students || []
  const alumni = membersData.alumni || []
  const openings = openingsData.openings || {}
  const { positions = [], benefits = [], apply = [], contact: contactText = '' } = openings
  const contact = contactData.contact || {}
  const loading = homeLoading

  useEffect(() => {
    if (loading) return
    const section = aboutSectionRef.current
    if (!section) return
    const updateExpanded = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const inStickyRange = rect.top <= 0 && rect.bottom > vh
      const scrollInto = -rect.top
      setAboutExpanded(inStickyRange && scrollInto > 30 && scrollInto < vh * 1.4)
    }
    updateExpanded()
    window.addEventListener('scroll', updateExpanded, { passive: true })
    window.addEventListener('resize', updateExpanded)
    return () => {
      window.removeEventListener('scroll', updateExpanded)
      window.removeEventListener('resize', updateExpanded)
    }
  }, [loading])

  useEffect(() => {
    if (loading) return
    const section = researchSectionRef.current
    if (!section) return
    const updateExpanded = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const inStickyRange = rect.top <= 0 && rect.bottom > vh
      const scrollInto = -rect.top
      setResearchExpanded(inStickyRange && scrollInto > 30 && scrollInto < vh*0.9 )
    }
    updateExpanded()
    window.addEventListener('scroll', updateExpanded, { passive: true })
    window.addEventListener('resize', updateExpanded)
    return () => {
      window.removeEventListener('scroll', updateExpanded)
      window.removeEventListener('resize', updateExpanded)
    }
  }, [loading])

  useEffect(() => {
    if (loading) return
    const section = visionSectionRef.current
    if (!section) return
    const updateExpanded = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const inStickyRange = rect.top <= 0 && rect.bottom > vh
      const scrollInto = -rect.top
      setVisionExpanded(inStickyRange && scrollInto > 30 && scrollInto < vh * 0.9)
    }
    updateExpanded()
    window.addEventListener('scroll', updateExpanded, { passive: true })
    window.addEventListener('resize', updateExpanded)
    return () => {
      window.removeEventListener('scroll', updateExpanded)
      window.removeEventListener('resize', updateExpanded)
    }
  }, [loading])

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      if (res.ok) {
        setContactStatus('success')
        setContactForm({ name: '', email: '', subject: '', message: '' })
      } else setContactStatus('error')
    } catch {
      setContactStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        로딩 중...
      </div>
    )
  }

  const topicImages = ['/image/RESEARCH.png', '/image/VISION.png', '/image/environment.png']

  return (
    <div>
      {/* Hero - Ref style */}
      <section id="hero" className="ref-hero scroll-mt-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/video/background_video.mp4" type="video/mp4" />
        </video>
        <div className="ref-hero-content">
          <h1>
            We Prove
            <br />
            the Power of AI
          </h1>
          <p className="ref-hero-sub">
            {site.name} · {site.dept}
          </p>
        </div>
      </section>

      {/* Dark grid - Ref style */}
      <section className="ref-dark-grid-section">
        <div className="ref-grid-container">
          {gridItems.map((item, i) => (
            <div key={i} className="ref-grid-item">
              <h3 style={{ fontWeight: 'bold' }}>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="ref-transition-text">
          <p style={{ fontWeight: 'bold' }}>
            그리고
            <br />
            인공지능 연구로 산업과 사회에 기여합니다
          </p>
        </div>
      </section>

      {/* About / CHIEF: 스크롤 구간에서 걸리며 연역 표시, 사진 확대 (관리자 편집 가능) */}
      <EditableSection
        sectionKey="professor"
        content={professor}
        onSave={updateHome}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <ProfessorEditorModal
            title="교수님 정보 (이름 / 경력 / 주요 활동)"
            data={content}
            onSave={onSave}
            onCancel={onCancel}
            saving={saving}
          />
        )}
      >
        <section
          id="about"
          ref={aboutSectionRef}
          className="ref-showcase-section about-with-yeonyeok scroll-mt-24"
          style={{ minHeight: '260vh' }}
        >
          <div className="about-sticky-inner">
            <div className="about-expand-row">
              <div className={`about-left-col ${aboutExpanded ? 'expanded' : ''}`}>
                <div className="about-left-intro">
                  <span className="ref-highlight">CHIEF</span>
                  <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{professor.name} / {professor.nameKo}</h1>
                  {!aboutExpanded && (
                    <p>
                      {professor.title}, Applied AI Lab
                      <br />
                      {(professor.biography || [])[0] || ''}
                    </p>
                  )}
                </div>
                {aboutExpanded && (
                  <div className="about-yeonyeok-below chief-yeonyeok-list">
                    <h3 className="about-yeonyeok-title">경력</h3>
                    <ul className="about-yeonyeok-list">
                      {(professor.history || []).map((h, i) => (
                        <li key={i}>
                          <strong>{h.period}</strong> {h.desc}
                        </li>
                      ))}
                    </ul>
                    <h3 className="about-yeonyeok-title">주요 활동</h3>
                    <ul className="about-yeonyeok-list">
                      {(professor.biography || []).slice(1).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div
                className={`ref-showcase-image about-right-photo ${aboutExpanded ? 'expanded' : ''}`}
                style={{
                  backgroundImage: "url('/image/professor.png')",
                  backgroundSize: 'contain',
                  backgroundColor: '#f8f8f8',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </div>
          </div>
        </section>
      </EditableSection>

      {/* Research: CHIEF와 동일한 스크롤 구간 스티키 구조 */}
      <section
        id="research-intro"
        ref={researchSectionRef}
        className="ref-showcase-section about-with-yeonyeok scroll-mt-24"
        style={{ minHeight: '260vh' }}
      >
        <div className="about-sticky-inner">
          <div className="about-expand-row">
            <div
              className={`ref-showcase-image about-right-photo ${researchExpanded ? 'expanded' : ''}`}
              style={{
                backgroundImage: `url('${topicImages[0]}')`,
                backgroundSize: 'contain',
                backgroundColor: '#f8f8f8',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div className={`about-left-col ${researchExpanded ? 'expanded' : ''}`}>
              <div className="about-left-intro">
                <span className="ref-highlight">RESEARCH</span>
                <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>국내 최초 적용형 AI 연구</h1>
                {!researchExpanded && (
                  <p>
                    SOTA AI, 의료·환경 데이터 분석
                    <br />
                    논문, 특허, R&D 과제 수행
                  </p>
                )}
              </div>
              {/* 스크롤 구간에서만 표시: 4분면 그리드(4개 내용을 감싸는 컨테이너 1개) */}
              {researchExpanded && (
                <div className="about-yeonyeok-below research-quadrants">
                  {(researchTopics || []).slice(0, 4).map((item, idx) => (
                    <div key={idx} className="research-topic-block">
                      <h3 className="about-yeonyeok-title">{item.title}</h3>
                      {(item.sections || []).map((sec, sidx) => (
                        <div key={sidx}>
                          <h4 className="about-yeonyeok-title research-subtitle">{sec.subtitle}</h4>
                          <ul className="about-yeonyeok-list">
                            {(sec.items || []).map((bullet, bidx) => (
                              <li key={bidx}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VISION: 스크롤 구간 스티키 + content.js vision 데이터 */}
      <section
        id="vision-intro"
        ref={visionSectionRef}
        className="ref-showcase-section about-with-yeonyeok scroll-mt-24"
        style={{ minHeight: '260vh' }}
      >
        <div className="about-sticky-inner">
          <div className="about-expand-row">
            <div className={`about-left-col ${visionExpanded ? 'expanded' : ''}`}>
              <div className="about-left-intro">
                <span className="ref-highlight">VISION</span>
                <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Game Changer</h1>
                {!visionExpanded && (
                  <p>
                    시장을 선도하는 AI 연구 기준 제시
                  </p>
                )}
                {/* {!visionExpanded && (
                  <a href="#openings" className="mt-4 text-[#007bff] font-medium hover:underline">
                    채용 보기 →
                  </a>
                )} */}
              </div>
              {visionExpanded && visionContent && (
                <div className="about-yeonyeok-below vision-yeonyeok-list">
                  <ul className="about-yeonyeok-list">
                    {['content1', 'content2', 'content3', 'content4', 'content5'].map((key) => (
                      visionContent[key] && <li key={key}>{visionContent[key]}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div
              className={`ref-showcase-image about-right-photo ${visionExpanded ? 'expanded' : ''}`}
              style={{
                backgroundImage: `url('${topicImages[1]}')`,
                backgroundSize: 'contain',
                backgroundColor: '#f8f8f8',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        </div>
      </section>

      {/* Mid tagline - Ref style */}
      <section className="ref-mid-tagline">
        <h2 style={{ fontWeight: 'bold' }}>
          최고의 연구 역량에
          <br />
          AI 기술을 접목하여
          <br />
          새롭고 다양한 가치를 만들어갑니다.
        </h2>
      </section>

      {/* News - Light section */}
      <section id="news" className="ref-section-light scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <SectionTitle title="NEWS" subtitle="연구실 소식" />
            {isAdmin && (
              <Link
                to="/admin/news/add"
                className="px-5 py-2.5 bg-[#1e3a5f] text-white rounded-lg font-medium hover:opacity-90 text-sm"
              >
                + 뉴스 추가
              </Link>
            )}
          </div>
          <NewsCarousel items={news} isAdmin={isAdmin} onDelete={handleDeleteNews} />
        </div>
      </section>

      {/* About detail: Biography & History */}
      {/* <section className="ref-section-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] mb-6">Biography & History</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Biography</h3>
              <ul className="space-y-2 text-gray-700">
                {(professor.biography || []).map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#c9a227]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">History</h3>
              <ul className="space-y-3">
                {(professor.history || []).map((h, i) => (
                  <li key={i} className="flex flex-col sm:flex-row sm:gap-4">
                    <span className="font-semibold text-[#1e3a5f] min-w-[120px]">{h.period}</span>
                    <span className="text-gray-700">{h.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section> */}

      {/* Research detail (관리자 편집 가능) */}
      <EditableSection
        sectionKey="researchHighlights"
        content={researchHighlights}
        onSave={updateResearch}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <ResearchEditorModal
            title="Research Highlights (논문 / 특허 / R&D 프로젝트)"
            data={content}
            onSave={onSave}
            onCancel={onCancel}
            saving={saving}
          />
        )}
      >
        <section id="research" className="ref-section-light scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="Research" subtitle="Applied AI Lab 연구 분야 및 성과" />
            {!researchLoading && (
              <>
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Recent Publications</h3>
                  <ul className="space-y-2 text-gray-700">
                    {publications.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#c9a227]">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Patent & Technology Transfer</h3>
                  <ul className="space-y-2 text-gray-700">
                    {patent.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#c9a227]">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">R&D Projects</h3>
                  <div className="space-y-4">
                    {projects.map((p, i) => (
                      <div key={i} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm font-semibold text-[#1e3a5f]">{p.period}</p>
                        <h4 className="text-lg font-semibold text-gray-900 mt-1">{p.title}</h4>
                        <p className="text-gray-600 mt-1">
                          {p.org}, {p.budget}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </EditableSection>

      {/* Members */}
      <section id="members" className="ref-section-light scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          {!membersLoading && (
            <>
              {/* RESEARCHERS 편집 가능 */}
              <EditableSection
                sectionKey="researchers"
                content={researchers}
                onSave={updateMembers}
                renderEditor={(content, onSave, { saving, onCancel }) => (
                  <MembersEditorModal
                    title="RESEARCHERS (연구원 목록)"
                    data={content}
                    onSave={onSave}
                    onCancel={onCancel}
                    saving={saving}
                  />
                )}
              >
                <div className="mb-16">
                  <SectionTitle title="RESEARCHERS" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {researchers.map((p, i) => (
                      <PersonCard key={i} {...p} />
                    ))}
                  </div>
                </div>
              </EditableSection>

              {/* STUDENTS 편집 가능 */}
              <EditableSection
                sectionKey="students"
                content={students}
                onSave={updateMembers}
                renderEditor={(content, onSave, { saving, onCancel }) => (
                  <MembersEditorModal
                    title="STUDENTS (학생 목록)"
                    data={content}
                    onSave={onSave}
                    onCancel={onCancel}
                    saving={saving}
                  />
                )}
              >
                <div className="mb-16">
                  <SectionTitle title="STUDENTS" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((p, i) => (
                      <PersonCard key={i} {...p} />
                    ))}
                  </div>
                </div>
              </EditableSection>

              {/* Alumni 편집 가능 */}
              <EditableSection
                sectionKey="alumni"
                content={alumni}
                onSave={updateMembers}
                renderEditor={(content, onSave, { saving, onCancel }) => (
                  <MembersEditorModal
                    title="Alumni (졸업생 목록)"
                    data={content}
                    onSave={onSave}
                    onCancel={onCancel}
                    saving={saving}
                  />
                )}
              >
                <div>
                  <SectionTitle title="Alumni" />
                  <div className="space-y-4">
                    {alumni.map((p, i) => (
                      <div
                        key={i}
                        className="p-5 bg-white rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#c9a227] flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {p.profile_image ? (
                              <img src={p.profile_image} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg font-bold text-white">{(p.name || '?').charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900">{p.name}</h3>
                            <p className="text-sm text-gray-600">{p.role}</p>
                          </div>
                        </div>
                        <span className="text-sm text-[#1e3a5f] font-medium flex-shrink-0">{p.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </EditableSection>
            </>
          )}
        </div>
      </section>

      {/* Openings */}
      <EditableSection
        sectionKey="openings"
        content={openings}
        onSave={updateOpenings}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <OpeningsEditorModal
            title="Openings (채용 정보)"
            data={content}
            onSave={onSave}
            onCancel={onCancel}
            saving={saving}
          />
        )}
      >
        <section id="openings" className="ref-section-light scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="Openings" subtitle="Applied AI Lab에서 함께할 인재를 찾습니다." />
            {!openingsLoading && (
              <>
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">모집 분야</h3>
                  <ul className="space-y-2">
                    {positions.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#c9a227]" />
                        <span className="text-gray-800 font-medium">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Our Supporting & Benefits</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ol>
                </div>
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">How to Apply?</h3>
                  <p className="text-gray-700 mb-4">{contactText}</p>
                  <ul className="space-y-2">
                    {apply.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#c9a227]">-</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-[#1e3a5f]/5 rounded-xl border border-[#1e3a5f]/20">
                  <p className="font-semibold text-[#1e3a5f] mb-2">문의 및 지원</p>
                  <p className="text-gray-700 mb-4">위 서류를 이메일로 보내주세요.</p>
                  <a
                    href="#contact"
                    className="inline-block px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:opacity-90"
                  >
                    연락처 보기
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
      </EditableSection>

      {/* Contact */}
      <section id="contact" className="ref-section-light scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="CONTACT US" />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-6">연락처</h3>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <span className="font-semibold text-gray-900">전화</span>
                  <br />
                  <a
                    href={`tel:${(contact.phone || '').replace(/\s/g, '')}`}
                    className="text-[#1e3a5f] hover:underline"
                  >
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">이메일</span>
                  <br />
                  <a href={`mailto:${contact.email}`} className="text-[#1e3a5f] hover:underline">
                    {contact.email}
                  </a>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">주소</span>
                  <br />
                  {contact.address}
                  <br />
                  <span className="text-gray-600">{contact.room}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-6">문의하기</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>
                {contactStatus === 'success' && (
                  <p className="text-green-600 font-medium">문의가 접수되었습니다.</p>
                )}
                {contactStatus === 'error' && (
                  <p className="text-red-600 font-medium">전송에 실패했습니다. 이메일로 직접 연락해 주세요.</p>
                )}
                <button
                  type="submit"
                  disabled={contactStatus === 'sending'}
                  className="px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {contactStatus === 'sending' ? '전송 중...' : '보내기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Our Lab - 푸터 바로 위 */}
      <section className="ref-our-service-section">
        <div className="ref-service-header">
          <h2 style={{ fontWeight: 'bold' }}>Our Lab</h2>
          <p>Applied AI Lab과 함께하세요.</p>
        </div>
        <ul className="ref-service-list">
          <li className="ref-service-item">
            <a href="#about" className="flex flex-1 justify-between items-center w-full text-left hover:text-white">
              <span className="ref-service-name">소개</span>
              <span className="ref-service-desc">About · Professor</span>
            </a>
          </li>
          <li className="ref-service-item">
            <a href="#research" className="flex flex-1 justify-between items-center w-full text-left">
              <span className="ref-service-name">연구</span>
              <span className="ref-service-desc">Publications · R&D</span>
            </a>
          </li>
          <li className="ref-service-item">
            <a href="#members" className="flex flex-1 justify-between items-center w-full text-left hover:text-white">
              <span className="ref-service-name">멤버</span>
              <span className="ref-service-desc">Researchers · Students</span>
            </a>
          </li>
          <li className="ref-service-item">
            <a href="#openings" className="flex flex-1 justify-between items-center w-full text-left hover:text-white">
              <span className="ref-service-name">채용</span>
              <span className="ref-service-desc">Career · Openings</span>
            </a>
          </li>
          <li className="ref-service-item">
            <a href="#contact" className="flex flex-1 justify-between items-center w-full text-left hover:text-white">
              <span className="ref-service-name">문의</span>
              <span className="ref-service-desc">Contact</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
