import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, logout, user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 text-gray-500">
        로딩 중...
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <h1 className="text-xl font-bold text-jbnu-navy mb-2 text-center">이미 로그인되어 있습니다</h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            관리자: <span className="font-semibold text-gray-900">{user?.username}</span>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(from, { replace: true })}
              className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200"
            >
              돌아가기
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout()
                navigate('/admin/login', { replace: true })
              }}
              className="flex-1 py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-jbnu-navy mb-6 text-center">관리자 로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jbnu-navy focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-jbnu-navy text-white rounded-lg font-medium hover:bg-jbnu-navy/90 disabled:opacity-50"
          >
            {submitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
