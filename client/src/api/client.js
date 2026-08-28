const BASE = import.meta.env.DEV ? '' : '' // Vite proxy: /api -> backend

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || res.statusText)
  return data
}

export async function getContent(page) {
  const { data } = await api(`/api/content?page=${encodeURIComponent(page)}`)
  return data || {}
}

export async function putContent(page, section, content) {
  return api('/api/content', {
    method: 'PUT',
    body: JSON.stringify({ page, section, content }),
  })
}

export async function uploadNewsImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE}/api/uploads/news`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || res.statusText)
  return data
}

export async function uploadMemberImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE}/api/uploads/members`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || res.statusText)
  return data
}

export async function getNewsList() {
  const { data } = await api('/api/news')
  return data || []
}

export async function createNews({ title, body, source, date, imageFile, imageUrl }) {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('body', body || '')
  formData.append('source', source || '')
  formData.append('date', date || '')
  if (imageFile) formData.append('image', imageFile)
  else if (imageUrl) formData.append('imageUrl', imageUrl)

  const res = await fetch(`${BASE}/api/news`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || res.statusText)
  return data
}

export async function deleteNews(id) {
  return api(`/api/news/${id}`, { method: 'DELETE' })
}
