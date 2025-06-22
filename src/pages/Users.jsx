import { Link } from "react-router-dom"

const Users = () => {
  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Page Header */}
      <section className="hero pt-32 pb-16 bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Target Users</h1>
            <p className="text-xl text-gray-200">
              BusTrack is designed to serve a wide range of transportation stakeholders. Discover how our solution can
              benefit your organization.
            </p>
          </div>
        </div>
      </section>

      {/* Public Transit Authorities */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Public Transit Authority"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <div className="inline-block px-4 py-2 bg-brand-beige text-brand-dark-blue rounded-full font-bold mb-4">
                Public Transit Authorities
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-6">
                Optimize City-Wide Transit Operations
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Public transit authorities benefit from BusTrack's comprehensive suite of tools designed to manage
                large-scale bus networks efficiently, improve service reliability, and enhance the passenger experience.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Manage hundreds of vehicles across multiple routes and depots</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Integrate with existing transit infrastructure and payment systems</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Access detailed analytics for service planning and optimization</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Improve on-time performance and passenger satisfaction</p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center text-brand-medium-blue font-bold hover:text-brand-dark-blue transition-colors duration-200"
              >
                Learn how we serve transit authorities
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

      {/* School Transportation */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-2 bg-brand-beige text-brand-dark-blue rounded-full font-bold mb-4">
                School Transportation
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-6">
                Safe & Reliable Student Transport
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                School districts and educational institutions can ensure the safety and efficiency of their student
                transportation services with BusTrack's specialized school bus management features.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Real-time tracking for parents and school administrators</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Student ridership tracking and attendance integration</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Route optimization for efficient student pickup and drop-off</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-brand-light-blue rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">Enhanced safety features and driver monitoring</p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center text-brand-medium-blue font-bold hover:text-brand-dark-blue transition-colors duration-200"
              >
                Learn how we serve educational institutions
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
                alt="School Transportation"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24 bg-brand-dark-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              See how organizations like yours have transformed their operations with BusTrack
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Success Story 1 */}
            <div className="bg-brand-medium-blue bg-opacity-30 p-8 rounded-xl">
              <div className="mb-6">
                <div className="h-12 w-32 bg-brand-beige rounded flex items-center justify-center">
                  <span className="text-brand-dark-blue font-bold">Metro Transit</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Metro Transit Authority</h3>
              <p className="text-gray-300 mb-4">
                Reduced operational costs by 30% and improved on-time performance by 25% within six months of
                implementing BusTrack.
              </p>
              <a
                href="#"
                className="text-brand-beige hover:text-white transition-colors duration-200 inline-flex items-center"
              >
                Read case study
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            {/* Success Story 2 */}
            <div className="bg-brand-medium-blue bg-opacity-30 p-8 rounded-xl">
              <div className="mb-6">
                <div className="h-12 w-32 bg-brand-beige rounded flex items-center justify-center">
                  <span className="text-brand-dark-blue font-bold">Westside</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Westside School District</h3>
              <p className="text-gray-300 mb-4">
                Improved parent satisfaction by 40% with real-time bus tracking and reduced student wait times by an
                average of 10 minutes.
              </p>
              <a
                href="#"
                className="text-brand-beige hover:text-white transition-colors duration-200 inline-flex items-center"
              >
                Read case study
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            {/* Success Story 3 */}
            <div className="bg-brand-medium-blue bg-opacity-30 p-8 rounded-xl">
              <div className="mb-6">
                <div className="h-12 w-32 bg-brand-beige rounded flex items-center justify-center">
                  <span className="text-brand-dark-blue font-bold">TechCorp</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">TechCorp Shuttle Program</h3>
              <p className="text-gray-300 mb-4">
                Increased employee shuttle ridership by 35% and reduced carbon emissions by 120 tons annually with
                optimized routes.
              </p>
              <a
                href="#"
                className="text-brand-beige hover:text-white transition-colors duration-200 inline-flex items-center"
              >
                Read case study
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
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

export default Users
