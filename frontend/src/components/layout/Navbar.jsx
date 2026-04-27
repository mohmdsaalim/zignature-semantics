import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiEnvelope, HiUser, HiBell, HiBriefcase, HiUserCircle, HiOutlineUserCircle, HiOutlineBell, HiOutlineBriefcase } from 'react-icons/hi2'
import { useNavbarStore } from '../../stores/navbarStore'
import { useAuthStore } from '../../stores/authStore'
import logo from '../../assets/Logo.PNG'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { navLinks } = useNavbarStore()
  const { isAuthenticated, logout } = useAuthStore()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleSignOut = async () => {
    await logout()
    navigate('/')
    setIsUserMenuOpen(false)
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
                  className="group relative text-[15px] font-black text-primary-600 uppercase tracking-[0.15em] py-2 hover:text-primary-900"
                >
                  {link.label}
                  {/* <span className={`absolute bottom-1 left-0 w-full h-[2px] bg-primary-600 transform origin-left transition-transform duration-300 ease-out ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span> */}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA - Sign In OR User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/careers"
                  className="flex items-center gap-2 text-[15px] font-black text-primary-900 uppercase tracking-[0.15em] py-2 hover:text-primary-600 hover:bg-primary-50 border-2 rounded-full p-4 border-primary-900 hover:border-primary-600 transition-colors"
                >
                  <HiOutlineBriefcase className="w-7 h-7" />
                  <span>Job Search</span>
                </Link>

                <button className="p-2 text-primary-900 hover:text-primary-600 transition-colors">
                  <HiOutlineBell className="w-7 h-7" />
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 transition-colors rounded-full"
                  >
                    <div className="w-8 h-8 text-primary-900 flex items-center justify-center hover:text-primary-600">
                      <HiOutlineUserCircle className="w-7 h-7" />
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-primary-900 shadow-[4px_4px_0_0_#1e3a8a]">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm font-bold text-primary-900 uppercase hover:bg-primary-50 border-b border-primary-900/20"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/careers"
                        className="block px-4 py-3 text-sm font-bold text-primary-900 uppercase hover:bg-primary-50 border-b border-primary-900/20"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Browse Jobs
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-3 text-sm font-bold text-red-600 uppercase hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="boxy-btn text-sm flex items-center space-x-2">
                <HiUserCircle size={18} />
                <span>Sign In</span>
              </Link>
            )}

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
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/careers"
                  className="block py-2 text-[15px] font-black uppercase tracking-[0.15em] text-gray-700 hover:text-[#1409e6]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Job Search
                </Link>
                <Link
                  to="/profile"
                  className={`block py-2 text-[15px] font-black uppercase tracking-[0.15em] transition-colors duration-200 ${isActive('/profile') ? 'text-[#1409e6]' : 'text-gray-700 hover:text-[#1409e6]'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="block py-2 text-[15px] font-black uppercase tracking-[0.15em] text-gray-700 hover:text-[#1409e6]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`block py-2 text-[15px] font-black uppercase tracking-[0.15em] transition-colors duration-200 ${isActive('/login') ? 'text-[#1409e6]' : 'text-gray-700 hover:text-[#1409e6]'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar