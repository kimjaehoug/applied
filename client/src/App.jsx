import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ContentProvider } from './contexts/ContentContext'
import { LocaleProvider } from './i18n/LocaleContext'
import Layout from './components/Layout'
import SinglePage from './pages/SinglePage'
import AdminLogin from './pages/AdminLogin'
import NewsAdd from './pages/NewsAdd'

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <ContentProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<SinglePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/news/add" element={<NewsAdd />} />
              <Route path="/about" element={<Navigate to="/#about" replace />} />
              <Route path="/research" element={<Navigate to="/#research" replace />} />
              <Route path="/members" element={<Navigate to="/#members" replace />} />
              <Route path="/openings" element={<Navigate to="/#openings" replace />} />
              <Route path="/contact" element={<Navigate to="/#contact" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ContentProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}

export default App
