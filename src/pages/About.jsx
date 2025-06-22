"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AnimatedBus from "../components/AnimatedBus"

const About = () => {
  const [counters, setCounters] = useState({
    districts: 0,
    buses: 0,
    students: 0,
    countries: 0,
  })

  useEffect(() => {
    // Animate counters when component mounts
    const animateCounter = (target, key, duration = 2000) => {
      const increment = target / (duration / 16)
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
      }, 16)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(500, "districts")
            animateCounter(10000, "buses")
            animateCounter(2000000, "students")
            animateCounter(12, "countries")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    const counterSection = document.querySelector(".counter-section")
    if (counterSection) {
      observer.observe(counterSection)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Page Loading Indicator */}
      <div className="page-loading"></div>

      {/* Hero Section */}
      <section className="hero flex items-center justify-center text-white pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About BusTrack</h1>
            <p className="text-xl md:text-2xl mb-8">
              Transforming school transportation with technology and innovation since 2018.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600">From a simple idea to a comprehensive bus management solution.</p>
          </div>

          <div className="timeline-container py-8">
            <AnimatedBus />

            {/* Timeline Item 1 */}
            <div className="timeline-item">
              <div className="timeline-content animate-fade-in-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">2018: The Beginning</h3>
                  <p className="text-gray-600">
                    BusTrack was founded with a simple mission: make school transportation safer and more efficient.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="timeline-item">
              <div className="timeline-content animate-fade-in-right">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">2019: First Pilot Program</h3>
                  <p className="text-gray-600">
                    We launched our first pilot program with 5 schools and 50 buses, proving our concept works.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="timeline-item">
              <div className="timeline-content animate-fade-in-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">2020: Expanding Features</h3>
                  <p className="text-gray-600">
                    Added real-time tracking, route optimization, and parent notifications to our growing platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="timeline-item">
              <div className="timeline-content animate-fade-in-right">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">2021: National Expansion</h3>
                  <p className="text-gray-600">
                    Expanded to serve over 100 school districts nationwide, managing more than 2,000 buses.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 5 */}
            <div className="timeline-item">
              <div className="timeline-content animate-fade-in-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">2022: Mobile App Launch</h3>
                  <p className="text-gray-600">
                    Released our mobile applications for administrators, drivers, and parents to enhance accessibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 6 */}
            <div className="timeline-item">
              <div className="timeline-content animate-fade-in-right">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">2023: International Expansion</h3>
                  <p className="text-gray-600">
                    Began serving international schools in Canada, Mexico, and the United Kingdom.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 7 */}
            <div className="timeline-item">
              <div className="timeline-content animate-fade-in-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">2024: AI Integration</h3>
                  <p className="text-gray-600">
                    Implemented AI-powered route optimization and predictive maintenance features.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 8 */}
            <div className="timeline-item">
              <div className="timeline-content animate-fade-in-right">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-brand-dark-blue mb-2">2025: Today & Beyond</h3>
                  <p className="text-gray-600">
                    Continuing to innovate and expand our services to make student transportation safer and more
                    efficient worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do at BusTrack.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="value-card bg-white p-8 rounded-lg shadow-md relative animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-6">
                <i className="fas fa-shield-alt text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Safety First</h3>
              <p className="text-gray-600">
                We prioritize the safety of students above all else. Every feature we develop is designed with safety in
                mind.
              </p>
            </div>

            {/* Value 2 */}
            <div className="value-card bg-white p-8 rounded-lg shadow-md relative animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-6">
                <i className="fas fa-lightbulb text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what's possible in transportation management technology.
              </p>
            </div>

            {/* Value 3 */}
            <div className="value-card bg-white p-8 rounded-lg shadow-md relative animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-6">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community</h3>
              <p className="text-gray-600">
                We build strong relationships with the schools, parents, and communities we serve.
              </p>
            </div>

            {/* Value 4 */}
            <div className="value-card bg-white p-8 rounded-lg shadow-md relative animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-6">
                <i className="fas fa-leaf text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to reducing environmental impact through efficient routing and resource management.
              </p>
            </div>

            {/* Value 5 */}
            <div className="value-card bg-white p-8 rounded-lg shadow-md relative animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-6">
                <i className="fas fa-lock text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Security</h3>
              <p className="text-gray-600">
                We protect sensitive data with the highest standards of security and privacy protection.
              </p>
            </div>

            {/* Value 6 */}
            <div className="value-card bg-white p-8 rounded-lg shadow-md relative animate-fade-in-up stagger-item">
              <div className="w-16 h-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center text-brand-dark-blue mb-6">
                <i className="fas fa-handshake text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Reliability</h3>
              <p className="text-gray-600">
                We deliver consistent, dependable service that our clients can count on every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="counter-section py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Counter 1 */}
            <div className="counter-item text-center p-6 animate-fade-in-up">
              <div className="text-4xl font-bold mb-2">
                <span className="counter-value">{counters.districts.toLocaleString()}</span>+
              </div>
              <p className="text-brand-beige">School Districts</p>
            </div>

            {/* Counter 2 */}
            <div className="counter-item text-center p-6 animate-fade-in-up">
              <div className="text-4xl font-bold mb-2">
                <span className="counter-value">{counters.buses.toLocaleString()}</span>+
              </div>
              <p className="text-brand-beige">Buses Managed</p>
            </div>

            {/* Counter 3 */}
            <div className="counter-item text-center p-6 animate-fade-in-up">
              <div className="text-4xl font-bold mb-2">
                <span className="counter-value">{(counters.students / 1000000).toFixed(1)}</span>M+
              </div>
              <p className="text-brand-beige">Students Transported</p>
            </div>

            {/* Counter 4 */}
            <div className="counter-item text-center p-6 animate-fade-in-up">
              <div className="text-4xl font-bold mb-2">
                <span className="counter-value">{counters.countries}</span>
              </div>
              <p className="text-brand-beige">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-gray-600">The passionate experts behind BusTrack's success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="team-member-card bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up stagger-item">
              <div className="h-64 overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover team-member-image"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Sarah Johnson</h3>
                <p className="text-brand-medium-blue mb-3">CEO & Co-Founder</p>
                <p className="text-gray-600 mb-4">
                  Former transportation director with 15+ years of experience in school bus operations.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="team-member-card bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up stagger-item">
              <div className="h-64 overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Michael Chen"
                  className="w-full h-full object-cover team-member-image"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Michael Chen</h3>
                <p className="text-brand-medium-blue mb-3">CTO & Co-Founder</p>
                <p className="text-gray-600 mb-4">
                  Tech innovator with expertise in GPS tracking systems and route optimization algorithms.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="team-member-card bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up stagger-item">
              <div className="h-64 overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="David Rodriguez"
                  className="w-full h-full object-cover team-member-image"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">David Rodriguez</h3>
                <p className="text-brand-medium-blue mb-3">COO</p>
                <p className="text-gray-600 mb-4">
                  Operations expert with a background in logistics and fleet management systems.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="team-member-card bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up stagger-item">
              <div className="h-64 overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Jennifer Lee"
                  className="w-full h-full object-cover team-member-image"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Jennifer Lee</h3>
                <p className="text-brand-medium-blue mb-3">Chief Product Officer</p>
                <p className="text-gray-600 mb-4">
                  UX specialist focused on creating intuitive interfaces for administrators and parents.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-dribbble"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="team-member-card bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up stagger-item">
              <div className="h-64 overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Robert Williams"
                  className="w-full h-full object-cover team-member-image"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Robert Williams</h3>
                <p className="text-brand-medium-blue mb-3">Chief Security Officer</p>
                <p className="text-gray-600 mb-4">
                  Cybersecurity expert ensuring the protection of sensitive transportation and student data.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 6 */}
            <div className="team-member-card bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up stagger-item">
              <div className="h-64 overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Amanda Foster"
                  className="w-full h-full object-cover team-member-image"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Amanda Foster</h3>
                <p className="text-brand-medium-blue mb-3">VP of Customer Success</p>
                <p className="text-gray-600 mb-4">
                  Dedicated to ensuring schools and districts get the most value from the BusTrack platform.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-dark-blue transition-colors duration-200">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-dark-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-6">Join the BusTrack Family</h2>
            <p className="text-xl mb-8">
              Discover how we can help your school district improve transportation safety and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="btn-ripple px-8 py-4 bg-brand-beige text-brand-dark-blue font-bold rounded-md hover:bg-opacity-90 transition-colors duration-200 transform hover:scale-105"
              >
                Request a Demo
              </Link>
              <Link
                to="/features"
                className="btn-ripple px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-200 transform hover:scale-105"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
