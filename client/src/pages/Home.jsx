import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import EditableSection from '../components/EditableSection'
import EditJsonModal from '../components/EditJsonModal'
import { useContent } from '../contexts/ContentContext'

export default function Home() {
  const { data, loading, updateSection } = useContent('home')
  const site = data.site || {}
  const professor = data.professor || {}
  const news = data.news || []

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">로딩 중...</div>
    )
  }

  return (
    <div>
      <EditableSection
        title=""
        sectionKey="site"
        content={site}
        onSave={updateSection}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <EditJsonModal title="사이트 정보 (Hero)" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
        )}
      >
        <section className="bg-gradient-to-br from-jbnu-navy to-slate-800 text-white py-10 sm:py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Welcome to {site.name}</h1>
            <p className="text-lg sm:text-xl text-gray-200">{site.dept}</p>
          </div>
        </section>
      </EditableSection>

      <EditableSection
        title=""
        sectionKey="professor"
        content={professor}
        onSave={updateSection}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <EditJsonModal title="교수 소개" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
        )}
      >
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <img src="/image/prope.jpg" alt={professor.name} className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-jbnu-navy mb-6">{professor.name}</h2>
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
                    {(professor.topics || []).map((t, i) => {
                      const topicImages = ['/image/SOTAAI.png', '/image/medicine.png', '/image/environment.png']
                      const imgSrc = topicImages[i] || topicImages[0]
                      return (
                        <article
                          key={i}
                          className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-jbnu-navy/20 transition-all duration-300"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                            <img
                              src={imgSrc}
                              alt={t}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-jbnu-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-center">
                            <h4 className="text-base font-semibold text-jbnu-navy text-center leading-snug">
                              {t}
                            </h4>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      <EditableSection
        title="NEWS"
        sectionKey="news"
        content={news}
        onSave={updateSection}
        renderEditor={(content, onSave, { saving, onCancel }) => (
          <EditJsonModal title="뉴스 목록" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
        )}
      >
        <section className="py-16 px-4 bg-gray-50">
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
            <div className="mt-8 text-center">
              <Link to="/about" className="text-jbnu-navy font-semibold hover:underline">더보기 →</Link>
            </div>
          </div>
        </section>
      </EditableSection>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4">
          <Link to="/research" className="px-6 py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90">연구</Link>
          <Link to="/members" className="px-6 py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90">멤버</Link>
          <Link to="/openings" className="px-6 py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90">채용</Link>
          <Link to="/contact" className="px-6 py-3 bg-jbnu-gold text-jbnu-navy rounded-lg font-medium hover:bg-jbnu-gold/90">문의</Link>
        </div>
      </section>
    </div>
  )
}
