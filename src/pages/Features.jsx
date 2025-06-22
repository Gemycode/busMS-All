import { Link } from "react-router-dom"

const Features = () => {
  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Page Header */}
      <section className="hero pt-32 pb-16 bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Powerful Features</h1>
            <p className="text-xl text-gray-200">
              Discover the comprehensive tools that make BusTrack the leading bus management solution.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Navigation */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#tracking"
              className="px-4 py-2 bg-gray-100 hover:bg-brand-beige hover:text-brand-dark-blue rounded-md transition-colors duration-200"
            >
              GPS Tracking
            </a>
            <a
              href="#scheduling"
              className="px-4 py-2 bg-gray-100 hover:bg-brand-beige hover:text-brand-dark-blue rounded-md transition-colors duration-200"
            >
              Scheduling
            </a>
            <a
              href="#maintenance"
              className="px-4 py-2 bg-gray-100 hover:bg-brand-beige hover:text-brand-dark-blue rounded-md transition-colors duration-200"
            >
              Maintenance
            </a>
            <a
              href="#ticketing"
              className="px-4 py-2 bg-gray-100 hover:bg-brand-beige hover:text-brand-dark-blue rounded-md transition-colors duration-200"
            >
              Ticketing
            </a>
            <a
              href="#analytics"
              className="px-4 py-2 bg-gray-100 hover:bg-brand-beige hover:text-brand-dark-blue rounded-md transition-colors duration-200"
            >
              Analytics
            </a>
            <a
              href="#passenger"
              className="px-4 py-2 bg-gray-100 hover:bg-brand-beige hover:text-brand-dark-blue rounded-md transition-colors duration-200"
            >
              Passenger App
            </a>
          </div>
        </div>
      </section>

      {/* GPS Tracking Feature */}
      <section id="tracking" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="GPS Tracking Dashboard"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <div className="inline-block px-4 py-2 bg-brand-beige text-brand-dark-blue rounded-full font-bold mb-4">
                GPS Tracking & Monitoring
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-6">
                Real-time Fleet Visibility
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Track your entire fleet in real-time with advanced GPS technology. Know exactly where each vehicle is at
                any moment, monitor route adherence, and respond quickly to any issues.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Live vehicle tracking with 10-second updates</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Geofencing capabilities with customizable alerts</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Route deviation notifications and historical playback</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Driver behavior monitoring (speed, harsh braking, etc.)</p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center text-brand-medium-blue font-bold hover:text-brand-dark-blue transition-colors duration-200"
              >
                Learn more about GPS tracking
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scheduling Feature */}
      <section id="scheduling" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-2 bg-brand-beige text-brand-dark-blue rounded-full font-bold mb-4">
                Scheduling & Dispatch
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-6">
                Efficient Route Planning
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Create and manage complex schedules with our intuitive interface. Optimize routes, assign drivers, and
                automate dispatch processes to maximize efficiency.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Drag-and-drop schedule builder with conflict detection</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">AI-powered route optimization for fuel efficiency</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Automated driver assignments based on qualifications</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Real-time schedule adjustments and notifications</p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center text-brand-medium-blue font-bold hover:text-brand-dark-blue transition-colors duration-200"
              >
                Learn more about scheduling
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Scheduling Interface"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-4">
              Feature Comparison
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how our different plans compare to find the right solution for your needs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 bg-gray-50 text-left text-gray-500 font-medium">Features</th>
                  <th className="py-4 px-6 bg-gray-50 text-center text-brand-dark-blue font-bold">Basic</th>
                  <th className="py-4 px-6 bg-gray-50 text-center text-brand-dark-blue font-bold">Professional</th>
                  <th className="py-4 px-6 bg-gray-50 text-center text-brand-dark-blue font-bold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">GPS Tracking</td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Basic Scheduling</td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">AI Route Optimization</td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-minus text-gray-400"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Maintenance Management</td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-minus text-gray-400"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <i className="fas fa-check text-brand-medium-blue"></i>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6"></td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      to="/contact"
                      className="px-6 py-2 bg-brand-light-blue text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 inline-block"
                    >
                      Learn More
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      to="/contact"
                      className="px-6 py-2 bg-brand-medium-blue text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 inline-block"
                    >
                      Learn More
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      to="/contact"
                      className="px-6 py-2 bg-brand-dark-blue text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 inline-block"
                    >
                      Learn More
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-medium-blue to-brand-dark-blue rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                  Ready to transform your bus operations?
                </h2>
                <p className="text-lg text-gray-200">
                  Get started today with a free consultation and personalized demo.
                </p>
              </div>
              <div>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-brand-beige text-brand-dark-blue font-bold rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 inline-block text-center"
                >
                  Schedule a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features
