import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'

export default function EditableSection({ title, sectionKey, content, onSave, children, renderEditor }) {
  const { isAdmin } = useAuth()
  const { t, locale } = useLocale()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const canEdit = isAdmin
  const localeLabel = locale === 'ko' ? 'KO' : 'EN'

  const handleSave = async (newContent) => {
    setSaving(true)
    setError('')
    try {
      await onSave(sectionKey, newContent)
      setEditing(false)
    } catch (e) {
      setError(e.message || t('edit_save_fail'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="relative group editable-section">
      {(title || canEdit) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-2xl font-bold text-[var(--ink)]">{title}</h2>}
          {canEdit && !editing && (
            <button type="button" onClick={() => setEditing(true)} className="edit-chip">
              {t('edit')} · {localeLabel}
            </button>
          )}
        </div>
      )}

      {canEdit && editing && (
        <p className="edit-locale-hint">
          {t('edit_locale_hint')} <strong>{localeLabel}</strong>
        </p>
      )}

      {error && <p className="form-err mb-3">{error}</p>}

      {editing && renderEditor ? (
        <div className="edit-panel">
          {renderEditor(content, handleSave, { saving, onCancel: () => setEditing(false) })}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
