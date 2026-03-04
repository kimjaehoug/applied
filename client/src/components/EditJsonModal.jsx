import { useState, useEffect } from 'react'

export default function EditJsonModal({ title, data, onSave, onCancel, saving }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setText(JSON.stringify(data, null, 2))
    setError('')
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      const parsed = JSON.parse(text)
      onSave(parsed)
    } catch (err) {
      setError('유효한 JSON이 아닙니다.')
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          spellCheck={false}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
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
      </form>
    </div>
  )
}
