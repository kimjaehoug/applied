import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import EditableSection from '../components/EditableSection'
import EditJsonModal from '../components/EditJsonModal'
import { useContent } from '../contexts/ContentContext'

function PersonCard({ name, role, period, research }) {
  const initial = name?.charAt(0) || '?'
  return (
    <div className="p-6 bg-white/95 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-jbnu-navy to-jbnu-gold flex items-center justify-center text-xl font-bold text-white mb-3 shadow-md">
        {initial}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-jbnu-navy/5 text-xs font-semibold text-jbnu-navy">
          {role}
        </span>
        <span className="text-xs text-gray-500">{period}</span>
      </div>
      {research && <p className="text-sm text-gray-600 mt-3 leading-relaxed">{research}</p>}
    </div>
  )
}

export default function SinglePage() {
  const { data: homeData, loading: homeLoading, updateSection: updateHome } = useContent('home')
  const { data: researchData, loading: researchLoading, updateSection: updateResearch } = useContent('research')
  const { data: membersData, loading: membersLoading, updateSection: updateMembers } = useContent('members')
  const { data: openingsData, loading: openingsLoading, updateSection: updateOpenings } = useContent('openings')
  const { data: contactData } = useContent('contact')
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)

  const site = homeData.site || {}
  const professor = homeData.professor || {}
  const news = homeData.news || []
  const researchHighlights = researchData.researchHighlights || {}
  const { publications = [], patent = [], projects = [] } = researchHighlights
  const researchers = membersData.researchers || []
  const students = membersData.students || []
  const alumni = membersData.alumni || []
  const openings = openingsData.openings || {}
  const { positions = [], benefits = [], apply = [], contact: contactText = '' } = openings
  const contact = contactData.contact || {}

  const loading = homeLoading
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
    return <div className="py-20 text-center text-gray-500">로딩 중...</div>
  }

  const topicImages = ['/image/SOTAAI.png', '/image/medicine.png', '/image/environment.png']

  return (
    <div>
      {/* Hero */}
      <section id="hero" className="scroll-mt-[4.5rem] bg-gradient-to-br from-jbnu-navy via-slate-800 to-slate-900 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/10 text-gray-100 backdrop-blur">
            Applied AI Lab · JBNU
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-jbnu-gold">
            {site.name}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200">
            {site.dept}
          </p>
          <p className="text-sm sm:text-base text-gray-300">
            AI for Health · Environment · Society
          </p>
        </div>
      </section>

      {/* About / Professor */}
      <section id="about" className="scroll-mt-24 py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/95 rounded-3xl shadow-md border border-gray-100 px-6 sm:px-10 py-10 flex flex-col md:flex-row gap-12 items-start">
            <img src="/image/prope.jpg" alt={professor.name} className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl object-cover flex-shrink-0 shadow-md" />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-jbnu-navy mb-2">{professor.name}</h2>
              <p className="text-sm text-gray-500 mb-6">Professor, Applied AI Lab</p>
              <SectionTitle title="Biography" />
              <ul className="space-y-2 text-gray-700">
                {(professor.biography || []).map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-jbnu-gold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-jbnu-navy mb-4">History</h3>
                <ul className="space-y-3">
                  {(professor.history || []).map((h, i) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:gap-4">
                      <span className="font-semibold text-jbnu-navy min-w-[120px]">{h.period}</span>
                      <span className="text-gray-700">{h.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 pt-10 border-t border-gray-100">
                <h3 className="text-xl font-bold text-jbnu-navy mb-1">Our Topics</h3>
                <p className="text-sm text-gray-500 mb-8">Research areas we focus on</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {(professor.topics || []).map((t, i) => (
                    <article
                      key={i}
                      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-jbnu-navy/30 transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                        <img
                          src={topicImages[i] || topicImages[0]}
                          alt={t}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-center">
                        <h4 className="text-base font-semibold text-jbnu-navy text-center leading-snug">{t}</h4>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="scroll-mt-24 py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="NEWS" />
            <div className="space-y-6">
              {news.slice(0, 6).map((item, i) => (
                <article key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-sm text-jbnu-navy font-medium">{item.date} · {item.source}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

      {/* Research */}
      <section id="research" className="scroll-mt-24 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Research" subtitle="Applied AI Lab 연구 분야 및 성과" />
          {!researchLoading && (
            <>
              <div className="mb-16">
                <h3 className="text-xl font-bold text-jbnu-navy mb-4">Recent Publications</h3>
                <ul className="space-y-2 text-gray-700">
                  {publications.map((item, i) => (
                    <li key={i} className="flex gap-2"><span className="text-jbnu-gold">·</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-16">
                <h3 className="text-xl font-bold text-jbnu-navy mb-4">Patent & Technology Transfer</h3>
                <ul className="space-y-2 text-gray-700">
                  {patent.map((item, i) => (
                    <li key={i} className="flex gap-2"><span className="text-jbnu-gold">·</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-jbnu-navy mb-4">R&D Projects</h3>
                <div className="space-y-4">
                  {projects.map((p, i) => (
                    <div key={i} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-semibold text-jbnu-navy">{p.period}</p>
                      <h4 className="text-lg font-semibold text-gray-900 mt-1">{p.title}</h4>
                      <p className="text-gray-600 mt-1">{p.org}, {p.budget}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Members */}
      <section id="members" className="scroll-mt-24 py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="RESEARCHERS" />
          {!membersLoading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {researchers.map((p, i) => (
                  <PersonCard key={i} {...p} />
                ))}
              </div>
              <SectionTitle title="STUDENTS" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {students.map((p, i) => (
                  <PersonCard key={i} {...p} />
                ))}
              </div>
              <SectionTitle title="Alumni" />
              <div className="space-y-4">
                {alumni.map((p, i) => (
                  <div key={i} className="p-5 bg-white rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">{p.name}</h3>
                      <p className="text-sm text-gray-600">{p.role}</p>
                    </div>
                    <span className="text-sm text-jbnu-navy font-medium">{p.period}</span>
                  </div>
                ))}
              </div>
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
          <EditJsonModal title="채용 정보" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
        )}
      >
        <section id="openings" className="scroll-mt-24 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="Openings" subtitle="Applied AI Lab에서 함께할 인재를 찾습니다." />
            {!openingsLoading && (
              <>
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-jbnu-navy mb-4">모집 분야</h3>
                  <ul className="space-y-2">
                    {positions.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-jbnu-gold" />
                        <span className="text-gray-800 font-medium">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-jbnu-navy mb-4">Our Supporting & Benefits</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ol>
                </div>
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-jbnu-navy mb-4">How to Apply?</h3>
                  <p className="text-gray-700 mb-4">{contactText}</p>
                  <ul className="space-y-2">
                    {apply.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-jbnu-gold">-</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-jbnu-navy/5 rounded-xl border border-jbnu-navy/20">
                  <p className="font-semibold text-jbnu-navy mb-2">문의 및 지원</p>
                  <p className="text-gray-700 mb-4">위 서류를 이메일로 보내주세요.</p>
                  <a href="#contact" className="inline-block px-6 py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90">
                    연락처 보기
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
      </EditableSection>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="CONTACT US" />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-jbnu-navy mb-6">연락처</h3>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <span className="font-semibold text-gray-900">전화</span>
                  <br />
                  <a href={`tel:${(contact.phone || '').replace(/\s/g, '')}`} className="text-jbnu-navy hover:underline">{contact.phone}</a>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">이메일</span>
                  <br />
                  <a href={`mailto:${contact.email}`} className="text-jbnu-navy hover:underline">{contact.email}</a>
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
              <h3 className="text-xl font-bold text-jbnu-navy mb-6">문의하기</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input type="text" name="name" value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input type="email" name="email" value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                  <input type="text" name="subject" value={contactForm.subject} onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                  <textarea name="message" value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent" />
                </div>
                {contactStatus === 'success' && <p className="text-green-600 font-medium">문의가 접수되었습니다.</p>}
                {contactStatus === 'error' && <p className="text-red-600 font-medium">전송에 실패했습니다. 이메일로 직접 연락해 주세요.</p>}
                <button type="submit" disabled={contactStatus === 'sending'} className="px-6 py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90 disabled:opacity-50">
                  {contactStatus === 'sending' ? '전송 중...' : '보내기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
