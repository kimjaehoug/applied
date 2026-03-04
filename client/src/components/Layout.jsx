import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { hash: '#hero', label: '홈' },
  { hash: '#about', label: '소개' },
  { hash: '#news', label: '뉴스' },
  { hash: '#research', label: '연구' },
  { hash: '#members', label: '멤버' },
  { hash: '#openings', label: '채용' },
  { hash: '#contact', label: '문의' },
]

const isOpeningsSection = (pathname, hash) => pathname === '/' && hash === '#openings'

export default function Layout({ children }) {
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()
  const hash = location.pathname === '/' ? (location.hash || '#hero') : ''
  const showAdminUI = isOpeningsSection(location.pathname, location.hash)

  return (
    <div className="min-h-screen flex flex-col">
      {showAdminUI && isAdmin && (
        <div className="bg-amber-100 text-amber-900 py-1.5 px-4 text-center text-sm flex items-center justify-center gap-4">
          <span>관리자: {user?.username}</span>
          <button type="button" onClick={logout} className="underline hover:no-underline">로그아웃</button>
        </div>
      )}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center rounded-lg transition-opacity hover:opacity-80 active:opacity-70">
            <img src="/image/logo.png" alt="Applied AI Lab" className="h-8 sm:h-9" />
          </Link>
          <ul className="flex items-center gap-1 sm:gap-4">
            {navItems.map((item) => (
              <li key={item.hash}>
                <a
                  href={item.hash}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors block ${
                    hash === item.hash ? 'text-jbnu-navy bg-jbnu-navy/10' : 'text-gray-600 hover:text-jbnu-navy hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {showAdminUI && !isAdmin && (
              <li>
                <Link to="/admin/login" className="px-3 py-2 text-sm text-gray-500 hover:text-jbnu-navy">
                  관리자
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-jbnu-navy text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p className="font-semibold">Applied AI Lab</p>
          <p>Dept. of Software Engineering, Jeonbuk National University</p>
          <p className="mt-2 text-gray-300">567, Baekje-daero, Deokjin-gu, Jeonju-si, Jeonbuk-do, Republic of Korea</p>
          <p className="mt-1 text-gray-400">Engineering Building No.5, Room No. 309</p>
        </div>
      </footer>
    </div>
  )
}
