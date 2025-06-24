import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-brand-dark-blue  text-white  shadow-md fixed w-full z-50">
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

            {/* User Info or Sign In */}
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.firstName || 'User')}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-brand-beige"
                />
                <span className="font-semibold text-brand-beige">{user.firstName} {user.lastName}</span>
                <Link to="/profile" className="px-3 py-1 bg-brand-beige text-brand-dark-blue rounded hover:bg-opacity-80 font-bold ml-2">Profile</Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 font-bold ml-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-ripple px-4 py-2 bg-brand-beige text-brand-dark-blue font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
            {user && (
              <Link
                to="/profile"
                className="block px-3 py-2 bg-brand-beige text-brand-dark-blue font-bold rounded-md mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
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
