import SectionTitle from '../components/SectionTitle'
import EditableSection from '../components/EditableSection'
import EditJsonModal from '../components/EditJsonModal'
import { useContent } from '../contexts/ContentContext'

export default function About() {
  const { data, loading, updateSection } = useContent('about')
  const site = data.site || {}
  const professor = data.professor || {}
  const news = data.news || []

  if (loading) return <div className="py-20 text-center text-gray-500">로딩 중...</div>

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <EditableSection
          title="소개"
          sectionKey="professor"
          content={professor}
          onSave={updateSection}
          renderEditor={(content, onSave, { saving, onCancel }) => (
            <EditJsonModal title="교수 프로필" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
          )}
        >
          <section id="profile" className="scroll-mt-24">
            <SectionTitle title="소개" subtitle={site.dept || '전북대 소프트웨어공학과'} />
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <img src="/image/prope.jpg" alt={professor.name} className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-jbnu-navy mb-6">{professor.name}</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Biography</h3>
                <ul className="space-y-2 text-gray-700">
                  {(professor.biography || []).map((item, i) => (
                    <li key={i} className="flex gap-2"><span className="text-jbnu-gold">•</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </EditableSection>

        <section id="awards" className="mt-16 scroll-mt-24">
          <SectionTitle title="수상경력" />
          <ul className="space-y-2 text-gray-700">
            <li>• 2024 환경 R&D 우수성과 20선</li>
            <li>• 전북대학교 77주년 미래인재상 대상 수상, 공과대학 우수교수상</li>
            <li>• 스탠포드대와 엘스비어 '세계 상위 2% 연구자' 선정 (2025년판)</li>
          </ul>
        </section>

        <section id="history" className="mt-16 scroll-mt-24">
          <SectionTitle title="History" />
          <ul className="space-y-4">
            {(professor.history || []).map((h, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:gap-6 p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold text-jbnu-navy min-w-[140px]">{h.period}</span>
                <span className="text-gray-700">{h.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <EditableSection
          title="NEWS"
          sectionKey="news"
          content={news}
          onSave={updateSection}
          renderEditor={(content, onSave, { saving, onCancel }) => (
            <EditJsonModal title="뉴스 목록" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
          )}
        >
          <section className="mt-16">
            <SectionTitle title="NEWS" />
            <div className="space-y-4">
              {news.map((item, i) => (
                <article key={i} className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <p className="text-sm text-jbnu-navy font-medium">{item.date} · {item.source}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        </EditableSection>
      </div>
    </div>
  )
}
