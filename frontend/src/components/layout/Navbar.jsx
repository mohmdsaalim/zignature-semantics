import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiEnvelope } from 'react-icons/hi2'
import { useNavbarStore } from '../../stores/navbarStore'
import logo from '../../assets/Logo.jpg'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { navLinks } = useNavbarStore()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      <div className="h-16 w-full md:hidden" aria-hidden="true"></div>
      <div className="h-24 w-full hidden md:block" aria-hidden="true"></div>

      <header className="fixed top-0 left-0 w-full bg-white border-b-4 border-primary-900 z-[100]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-24">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center md:pr-8 h-full">
              <Link to="/" className="flex items-center h-full">
                <img src={logo} alt="ZEG Logo" className="h-12 md:h-full py-2 md:py-3 w-auto object-contain mix-blend-darken origin-left" />
              </Link>
            </div>

            {/* Desktop Links */}
            <nav className="hidden md:flex space-x-12 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group relative text-[15px] font-black text-[#1409e6] uppercase tracking-[0.15em] py-2"
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-primary-900 transform origin-left transition-transform duration-300 ease-out ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <Link to="/contact" className="boxy-btn text-sm flex items-center space-x-2">
              <HiEnvelope size={18} />
              <span>Contact</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-primary-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="relative w-6 h-0.5 bg-current">
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'top-0 rotate-45' : '-top-2'}`}></span>
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-0'}`}></span>
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'top-0 -rotate-45' : 'top-2'}`}></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`md:hidden bg-white shadow-lg border-t-2 border-primary-900 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-[15px] font-black uppercase tracking-[0.15em] transition-colors duration-200 ${isActive(link.path) ? 'text-[#1409e6]' : 'text-gray-700 hover:text-[#1409e6]'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar