import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import EditableSection from '../components/EditableSection'
import EditJsonModal from '../components/EditJsonModal'
import { useContent } from '../contexts/ContentContext'

export default function Contact() {
  const { data, loading, updateSection } = useContent('contact')
  const contact = data.contact || {}
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (loading) return <div className="py-20 text-center text-gray-500">로딩 중...</div>

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="CONTACT US" />

        <div className="grid md:grid-cols-2 gap-12">
          <EditableSection
            title="연락처"
            sectionKey="contact"
            content={contact}
            onSave={updateSection}
            renderEditor={(content, onSave, { saving, onCancel }) => (
              <EditJsonModal title="연락처 정보 (phone, email, address, room)" data={content} onSave={onSave} onCancel={onCancel} saving={saving} />
            )}
          >
            <div>
              <h3 className="text-xl font-bold text-jbnu-navy mb-6">연락처</h3>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <span className="font-semibold text-gray-900">전화</span>
                  <br />
                  <a href={`tel:${(contact.phone || '').replace(/\s/g, '')}`} className="text-jbnu-navy hover:underline">
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">이메일</span>
                  <br />
                  <a href={`mailto:${contact.email}`} className="text-jbnu-navy hover:underline">
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
          </EditableSection>

          <div>
            <h3 className="text-xl font-bold text-jbnu-navy mb-6">문의하기</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent" />
              </div>
              {status === 'success' && <p className="text-green-600 font-medium">문의가 접수되었습니다.</p>}
              {status === 'error' && <p className="text-red-600 font-medium">전송에 실패했습니다. 이메일로 직접 연락해 주세요.</p>}
              <button type="submit" disabled={status === 'sending'} className="px-6 py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90 disabled:opacity-50">
                {status === 'sending' ? '전송 중...' : '보내기'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
