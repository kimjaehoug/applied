import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function EditableSection({ title, sectionKey, content, onSave, children, renderEditor }) {
  const { isAdmin } = useAuth()
  const { pathname, hash } = useLocation()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const canEdit = isAdmin && (pathname === '/openings' || (pathname === '/' && hash === '#openings'))

  const handleSave = async (newContent) => {
    setSaving(true)
    try {
      await onSave(sectionKey, newContent)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (!canEdit) {
    return <>{children}</>
  }

  return (
    <section className="relative group">
      {(title || canEdit) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-2xl font-bold text-jbnu-navy">{title}</h2>}
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            >
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
