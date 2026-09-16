import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../i18n/LocaleContext'

const isOpeningsSection = (pathname, hash) => pathname === '/' && hash === '#openings'

export default function Layout({ children }) {
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()
  const { locale, setLocale, t } = useLocale()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLightSurface, setIsLightSurface] = useState(false)
  const hash = location.pathname === '/' ? (location.hash || '#hero') : ''
  const showAdminUI = isOpeningsSection(location.pathname, location.hash)

  const navItems = [
    { hash: '#hero', label: t('nav_about') },
    { hash: '#news', label: t('nav_news') },
    { hash: '#research', label: t('nav_research') },
    { hash: '#members', label: t('nav_members') },
    { hash: '#openings', label: t('nav_career') },
    { hash: '#contact', label: t('nav_contact') },
  ]

  useEffect(() => {
    const lightSections = new Set(['about', 'research-intro', 'vision-intro', 'news', 'research', 'members', 'openings', 'contact'])
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
      const probe = document.elementFromPoint(window.innerWidth / 2, Math.min(window.innerHeight * 0.35, window.innerHeight - 1))
      const section = probe?.closest('section')
      setIsLightSurface(Boolean(section && lightSections.has(section.id)))
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col site-shell">
      {showAdminUI && isAdmin && (
        <div className="fixed top-14 left-0 right-0 z-[999] bg-amber-100 text-amber-900 py-1.5 px-4 text-center text-sm flex items-center justify-center gap-4">
          <span>{t('admin_banner')}: {user?.username}</span>
          <button type="button" onClick={logout} className="underline hover:no-underline">{t('logout')}</button>
        </div>
      )}
      <header className={`ref-header ${isScrolled ? 'is-scrolled' : ''} ${isLightSurface ? 'is-light-surface' : ''}`}>
        <Link to="/" className="flex items-center rounded-lg transition-opacity hover:opacity-80">
          <img
            src="/image/logo.png"
            alt="Applied AI Lab"
            className="h-10 sm:h-12 max-h-14 w-auto object-contain brightness-0 invert"
          />
        </Link>
        <div className="ref-header-actions">
          <nav className="ref-nav" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.hash}
                href={item.hash}
                className={hash === item.hash ? 'opacity-100' : ''}
              >
                {item.label}
              </a>
            ))}
            <Link to="/admin/login" className="opacity-80 hover:opacity-100">{t('nav_admin')}</Link>
          </nav>
          <div className="lang-toggle" role="group" aria-label={t('lang_aria')}>
            <button
              type="button"
              className={locale === 'en' ? 'is-active' : ''}
              onClick={() => setLocale('en')}
              aria-pressed={locale === 'en'}
            >
              {t('lang_en')}
            </button>
            <button
              type="button"
              className={locale === 'ko' ? 'is-active' : ''}
              onClick={() => setLocale('ko')}
              aria-pressed={locale === 'ko'}
            >
              {t('lang_ko')}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="site-footer-brand">Applied AI Lab</p>
          <p className="site-footer-dept">{t('footer_dept')}</p>
          <p className="site-footer-meta">567, Baekje-daero, Deokjin-gu, Jeonju-si, Jeonbuk-do, Republic of Korea</p>
          <p className="site-footer-meta">Engineering Building No.5, Room No. 309</p>
          <p className="site-footer-admin">
            <Link to="/admin/login">Admin</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
