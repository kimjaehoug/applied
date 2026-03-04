import { useState, useEffect, useRef } from 'react'
import { uploadNewsImage } from '../api/client'

export default function NewsEditorModal({ title, data, onSave, onCancel, saving }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const [uploadingIndex, setUploadingIndex] = useState(null)

  useEffect(() => {
    setItems(Array.isArray(data) ? data : [])
    setError('')
  }, [data])

  const handleChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  const handleAdd = () => {
    setItems((prev) => [...prev, { date: '', title: '', source: '', body: '', image: '' }])
  }

  const handleRemove = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadClick = (index) => {
    setUploadingIndex(index)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || uploadingIndex == null) return
    try {
      setError('')
      const { url } = await uploadNewsImage(file)
      setItems((prev) =>
        prev.map((item, i) => (i === uploadingIndex ? { ...item, image: url } : item)),
      )
    } catch (err) {
      setError(err.message || '이미지 업로드에 실패했습니다.')
    } finally {
      setUploadingIndex(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    onSave(items)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  뉴스 {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-xs text-red-600 hover:underline"
                >
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    날짜
                  </label>
                  <input
                    type="text"
                    value={item.date || ''}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    출처
                  </label>
                  <input
                    type="text"
                    value={item.source || ''}
                    onChange={(e) => handleChange(index, 'source', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    이미지 경로
                  </label>
                  <input
                    type="text"
                    value={item.image || ''}
                    onChange={(e) => handleChange(index, 'image', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                    placeholder="/uploads/news/파일명.png"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  본문
                </label>
                <textarea
                  value={item.body || ''}
                  onChange={(e) => handleChange(index, 'body', e.target.value)}
                  rows={3}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleUploadClick(index)}
                    className="px-3 py-1.5 bg-jbnu-navy text-white rounded-md text-xs font-medium hover:bg-jbnu-navy/90"
                  >
                    {uploadingIndex === index ? '업로드 중...' : '이미지 업로드'}
                  </button>
                  {item.image && (
                    <span className="text-xs text-gray-500 truncate max-w-[160px]">
                      {item.image}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-xs text-gray-500">
              아직 등록된 뉴스가 없습니다. 아래 &quot;뉴스 추가&quot; 버튼으로 새 항목을
              만들어 주세요.
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
          >
            뉴스 추가
          </button>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-jbnu-navy text-white rounded-lg text-sm font-medium disabled:opacity-50"
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
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </form>
    </div>
  )
}

