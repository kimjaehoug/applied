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
