import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import AboutPage from './pages/about/AboutPage'
import ServicesPage from './pages/services/ServicesPage'
import CareersPage from './pages/careers/CareersPage'
import ContactPage from './pages/contact/ContactPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/auth/ProfilePage'
import { useAuthStore } from './stores/authStore'

function AppLoader() {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent animate-spin" />
        <p className="font-mono text-xs uppercase tracking-widest text-primary-600">
          Loading...
        </p>
      </div>
    </div>
  )
}

function App() {
  const { initAuth, isInitialized } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [])

  if (!isInitialized) {
    return <AppLoader />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App