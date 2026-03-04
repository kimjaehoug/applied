import SectionTitle from '../components/SectionTitle'
import EditableSection from '../components/EditableSection'
import EditJsonModal from '../components/EditJsonModal'
import { useContent } from '../contexts/ContentContext'

function PersonCard({ name, role, period, research }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="w-20 h-20 rounded-full bg-jbnu-navy/10 flex items-center justify-center text-xl font-bold text-jbnu-navy mb-3">
        {name?.charAt(0) || '?'}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-jbnu-navy font-medium">{role} ({period})</p>
      {research && <p className="text-sm text-gray-600 mt-2">{research}</p>}
    </div>
  )
}

export default function Members() {
  const { data, loading, updateSection } = useContent('members')
  const researchers = data.researchers || []
  const students = data.students || []
  const alumni = data.alumni || []

  if (loading) return <div className="py-20 text-center text-gray-500">로딩 중...</div>

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <EditableSection
          title="RESEARCHERS"
          sectionKey="researchers"
          content={researchers}
          onSave={updateSection}
          renderEditor={(content, onSave, { saving, onCancel }) => (
            <EditJsonModal title="연구원 목록" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
          )}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {researchers.map((p, i) => (
              <PersonCard key={i} {...p} />
            ))}
          </div>
        </EditableSection>

        <EditableSection
          title="STUDENTS"
          sectionKey="students"
          content={students}
          onSave={updateSection}
          renderEditor={(content, onSave, { saving, onCancel }) => (
            <EditJsonModal title="학생 목록" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
          )}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {students.map((p, i) => (
              <PersonCard key={i} {...p} />
            ))}
          </div>
        </EditableSection>

        <EditableSection
          title="Alumni"
          sectionKey="alumni"
          content={alumni}
          onSave={updateSection}
          renderEditor={(content, onSave, { saving, onCancel }) => (
            <EditJsonModal title="Alumni 목록" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
          )}
        >
          <div className="space-y-4">
            {alumni.map((p, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.role}</p>
                </div>
                <span className="text-sm text-jbnu-navy font-medium">{p.period}</span>
              </div>
            ))}
          </div>
        </EditableSection>
      </div>
    </div>
  )
}
