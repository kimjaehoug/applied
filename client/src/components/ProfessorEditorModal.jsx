import { useState, useEffect } from 'react'

export default function ProfessorEditorModal({ title, data, onSave, onCancel, saving }) {
  const [name, setName] = useState('')
  const [nameKo, setNameKo] = useState('')
  const [profTitle, setProfTitle] = useState('')
  const [biography, setBiography] = useState([])
  const [history, setHistory] = useState([])

  useEffect(() => {
    setName(data?.name || '')
    setNameKo(data?.nameKo || '')
    setProfTitle(data?.title || '')
    setBiography([...(data?.biography || [])])
    setHistory(
      Array.isArray(data?.history)
        ? data.history.map((h) => ({ period: h.period || '', desc: h.desc || '' }))
        : []
    )
  }, [data])

  const addBio = () => setBiography((prev) => [...prev, ''])
  const removeBio = (i) => setBiography((prev) => prev.filter((_, idx) => idx !== i))
  const updateBio = (i, v) => setBiography((prev) => prev.map((x, idx) => (idx === i ? v : x)))

  const addHistory = () =>
    setHistory((prev) => [...prev, { period: '', desc: '' }])
  const removeHistory = (i) =>
    setHistory((prev) => prev.filter((_, idx) => idx !== i))
  const updateHistory = (i, field, v) =>
    setHistory((prev) => prev.map((h, idx) => (idx === i ? { ...h, [field]: v } : h)))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...data,
      name,
      nameKo,
      title: profTitle,
      biography: biography.filter(Boolean),
      history: history.filter((h) => h.period || h.desc),
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 (영문)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
          />
          <input
            type="text"
            value={nameKo}
            onChange={(e) => setNameKo(e.target.value)}
            placeholder="이름 (한글)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
          />
          <input
            type="text"
            value={profTitle}
            onChange={(e) => setProfTitle(e.target.value)}
            placeholder="직함 (예: Professor)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
          />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">주요 활동 (Biography)</h4>
          <div className="space-y-2">
            {biography.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={b}
                  onChange={(e) => updateBio(i, e.target.value)}
                  placeholder="활동 내용"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeBio(i)}
                  className="px-2 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBio}
              className="text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              + 활동 추가
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">경력 (History)</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {history.map((h, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start border border-gray-200 rounded-lg p-3 bg-gray-50/70">
                <input
                  type="text"
                  value={h.period}
                  onChange={(e) => updateHistory(i, 'period', e.target.value)}
                  placeholder="기간 (예: 2022 - )"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <div className="sm:col-span-2 flex gap-2">
                  <input
                    type="text"
                    value={h.desc}
                    onChange={(e) => updateHistory(i, 'desc', e.target.value)}
                    placeholder="경력 설명"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeHistory(i)}
                    className="px-2 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addHistory}
              className="text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              + 경력 추가
            </button>
          </div>
        </div>

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

