import SectionTitle from '../components/SectionTitle'
import { Link } from 'react-router-dom'
import EditableSection from '../components/EditableSection'
import EditJsonModal from '../components/EditJsonModal'
import { useContent } from '../contexts/ContentContext'

export default function Openings() {
  const { data, loading, updateSection } = useContent('openings')
  const openings = data.openings || {}
  const { positions = [], benefits = [], apply = [], contact: contactText = '' } = openings

  if (loading) return <div className="py-20 text-center text-gray-500">로딩 중...</div>

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Openings" subtitle="Applied AI Lab에서 함께할 인재를 찾습니다." />

        <EditableSection
          title="모집 정보"
          sectionKey="openings"
          content={openings}
          onSave={updateSection}
          renderEditor={(content, onSave, { saving, onCancel }) => (
            <EditJsonModal title="채용 정보 (positions, benefits, apply, contact)" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
          )}
        >
          <>
            <section className="mb-12">
              <h3 className="text-xl font-bold text-jbnu-navy mb-4">모집 분야</h3>
              <ul className="space-y-2">
                {positions.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-jbnu-gold" />
                    <span className="text-gray-800 font-medium">{p}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="mb-12">
              <h3 className="text-xl font-bold text-jbnu-navy mb-4">Our Supporting & Benefits</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ol>
            </section>
            <section className="mb-12">
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
            </section>
          </>
        </EditableSection>

        <div className="p-6 bg-jbnu-navy/5 rounded-xl border border-jbnu-navy/20">
          <p className="font-semibold text-jbnu-navy mb-2">문의 및 지원</p>
          <p className="text-gray-700 mb-4">위 서류를 이메일로 보내주세요.</p>
          <Link to="/contact" className="inline-block px-6 py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90">
            연락처 보기
          </Link>
        </div>
      </div>
    </div>
  )
}
