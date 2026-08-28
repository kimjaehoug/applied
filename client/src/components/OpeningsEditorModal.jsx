import { useState, useEffect } from 'react'

export default function OpeningsEditorModal({ title, data, onSave, onCancel, saving }) {
  const [positions, setPositions] = useState([])
  const [benefits, setBenefits] = useState([])
  const [apply, setApply] = useState([])
  const [contactText, setContactText] = useState('')

  useEffect(() => {
    setPositions([...(data?.positions || [])])
    setBenefits([...(data?.benefits || [])])
    setApply([...(data?.apply || [])])
    setContactText(data?.contact || '')
  }, [data])

  const addItem = (setter) => setter((prev) => [...prev, ''])
  const removeItem = (setter, i) => setter((prev) => prev.filter((_, idx) => idx !== i))
  const updateItem = (setter, i, v) => setter((prev) => prev.map((x, idx) => (idx === i ? v : x)))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      positions: positions.filter(Boolean),
      benefits: benefits.filter(Boolean),
      apply: apply.filter(Boolean),
      contact: contactText,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 모집 분야 */}
        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">모집 분야 (positions)</h4>
          <div className="space-y-2">
            {positions.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={p}
                  onChange={(e) => updateItem(setPositions, i, e.target.value)}
                  placeholder="예: Master Program"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeItem(setPositions, i)}
                  className="px-2 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(setPositions)}
              className="text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              + 모집 분야 추가
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">Benefits</h4>
          <div className="space-y-2">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={b}
                  onChange={(e) => updateItem(setBenefits, i, e.target.value)}
                  placeholder="혜택/지원 내용"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeItem(setBenefits, i)}
                  className="px-2 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(setBenefits)}
              className="text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              + Benefit 추가
            </button>
          </div>
        </div>

        {/* How to apply? 목록 */}
        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">지원 서류 / 방법 (apply)</h4>
          <div className="space-y-2">
            {apply.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={a}
                  onChange={(e) => updateItem(setApply, i, e.target.value)}
                  placeholder="예: CV, Official Transcript"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeItem(setApply, i)}
                  className="px-2 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(setApply)}
              className="text-sm text-[#1e3a5f] font-medium hover:underline"
            >
              + 항목 추가
            </button>
          </div>
        </div>

        {/* How to apply? 설명 텍스트 */}
        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">How to Apply? 설명 (contact)</h4>
          <textarea
            value={contactText}
            onChange={(e) => setContactText(e.target.value)}
            rows={3}
            placeholder="예: 위 서류를 이메일로 보내주세요."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
          />
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

