import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import EditableSection from '../components/EditableSection'
import MembersEditorModal from '../components/MembersEditorModal'
import ResearchEditorModal from '../components/ResearchEditorModal'
import OpeningsEditorModal from '../components/OpeningsEditorModal'
import ProfessorEditorModal from '../components/ProfessorEditorModal'
import NewsCarousel from '../components/NewsCarousel'
import { useContent } from '../contexts/ContentContext'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'
import {
  researchByLocale,
  visionByLocale,
  localizeNewsItem,
} from '../i18n/localizedContent'
import { research as researchKo, vision as visionKo } from '../data/content'
import { getNewsList, deleteNews } from '../api/client'

function PersonCard({ name, role, period, research, profile_image }) {
  const initial = name?.charAt(0) || '?'
  return (
    <article className="member-card">
      <div className="member-card-top">
        <div className="member-avatar">
          {profile_image ? (
            <img src={profile_image} alt={name} />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <div className="member-card-identity">
          <h3>{name}</h3>
          <p className="member-role">{role}</p>
        </div>
      </div>
      {period && <p className="member-period">{period}</p>}
      {research && <p className="member-research">{research}</p>}
    </article>
  )
}

export default function SinglePage() {
  const { locale, t } = useLocale()
  const { data: homeData, loading: homeLoading, updateSection: updateHome } = useContent('home')
  const { data: researchData, loading: researchLoading, updateSection: updateResearch } = useContent('research')
  const { data: membersData, loading: membersLoading, updateSection: updateMembers } = useContent('members')
  const { data: openingsData, loading: openingsLoading, updateSection: updateOpenings } = useContent('openings')
  const { data: contactData } = useContent('contact')
  const { isAdmin } = useAuth()
  const [newsItems, setNewsItems] = useState([])
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)
  const [contactFeedback, setContactFeedback] = useState('')
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
    if (!window.confirm(t('news_delete_confirm'))) return
    try {
      await deleteNews(id)
      setNewsItems((prev) => prev.filter((n) => n.id !== id))
    } catch {
      alert(t('news_delete_fail'))
    }
  }

  const site = homeData.site || {}
  // Editable CMS content is shown as saved in both locales (UI chrome is translated separately).
  const professor = homeData.professor || {}
  const professorRaw = professor

  const newsRaw = newsItems.length > 0 ? newsItems : (homeData.news || [])
  const news = newsRaw.map((item) => localizeNewsItem(item, locale))

  const researchTopics = locale === 'en' ? researchByLocale.en : researchKo
  const visionContent = locale === 'en' ? visionByLocale.en : visionKo

  const researchHighlights = researchData.researchHighlights || {}
  const researchHighlightsRaw = researchHighlights
  const { publications = [], patent = [], projects = [] } = researchHighlights

  const researchers = membersData.researchers || []
  const students = membersData.students || []
  const alumni = membersData.alumni || []
  const openings = openingsData.openings || {}
  const { positions = [], benefits = [], apply = [], contact: contactText = '' } = openings
  const contact = contactData.contact || {}
  const loading = homeLoading

  const gridItems = [
    { title: t('grid_ai'), desc: t('grid_ai_desc'), image: '/image/card-ai-research.png' },
    { title: t('grid_collab'), desc: t('grid_collab_desc'), image: '/image/card-technology-transfer.png' },
    { title: t('grid_pub'), desc: t('grid_pub_desc'), image: '/image/tile-publications.svg' },
    { title: t('grid_rnd'), desc: t('grid_rnd_desc'), image: '/image/card-rnd.png' },
  ]

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
      setResearchExpanded(inStickyRange && scrollInto > 30 && scrollInto < vh * 0.9)
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
    setContactFeedback('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok !== false) {
        setContactStatus('success')
        setContactFeedback(data.message || t('form_success'))
        setContactForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setContactStatus('error')
        setContactFeedback(data.message || t('form_error'))
      }
    } catch {
      setContactStatus('error')
      setContactFeedback(t('form_error'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--ink-soft)]">
        {t('loading')}
      </div>
    )
  }

  const topicImages = ['/image/research-field-plate.svg', '/image/VISION.png', '/image/environment.png']
  const midLines = t('mid_tagline').split('\n')
  const researchSubLines = t('research_intro_sub').split('\n')

  return (
    <div className="single-page" lang={locale}>
      <section
        id="hero"
        className="ref-hero scroll-mt-20"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          const x = (event.clientX - rect.left) / rect.width
          const y = (event.clientY - rect.top) / rect.height
          event.currentTarget.style.setProperty('--mx', `${(x - 0.5) * 18}px`)
          event.currentTarget.style.setProperty('--my', `${(y - 0.5) * 14}px`)
          event.currentTarget.style.setProperty('--rx', `${(0.5 - x) * 11}deg`)
          event.currentTarget.style.setProperty('--ry', `${(0.5 - y) * 9}deg`)
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.setProperty('--mx', '0px')
          event.currentTarget.style.setProperty('--my', '0px')
          event.currentTarget.style.setProperty('--rx', '0deg')
          event.currentTarget.style.setProperty('--ry', '0deg')
        }}
      >
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/video/background_video.mp4" type="video/mp4" />
        </video>
        <div className="ref-hero-content">
          <p className="hero-eyebrow">{t('hero_eyebrow')}</p>
          <h1>
            {t('hero_line1')}
            <br />
            {t('hero_line2')}
          </h1>
          <p className="ref-hero-sub">
            {site.name} · {site.dept}
          </p>
          <div className="hero-cta-row">
            <a href="#research" className="hero-cta hero-cta-primary">{t('nav_research')}</a>
            <a href="#contact" className="hero-cta hero-cta-ghost">{t('nav_contact')}</a>
          </div>
        </div>
        <div className="hero-orbit-visual" aria-hidden="true">
          <img src="/image/hero-neural-orbit.svg" alt="" />
          <span className="hero-orbit-label">{t('hero_orbit')}</span>
        </div>
      </section>

      <section className="ref-dark-grid-section">
        <div className="ref-grid-container">
          {gridItems.map((item, i) => (
            <div key={i} className="ref-grid-item">
              <img className="ref-grid-image" src={item.image} alt="" loading="lazy" decoding="async" />
              <div className="ref-grid-copy">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="ref-transition-text">
          <p>
            {t('bridge_line1')}
            <br />
            {t('bridge_line2')}
          </p>
        </div>
      </section>

      <EditableSection
        sectionKey="professor"
        content={professorRaw}
        onSave={updateHome}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <ProfessorEditorModal
            title="Professor"
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
                  <h1>
                    <span className="professor-name-en">{professor.name}</span>
                    {locale === 'ko' && <span className="professor-name-ko">{professor.nameKo}</span>}
                  </h1>
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
                    <h3 className="about-yeonyeok-title">{t('career_heading')}</h3>
                    <ul className="about-yeonyeok-list">
                      {(professor.history || []).map((h, i) => (
                        <li key={i}>
                          <strong>{h.period}</strong> {h.desc}
                        </li>
                      ))}
                    </ul>
                    <h3 className="about-yeonyeok-title">{t('activity_heading')}</h3>
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
                  backgroundPosition: '42% center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </div>
          </div>
        </section>
      </EditableSection>

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
                backgroundSize: 'cover',
                backgroundColor: '#dcece8',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div className={`about-left-col ${researchExpanded ? 'expanded' : ''}`}>
              <div className="about-left-intro">
                <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{t('research_intro_title')}</h1>
                {!researchExpanded && (
                  <p>
                    {researchSubLines[0]}
                    <br />
                    {researchSubLines[1]}
                  </p>
                )}
              </div>
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
                <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{t('vision_title')}</h1>
                {!visionExpanded && <p>{t('vision_sub')}</p>}
              </div>
              {visionExpanded && visionContent && (
                <div className="about-yeonyeok-below vision-yeonyeok-list">
                  <ul className="about-yeonyeok-list">
                    {['content1', 'content2', 'content3', 'content4', 'content5'].map(
                      (key) => visionContent[key] && <li key={key}>{visionContent[key]}</li>
                    )}
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

      <section className="ref-mid-tagline">
        <h2>
          {midLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < midLines.length - 1 && <br />}
            </span>
          ))}
        </h2>
      </section>

      <section id="news" className="ref-section-light scroll-mt-24">
        <div className="news-section-inner mx-auto">
          <div className="flex items-center justify-between mb-2 gap-4">
            <SectionTitle title={t('news_title')} subtitle={t('news_sub')} />
            {isAdmin && (
              <Link to="/admin/news/add" className="action-chip">
                {t('news_add')}
              </Link>
            )}
          </div>
          <NewsCarousel items={news} isAdmin={isAdmin} onDelete={handleDeleteNews} />
        </div>
      </section>

      <EditableSection
        sectionKey="researchHighlights"
        content={researchHighlightsRaw}
        onSave={updateResearch}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <ResearchEditorModal
            title="Research Highlights"
            data={content}
            onSave={onSave}
            onCancel={onCancel}
            saving={saving}
          />
        )}
      >
        <section id="research" className="ref-section-light research-outcomes scroll-mt-24">
          <div className="news-section-inner mx-auto">
            <SectionTitle title={t('research_title')} subtitle={t('research_sub')} />

            {!researchLoading && (
              <>
                <div className="research-stat-line" aria-label="Research highlights">
                  <div className="research-stat">
                    <strong>30+</strong>
                    <span>{t('research_metric_papers')}</span>
                  </div>
                  <div className="research-stat">
                    <strong>23</strong>
                    <span>{t('research_metric_patents')}</span>
                  </div>
                  <div className="research-stat">
                    <strong>16</strong>
                    <span>{t('research_metric_copyrights')}</span>
                  </div>
                </div>

                <div className="research-split">
                  <div className="research-panel">
                    <h3>{t('pubs_heading')}</h3>
                    <ol className="research-soft-list">
                      {publications.map((item, i) => (
                        <li key={i}>
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          <p>{item}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="research-panel">
                    <h3>{t('patent_heading')}</h3>
                    <ul className="research-soft-list research-soft-list-dots">
                      {patent.map((item, i) => (
                        <li key={i}>
                          <p>{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="research-projects-block">
                  <h3>{t('projects_heading')}</h3>
                  <div className="research-project-grid">
                    {projects.map((p, i) => (
                      <article key={i} className="research-project-item">
                        <p className="project-period">{p.period}</p>
                        <h4>{p.title}</h4>
                        <p className="research-project-meta">
                          {p.org}
                          <span aria-hidden="true"> · </span>
                          {p.budget}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </EditableSection>

      <section id="members" className="ref-section-light members-section scroll-mt-24">
        <div className="news-section-inner mx-auto">
          {!membersLoading && (
            <>
              <EditableSection
                sectionKey="researchers"
                content={researchers}
                onSave={updateMembers}
                renderEditor={(content, onSave, { saving, onCancel }) => (
                  <MembersEditorModal
                    title={t('researchers')}
                    data={content}
                    onSave={onSave}
                    onCancel={onCancel}
                    saving={saving}
                  />
                )}
              >
                <div className="members-block">
                  <div className="members-block-head">
                    <SectionTitle title={t('researchers')} subtitle={t('researchers_sub')} />
                    <span className="members-count">{String(researchers.length).padStart(2, '0')}</span>
                  </div>
                  <div className="member-grid">
                    {researchers.map((p, i) => (
                      <PersonCard key={i} {...p} />
                    ))}
                  </div>
                </div>
              </EditableSection>

              <EditableSection
                sectionKey="students"
                content={students}
                onSave={updateMembers}
                renderEditor={(content, onSave, { saving, onCancel }) => (
                  <MembersEditorModal
                    title={t('students')}
                    data={content}
                    onSave={onSave}
                    onCancel={onCancel}
                    saving={saving}
                  />
                )}
              >
                <div className="members-block">
                  <div className="members-block-head">
                    <SectionTitle title={t('students')} subtitle={t('students_sub')} />
                    <span className="members-count">{String(students.length).padStart(2, '0')}</span>
                  </div>
                  <div className="member-grid member-grid-dense">
                    {students.map((p, i) => (
                      <PersonCard key={i} {...p} />
                    ))}
                  </div>
                </div>
              </EditableSection>

              <EditableSection
                sectionKey="alumni"
                content={alumni}
                onSave={updateMembers}
                renderEditor={(content, onSave, { saving, onCancel }) => (
                  <MembersEditorModal
                    title={t('alumni')}
                    data={content}
                    onSave={onSave}
                    onCancel={onCancel}
                    saving={saving}
                  />
                )}
              >
                <div className="members-block members-block-last">
                  <div className="members-block-head">
                    <SectionTitle title={t('alumni')} subtitle={t('alumni_sub')} />
                    <span className="members-count">{String(alumni.length).padStart(2, '0')}</span>
                  </div>
                  <div className="alumni-stack">
                    {alumni.map((p, i) => (
                      <div key={i} className="alumni-row">
                        <div className="alumni-identity">
                          <div className="member-avatar member-avatar-sm">
                            {p.profile_image ? (
                              <img src={p.profile_image} alt={p.name} />
                            ) : (
                              <span>{(p.name || '?').charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h3>{p.name}</h3>
                            <p>{p.role}</p>
                          </div>
                        </div>
                        <span className="member-period">{p.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </EditableSection>
            </>
          )}
        </div>
      </section>

      <EditableSection
        sectionKey="openings"
        content={openings}
        onSave={updateOpenings}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <OpeningsEditorModal
            title="Openings"
            data={content}
            onSave={onSave}
            onCancel={onCancel}
            saving={saving}
          />
        )}
      >
        <section id="openings" className="ref-section-light scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={t('openings_title')} subtitle={t('openings_sub')} />
            {!openingsLoading && (
              <>
                <div className="outcome-block">
                  <h3>{t('positions_heading')}</h3>
                  <ul className="outcome-list plain">
                    {positions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="outcome-block">
                  <h3>{t('benefits_heading')}</h3>
                  <ol className="outcome-olist">
                    {benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ol>
                </div>
                <div className="outcome-block">
                  <h3>{t('apply_heading')}</h3>
                  <p className="mb-4 text-[var(--ink-soft)]">{contactText}</p>
                  <ul className="outcome-list">
                    {apply.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="apply-panel">
                  <p className="apply-panel-title">{t('apply_cta_title')}</p>
                  <p className="apply-panel-body">{t('apply_cta_body')}</p>
                  <a href="#contact" className="action-chip">
                    {t('apply_cta_button')}
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
      </EditableSection>

      <section id="contact" className="ref-section-light scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title={t('contact_title')} />
          <div className="contact-grid">
            <div>
              <h3>{t('contact_info')}</h3>
              <ul className="contact-list">
                <li>
                  <span>{t('contact_phone')}</span>
                  <a href={`tel:${(contact.phone || '').replace(/\s/g, '')}`}>{contact.phone}</a>
                </li>
                <li>
                  <span>{t('contact_email')}</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
                <li>
                  <span>{t('contact_address')}</span>
                  <p>
                    {contact.address}
                    <br />
                    {contact.room}
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <h3>{t('contact_form')}</h3>
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div>
                  <label htmlFor="contact-name">{t('form_name')}</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-email">{t('form_email')}</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject">{t('form_subject')}</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-message">{t('form_message')}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    required
                    rows={4}
                  />
                </div>
                {contactStatus === 'success' && <p className="form-ok">{contactFeedback || t('form_success')}</p>}
                {contactStatus === 'error' && <p className="form-err">{contactFeedback || t('form_error')}</p>}
                <button type="submit" disabled={contactStatus === 'sending'} className="action-chip">
                  {contactStatus === 'sending' ? t('form_sending') : t('form_send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="ref-our-service-section">
        <div className="ref-service-header">
          <h2>{t('our_lab')}</h2>
          <p>{t('our_lab_sub')}</p>
        </div>
        <ul className="ref-service-list">
          <li className="ref-service-item">
            <a href="#about" className="flex flex-1 justify-between items-center w-full text-left">
              <span className="ref-service-name">{t('lab_about')}</span>
              <span className="ref-service-desc">{t('lab_about_desc')}</span>
            </a>
          </li>
          <li className="ref-service-item">
            <a href="#research" className="flex flex-1 justify-between items-center w-full text-left">
              <span className="ref-service-name">{t('lab_research')}</span>
              <span className="ref-service-desc">{t('lab_research_desc')}</span>
            </a>
          </li>
          <li className="ref-service-item">
            <a href="#members" className="flex flex-1 justify-between items-center w-full text-left">
              <span className="ref-service-name">{t('lab_members')}</span>
              <span className="ref-service-desc">{t('lab_members_desc')}</span>
            </a>
          </li>
          <li className="ref-service-item">
            <a href="#openings" className="flex flex-1 justify-between items-center w-full text-left">
              <span className="ref-service-name">{t('lab_career')}</span>
              <span className="ref-service-desc">{t('lab_career_desc')}</span>
            </a>
          </li>
          <li className="ref-service-item">
            <a href="#contact" className="flex flex-1 justify-between items-center w-full text-left">
              <span className="ref-service-name">{t('lab_contact')}</span>
              <span className="ref-service-desc">{t('lab_contact_desc')}</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
