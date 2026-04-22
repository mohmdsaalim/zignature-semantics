import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import AboutPage from './pages/about/AboutPage'
import ServicesPage from './pages/services/ServicesPage'
import CareersPage from './pages/careers/CareersPage'
import ContactPage from './pages/contact/ContactPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
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