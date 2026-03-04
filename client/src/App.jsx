import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ContentProvider } from './contexts/ContentContext'
import Layout from './components/Layout'
import SinglePage from './pages/SinglePage'
import AdminLogin from './pages/AdminLogin'

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<SinglePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
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
  )
}

export default App
