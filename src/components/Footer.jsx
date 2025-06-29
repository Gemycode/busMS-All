import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-bus text-brand-beige text-2xl mr-2"></i>
              <span className="font-display font-bold text-xl">BusTrack</span>
            </div>
            <p className="text-gray-400 mb-4">
              Secure, efficient bus management system for schools and transportation departments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/users" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  Target Users
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  Blog
                </a>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-beige transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-brand-beige"></i>
                <span className="text-gray-400">
                  123 Transport Avenue, Suite 500
                  <br />
                  Boston, MA 02108
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-brand-beige"></i>
                <span className="text-gray-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-brand-beige"></i>
                <span className="text-gray-400">info@bustrack.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2025 BusTrack. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-brand-beige text-sm transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-beige text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-beige text-sm transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
