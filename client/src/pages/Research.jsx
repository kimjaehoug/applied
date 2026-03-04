import SectionTitle from '../components/SectionTitle'
import EditableSection from '../components/EditableSection'
import EditJsonModal from '../components/EditJsonModal'
import { useContent } from '../contexts/ContentContext'

export default function Research() {
  const { data, loading, updateSection } = useContent('research')
  const researchHighlights = data.researchHighlights || {}
  const { publications = [], patent = [], projects = [] } = researchHighlights

  if (loading) return <div className="py-20 text-center text-gray-500">로딩 중...</div>

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Research" subtitle="Applied AI Lab 연구 분야 및 성과" />

        <EditableSection
          title="Recent Publications"
          sectionKey="researchHighlights"
          content={researchHighlights}
          onSave={updateSection}
          renderEditor={(content, onSave, { saving, onCancel }) => (
            <EditJsonModal title="연구 성과 (publications, patent, projects)" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
          )}
        >
          <>
            <section className="mb-16">
              <h3 className="text-xl font-bold text-jbnu-navy mb-4">Recent Publications</h3>
              <ul className="space-y-2 text-gray-700">
                {publications.map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-jbnu-gold">·</span>{item}</li>
                ))}
              </ul>
            </section>
            <section className="mb-16">
              <h3 className="text-xl font-bold text-jbnu-navy mb-4">Patent & Technology Transfer</h3>
              <ul className="space-y-2 text-gray-700">
                {patent.map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-jbnu-gold">·</span>{item}</li>
                ))}
              </ul>
            </section>
            <section>
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
            </section>
          </>
        </EditableSection>

        <p className="mt-12 text-gray-500 text-sm text-center">논문 목록은 원본 사이트의 Publications 섹션을 참고해 주세요.</p>
      </div>
    </div>
  )
}
