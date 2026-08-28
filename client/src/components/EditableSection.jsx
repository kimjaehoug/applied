import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function EditableSection({ title, sectionKey, content, onSave, children, renderEditor }) {
  const { isAdmin } = useAuth()
  const { pathname, hash } = useLocation()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // 관리자라면 어떤 페이지/섹션이든 편집 가능하게 통일
  const canEdit = isAdmin

  const handleSave = async (newContent) => {
    setSaving(true)
    try {
      await onSave(sectionKey, newContent)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="relative group">
      {(title || canEdit) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-2xl font-bold text-jbnu-navy">{title}</h2>}
          {canEdit && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 bg-white/90 text-xs font-medium text-gray-700 shadow-sm hover:bg-jbnu-navy hover:text-white hover:border-jbnu-navy transition-all duration-150"
            >
              <span className="inline-block w-3.5 h-3.5">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M4 13.5L4.5 10.5L11.5 3.5L14.5 6.5L7.5 13.5L4 13.5Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 4L14 7"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              편집
            </button>
          )}
        </div>
      )}

      {editing && renderEditor ? (
        <div className="border-2 border-jbnu-gold/50 rounded-xl p-4 bg-amber-50/50">
          {renderEditor(content, handleSave, { saving, onCancel: () => setEditing(false) })}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
