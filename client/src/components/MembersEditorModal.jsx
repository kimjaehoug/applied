import { useState, useEffect, useRef } from 'react'
import { uploadMemberImage } from '../api/client'

export default function MembersEditorModal({ title, data, onSave, onCancel, saving }) {
  const [items, setItems] = useState([])
  const fileInputsRef = useRef({})
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setItems(
      Array.isArray(data)
        ? data.map((m) => ({
            name: m.name || '',
            role: m.role || '',
            period: m.period || '',
            research: m.research || '',
            profile_image: m.profile_image || '',
          }))
        : []
    )
    setError('')
  }, [data])

  const addItem = () => {
    setItems((prev) => [...prev, { name: '', role: '', period: '', research: '', profile_image: '' }])
  }

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  const handleUploadClick = (index) => {
    const input = fileInputsRef.current[index]
    if (input) input.click()
  }

  const handleFileChange = async (index, file) => {
    if (!file) return
    setUploadingIndex(index)
    setError('')
    try {
      const { url } = await uploadMemberImage(file)
      updateItem(index, 'profile_image', url)
    } catch (e) {
      setError(e.message || '이미지 업로드에 실패했습니다.')
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleaned = items.filter((m) => m.name || m.role || m.period || m.research || m.profile_image)
    onSave(cleaned)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {items.map((m, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50/70 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#6fa99a] flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {m.profile_image ? (
                    <img src={m.profile_image} alt={m.name || 'member'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-white">{(m.name || '?').charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUploadClick(index)}
                    className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  >
                    {uploadingIndex === index ? '업로드 중...' : '사진 업로드'}
                  </button>
                  <input
                    ref={(el) => {
                      fileInputsRef.current[index] = el
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(index, e.target.files?.[0])}
                  />
                  <input
                    type="text"
                    value={m.profile_image}
                    onChange={(e) => updateItem(index, 'profile_image', e.target.value)}
                    placeholder="이미지 URL (옵션)"
                    className="flex-1 min-w-[220px] px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={m.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  placeholder="이름"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <input
                  type="text"
                  value={m.role}
                  onChange={(e) => updateItem(index, 'role', e.target.value)}
                  placeholder="역할 (예: Researcher, PhD Student)"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <input
                  type="text"
                  value={m.period}
                  onChange={(e) => updateItem(index, 'period', e.target.value)}
                  placeholder="기간 (예: 2025 Mar-)"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
              </div>
              <textarea
                value={m.research}
                onChange={(e) => updateItem(index, 'research', e.target.value)}
                placeholder="연구 분야 / 간단 설명 (선택)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                >
                  이 멤버 삭제
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            + 멤버 추가
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

