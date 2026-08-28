import { useState, useEffect } from 'react'

export default function ResearchEditorModal({ title, data, onSave, onCancel, saving }) {
  const [publications, setPublications] = useState([])
  const [patent, setPatent] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    setPublications([...(data?.publications || [])])
    setPatent([...(data?.patent || [])])
    setProjects([...(data?.projects || [])].map((p) => ({ period: p.period || '', title: p.title || '', org: p.org || '', budget: p.budget || '' })))
  }, [data])

  const addPublication = () => setPublications((p) => [...p, ''])
  const removePublication = (i) => setPublications((p) => p.filter((_, idx) => idx !== i))
  const setPublication = (i, v) => setPublications((p) => p.map((x, idx) => (idx === i ? v : x)))

  const addPatent = () => setPatent((p) => [...p, ''])
  const removePatent = (i) => setPatent((p) => p.filter((_, idx) => idx !== i))
  const setPatentItem = (i, v) => setPatent((p) => p.map((x, idx) => (idx === i ? v : x)))

  const addProject = () => setProjects((p) => [...p, { period: '', title: '', org: '', budget: '' }])
  const removeProject = (i) => setProjects((p) => p.filter((_, idx) => idx !== i))
  const setProject = (i, field, v) =>
    setProjects((p) => p.map((x, idx) => (idx === i ? { ...x, [field]: v } : x)))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      publications: publications.filter(Boolean),
      patent: patent.filter(Boolean),
      projects: projects.filter((p) => p.title || p.period || p.org || p.budget),
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recent Publications */}
        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">Recent Publications</h4>
          <div className="space-y-2">
            {publications.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setPublication(i, e.target.value)}
                  placeholder="논문 내용"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <button type="button" onClick={() => removePublication(i)} className="px-2 text-red-600 hover:bg-red-50 rounded">
                  삭제
                </button>
              </div>
            ))}
            <button type="button" onClick={addPublication} className="text-sm text-[#1e3a5f] font-medium hover:underline">
              + 항목 추가
            </button>
          </div>
        </div>

        {/* Patent & Technology Transfer */}
        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">Patent & Technology Transfer</h4>
          <div className="space-y-2">
            {patent.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setPatentItem(i, e.target.value)}
                  placeholder="특허/기술이전 내용"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
                <button type="button" onClick={() => removePatent(i)} className="px-2 text-red-600 hover:bg-red-50 rounded">
                  삭제
                </button>
              </div>
            ))}
            <button type="button" onClick={addPatent} className="text-sm text-[#1e3a5f] font-medium hover:underline">
              + 항목 추가
            </button>
          </div>
        </div>

        {/* R&D Projects */}
        <div>
          <h4 className="text-sm font-semibold text-[#1e3a5f] mb-2">R&D Projects</h4>
          <div className="space-y-4">
            {projects.map((p, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={p.period}
                    onChange={(e) => setProject(i, 'period', e.target.value)}
                    placeholder="기간 (예: 2021-2024)"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                  />
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => setProject(i, 'title', e.target.value)}
                    placeholder="프로젝트명"
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                  />
                  <input
                    type="text"
                    value={p.org}
                    onChange={(e) => setProject(i, 'org', e.target.value)}
                    placeholder="기관 (예: 환경부)"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                  />
                  <input
                    type="text"
                    value={p.budget}
                    onChange={(e) => setProject(i, 'budget', e.target.value)}
                    placeholder="예산 (예: 60억 원, 3+1년)"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                  />
                </div>
                <button type="button" onClick={() => removeProject(i)} className="text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded">
                  이 프로젝트 삭제
                </button>
              </div>
            ))}
            <button type="button" onClick={addProject} className="text-sm text-[#1e3a5f] font-medium hover:underline">
              + R&D 프로젝트 추가
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
