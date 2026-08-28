import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { hash: '#hero', label: 'ABOUT' },
  { hash: '#news', label: 'NEWS' },
  { hash: '#research', label: 'RESEARCH' },
  { hash: '#members', label: 'MEMBERS' },
  { hash: '#openings', label: 'CAREER' },
  { hash: '#contact', label: 'CONTACT' },
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
        <div className="fixed top-14 left-0 right-0 z-[999] bg-amber-100 text-amber-900 py-1.5 px-4 text-center text-sm flex items-center justify-center gap-4">
          <span>관리자: {user?.username}</span>
          <button type="button" onClick={logout} className="underline hover:no-underline">로그아웃</button>
        </div>
      )}
      <header className="ref-header">
        <Link to="/" className="flex items-center rounded-lg transition-opacity hover:opacity-80">
          <img 
          src="/image/logo.png" 
          alt="Applied AI Lab" 
          className="h-10 sm:h-12 max-h-14 w-auto object-contain brightness-0 invert" 
          />
        </Link>
        <nav className="ref-nav">
          {navItems.map((item) => (
            <a
              key={item.hash}
              href={item.hash}
              className={hash === item.hash ? 'opacity-100' : ''}
            >
              {item.label}
            </a>
          ))}
          <Link to="/admin/login" className="ml-2 opacity-80 hover:opacity-100">ADMIN</Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-[#050505] text-white py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p className="font-semibold">Applied AI Lab</p>
          <p className="mt-1 text-gray-400">Dept. of Software Engineering, Jeonbuk National University</p>
          <p className="mt-2 text-gray-500">567, Baekje-daero, Deokjin-gu, Jeonju-si, Jeonbuk-do, Republic of Korea</p>
          <p className="mt-1 text-gray-500">Engineering Building No.5, Room No. 309</p>
          <p className="mt-3 text-xs text-gray-500">
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
