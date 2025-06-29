import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-brand-dark-blue text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex text-brand-beige items-center">
            <Link to="/" className="flex text-[#ead8b1] items-center">
              <i className="fas fa-bus text-2xl mr-2 animate-bounce"></i>
              <span className="font-display  font-bold text-xl">BusTrack</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium text-white hover:text-brand-beige transition-colors duration-200 nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`font-medium text-white hover:text-brand-beige transition-colors duration-200 nav-link ${isActive("/about") ? "active" : ""}`}
            >
              About
            </Link>
            <Link
              to="/features"
              className={`font-medium text-white hover:text-brand-beige transition-colors duration-200 nav-link ${isActive("/features") ? "active" : ""}`}
            >
              Features
            </Link>
            <Link
              to="/users"
              className={`font-medium text-white hover:text-brand-beige transition-colors duration-200 nav-link ${isActive("/users") ? "active" : ""}`}
            >
              Target Users
            </Link>
            <Link
              to="/contact"
              className={`font-medium text-white hover:text-brand-beige transition-colors duration-200 nav-link ${isActive("/contact") ? "active" : ""}`}
            >
              Contact
            </Link>

            {/* Weather Widget */}
            <div className="hidden lg:flex items-center text-white">
              <i className="fas fa-sun weather-icon mr-1"></i>
              <span className="text-sm">28°C</span>
            </div>

            {/* Language Selector */}
            <div className="relative inline-block text-left">
              <select className="appearance-none bg-transparent border border-gray-600 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-brand-beige">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>

            {/* Notification Bell */}
            {user && <NotificationBell />}

            {/* User Info or Sign In */}
            {!user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.firstName || 'User')}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-brand-beige"
                />
                <span className="font-semibold text-brand-beige">{user.firstName} {user.lastName}</span>
                
                {/* Role-based navigation */}
                {user.role === 'admin' && (
                  <Link to="/admin-dashboard" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold">Admin</Link>
                )}
                {user.role === 'manager' && (
                  <Link to="/manager-dashboard" className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 font-bold">Manager</Link>
                )}
                {user.role === 'driver' && (
                  <Link to="/driver-dashboard" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-bold">Driver</Link>
                )}
                
                {(user.role === 'admin' || user.role === 'manager') && (
                  <Link to="/attendance" className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 font-bold">Attendance</Link>
                )}
                
                <Link to="/profile" className="px-3 py-1 bg-brand-beige text-brand-dark-blue rounded hover:bg-opacity-80 font-bold">Profile</Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 font-bold"
                >
                  تسجيل الدخول
                </button>
              </div>)
            :<div>negm</div>}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notification Bell */}
            {user && <NotificationBell />}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none">
              <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-medium-blue mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* User info in mobile menu */}
            {user && (
              <div className="bg-brand-beige rounded-md p-3 mb-2 text-center">
                <div className="font-bold text-brand-dark-blue">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-gray-700">{user.email}</div>
              </div>
            )}
            <Link
              to="/"
              className="block px-3 py-2 text-white hover:text-brand-beige font-medium rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-white hover:text-brand-beige font-medium rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 text-white hover:text-brand-beige font-medium rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/users"
              className="block px-3 py-2 text-white hover:text-brand-beige font-medium rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Target Users
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-white hover:text-brand-beige font-medium rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 bg-brand-beige text-brand-dark-blue font-bold rounded-md mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  الملف الشخصي
                </Link>
                <button
                  onClick={() => { dispatch(logout()); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-red-600 font-bold rounded-md mt-2 hover:bg-red-100"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 bg-brand-beige text-brand-dark-blue font-bold rounded-md mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                تسجيل الدخول
              </Link>
            )}
            
            {/* Role-based mobile navigation */}
            {user && user.role === 'admin' && (
              <Link
                to="/admin-dashboard"
                className="block px-3 py-2 bg-blue-500 text-white font-bold rounded-md mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {user && user.role === 'manager' && (
              <Link
                to="/manager-dashboard"
                className="block px-3 py-2 bg-purple-500 text-white font-bold rounded-md mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Manager Dashboard
              </Link>
            )}
            {user && user.role === 'driver' && (
              <Link
                to="/driver-dashboard"
                className="block px-3 py-2 bg-green-500 text-white font-bold rounded-md mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Driver Dashboard
              </Link>
            )}
            {user && (user.role === 'admin' || user.role === 'manager') && (
              <Link
                to="/attendance"
                className="block px-3 py-2 bg-orange-500 text-white font-bold rounded-md mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Attendance Management
              </Link>
            )}
            
            <Link
              to="/login"
              className="block px-3 py-2 bg-brand-beige text-brand-dark-blue font-bold rounded-md mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>

            {/* Mobile Language Selector */}
            <div className="px-3 py-2">
              <select className="w-full appearance-none bg-transparent border border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-brand-beige">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
