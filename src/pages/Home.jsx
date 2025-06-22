"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AnimatedBus from "../components/AnimatedBus"
import Toast from "../components/Toast"

const Home = () => {
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Show notification after 3 seconds
    const timer = setTimeout(() => {
      setShowToast(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Page Loading Indicator */}
      <div className="page-loading"></div>

      {/* Hero Section */}
      <section className="hero flex items-center justify-center text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Revolutionize Your School Bus Management
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Track buses in real-time, ensure student safety, and optimize routes with our comprehensive management
              system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/features"
                className="btn-ripple px-8 py-4 bg-brand-beige text-brand-dark-blue font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105"
              >
                Explore Features
              </Link>
              <Link
                to="/contact"
                className="btn-ripple px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-200 transform hover:scale-105"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AnimatedBus />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Powerful Features for Efficient Management</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive solution provides everything you need to manage your school bus fleet effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card bg-white border border-gray-200 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="w-12 h-12 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-4">
                <i className="fas fa-map-marked-alt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Monitor your entire bus fleet in real-time with GPS tracking and get instant updates on location and
                status.
              </p>
            </div>

            <div className="feature-card bg-white border border-gray-200 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="w-12 h-12 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-4">
                <i className="fas fa-route text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Route Optimization</h3>
              <p className="text-gray-600">
                Create efficient routes that save time and fuel while ensuring timely pickup and drop-off for all
                students.
              </p>
            </div>

            <div className="feature-card bg-white border border-gray-200 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="w-12 h-12 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-4">
                <i className="fas fa-bell text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Notifications</h3>
              <p className="text-gray-600">
                Keep parents and administrators informed with automated alerts about arrivals, delays, and emergencies.
              </p>
            </div>

            <div className="feature-card bg-white border border-gray-200 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="w-12 h-12 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-4">
                <i className="fas fa-user-check text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Attendance Tracking</h3>
              <p className="text-gray-600">
                Automatically record student boarding and exiting with digital check-in systems for enhanced safety.
              </p>
            </div>

            <div className="feature-card bg-white border border-gray-200 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="w-12 h-12 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-4">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Gain insights into fleet performance, fuel efficiency, and route effectiveness with comprehensive
                reports.
              </p>
            </div>

            <div className="feature-card bg-white border border-gray-200 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="w-12 h-12 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-4">
                <i className="fas fa-mobile-alt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Mobile Applications</h3>
              <p className="text-gray-600">
                Access the system on the go with dedicated apps for administrators, drivers, and parents.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/features"
              className="btn-ripple inline-block px-6 py-3 bg-brand-dark-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105"
            >
              View All Features
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How BusTrack Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, effective process to keep your transportation system running smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-dark-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Install & Configure</h3>
              <p className="text-gray-600">
                We install GPS trackers in your buses and set up the system according to your school's needs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-medium-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Monitor & Manage</h3>
              <p className="text-gray-600">
                Track buses in real-time, manage routes, and communicate with drivers and parents through our platform.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-light-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze & Optimize</h3>
              <p className="text-gray-600">
                Use data insights to improve routes, reduce costs, and enhance the overall transportation experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Schools and transportation departments trust BusTrack for their bus management needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center text-brand-dark-blue font-bold mr-4">
                  MS
                </div>
                <div>
                  <h4 className="font-bold">Michael Smith</h4>
                  <p className="text-sm text-gray-600">Transportation Director, Lincoln School District</p>
                </div>
              </div>
              <p className="text-gray-700">
                "BusTrack has revolutionized how we manage our bus fleet. Parents love the real-time updates, and we've
                reduced our operational costs by 15% through route optimization."
              </p>
              <div className="mt-4 flex text-brand-medium-blue">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center text-brand-dark-blue font-bold mr-4">
                  JR
                </div>
                <div>
                  <h4 className="font-bold">Jennifer Rodriguez</h4>
                  <p className="text-sm text-gray-600">Principal, Oakwood Elementary</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The safety of our students is our top priority, and BusTrack helps us ensure they get to and from
                school safely. The attendance tracking feature gives parents peace of mind."
              </p>
              <div className="mt-4 flex text-brand-medium-blue">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md animate-fade-in-up stagger-item">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center text-brand-dark-blue font-bold mr-4">
                  DW
                </div>
                <div>
                  <h4 className="font-bold">David Wilson</h4>
                  <p className="text-sm text-gray-600">Parent, Westfield High School</p>
                </div>
              </div>
              <p className="text-gray-700">
                "As a parent, knowing exactly when my child's bus will arrive is invaluable. The app notifications keep
                me informed, and I can track the bus in real-time when there are delays."
              </p>
              <div className="mt-4 flex text-brand-medium-blue">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-dark-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Bus Management?</h2>
            <p className="text-xl mb-8">
              Join hundreds of schools that trust BusTrack for safe and efficient transportation management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="btn-ripple px-8 py-4 bg-brand-beige text-brand-dark-blue font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105"
              >
                Request a Demo
              </Link>
              <Link
                to="/login"
                className="btn-ripple px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-200 transform hover:scale-105"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <Toast message="Explore our features and request a demo today!" onClose={() => setShowToast(false)} />
      )}
    </div>
  )
}

export default Home
