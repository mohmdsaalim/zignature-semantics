import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiUserCircle, HiOutlineUserCircle, HiOutlineBell, HiOutlineBriefcase } from 'react-icons/hi2'
import { useNavbarStore } from '../../stores/navbarStore'
import { useAuthStore } from '../../stores/authStore'
import { useNotificationStore } from '../../stores/notificationStore'
import NotificationDropdown from './NotificationDropdown'
import logo from '../../assets/Logo.PNG'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { navLinks } = useNavbarStore()
  const { isAuthenticated, logout } = useAuthStore()
  const storeUser = useAuthStore((state) => state.user);
  const { unreadCount, fetchNotifications } = useNotificationStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated, fetchNotifications])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isNotificationOpen && !e.target.closest('.notification-container')) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNotificationOpen])

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    await logout()
    navigate('/')
    setIsUserMenuOpen(false)
  }

  return (
    <>
      {/* Spacer to prevent content from hiding under the fixed navbar */}
      <div className="h-20 md:h-24 w-full" aria-hidden="true"></div>

      <header className="fixed top-0 left-0 w-full bg-white border-b-4 border-primary-900 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">

            {/* --- LOGO --- */}
            <div className="flex-shrink-0 flex items-center h-full py-3">
              <Link to="/" className="flex items-center h-full hover:opacity-80 transition-opacity">
                <img src={logo} alt="ZEG Logo" className="h-10 md:h-12 w-auto object-contain mix-blend-darken" />
              </Link>
            </div>

            {/* --- DESKTOP NAVIGATION --- */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2.5 text-[15px] font-black uppercase tracking-[0.15em] border-2 transition-all
                    ${isActive(link.path) 
                      ? 'bg-primary-100 border-primary-900 text-primary-900 shadow-[3px_3px_0_0_#1e3a8a]' 
                      : 'border-transparent text-primary-700 hover:border-primary-900 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* --- DESKTOP ACTIONS (Right Side) --- */}
            <div className="hidden lg:flex items-center gap-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {/* Find Jobs Button */}
                  <Link 
                    to="/careers"
                    className="flex items-center gap-2 text-sm font-black text-primary-900 uppercase tracking-widest px-5 py-2.5 border-2 border-primary-900 bg-white shadow-[4px_4px_0_0_#1e3a8a] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                  >
                    <HiOutlineBriefcase className="w-5 h-5" />
                    <span>Serach Jobs</span>
                  </Link>

                  {/* Notification Bell (Boxy) */}
                  {/* <div className="notification-container relative">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative w-11 h-11 border-2 border-primary-900 bg-primary-50 flex items-center justify-center text-primary-900 shadow-[4px_4px_0_0_#1e3a8a] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                    >
                      <HiOutlineBell className="w-6 h-6" />
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 border-2 border-primary-900 rounded-none"></span>
                  </button>
                    {isNotificationOpen && (
                      <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                    )}
                  </div> */}

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-11 h-11 border-2 border-primary-900 bg-primary-600 flex items-center justify-center text-white shadow-[4px_4px_0_0_#1e3a8a] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all focus:outline-none"
                    >
                      <HiOutlineUserCircle className="w-7 h-7" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-4 w-56 bg-white border-4 border-primary-900 shadow-[8px_8px_0_0_#1e3a8a] flex flex-col z-50">
                        <div className="px-4 py-3 border-b-2 border-primary-900 bg-primary-50">
                          <p className="text-sm font-black text-primary-900 truncate">{storeUser?.username || "User"}</p>
                          <p className="text-xs font-bold text-primary-600 truncate">{storeUser?.email || ""}</p>
                        </div>
                        <Link to="/profile" className="px-4 py-3 text-sm font-black text-primary-900 uppercase tracking-wider hover:bg-primary-100 border-b-2 border-primary-900">
                          My Profile
                        </Link>
                        <Link to="/contact" className="px-4 py-3 text-sm font-black text-primary-900 uppercase tracking-wider hover:bg-primary-100 border-b-2 border-primary-900">
                          Contact
                        </Link>
                        <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm font-black text-white bg-red-600 uppercase tracking-wider hover:bg-red-700 transition-colors">
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-[15px] font-black text-primary-900 uppercase tracking-widest hover:text-primary-600 px-2 py-2">
                    Sign In
                  </Link>
                  <Link to="/register" className="boxy-btn text-[15px]">
                    Join Now
                  </Link>
                </div>
              )}
            </div>

            {/* --- MOBILE HAMBURGER BUTTON (YOUR CUSTOM ANIMATION RESTORED) --- */}
            <div className="flex items-center gap-4 lg:hidden">
              {/* Show bell on mobile if auth'd */}
              {/* {isAuthenticated && (
                <div className="notification-container relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative w-11 h-11 border-2 border-primary-900 bg-primary-50 flex items-center justify-center text-primary-900 shadow-[4px_4px_0_0_#1e3a8a] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                  >
                    <HiOutlineBell className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 border-2 border-primary-900 rounded-none"></span>
                    )}
                  </button>
                  {isNotificationOpen && (
                    <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                  )}
                </div>
              )} */}
              
              <button
                className="w-12 h-12 border-2 border-primary-900 bg-primary-50 flex items-center justify-center text-primary-900 shadow-[4px_4px_0_0_#1e3a8a] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {/* YOUR ORIGINAL ANIMATED HAMBURGER SPANS */}
                <span className="relative w-6 h-0.5 bg-current">
                  <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'top-0 rotate-45' : '-top-2'}`}></span>
                  <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-0'}`}></span>
                  <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'top-0 -rotate-45' : 'top-2'}`}></span>
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* --- MOBILE MENU OVERLAY (Massive & Blocky) --- */}
        <div className={`lg:hidden border-t-4 border-primary-900 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen border-b-4' : 'max-h-0 border-b-0'}`}>
          <div className="bg-white flex flex-col">
            
            {/* Main Links */}
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-6 py-5 text-xl font-black uppercase tracking-widest border-b-2 border-primary-900/20 
                    ${isActive(link.path) ? 'bg-primary-100 text-primary-900' : 'text-primary-800 hover:bg-primary-50'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Auth Actions */}
            <div className="p-6 bg-primary-50 flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/careers" className="boxy-btn text-center w-full text-lg">
                    Search Jobs
                  </Link>
                  <Link to="/profile" className="boxy-btn-secondary text-center w-full text-lg">
                    My Profile
                  </Link>
                  <button onClick={handleSignOut} className="w-full py-4 mt-2 border-2 border-primary-900 bg-red-600 text-white font-black text-lg uppercase tracking-wider shadow-[4px_4px_0_0_#1e3a8a] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="boxy-btn-secondary text-center w-full text-lg">
                    Sign In
                  </Link>
                  <Link to="/register" className="boxy-btn text-center w-full text-lg">
                    Create Account
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar