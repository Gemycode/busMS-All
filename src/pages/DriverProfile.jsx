import { Link } from "react-router-dom"

const DriverProfile = () => {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Main Content */}
      <main className="pt-20 pb-16">
        {/* Profile Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="h-32 w-32 rounded-full bg-brand-beige text-brand-dark-blue flex items-center justify-center font-bold text-5xl">
                  JD
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold  mb-2">John Doe</h1>
                <p className=" mb-4">Bus Driver - ID: DRV-2023-0042</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-300 rounded-full text-sm font-medium">
                    <i className="fas fa-check-circle mr-1"></i> Active
                  </span>
                  <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full text-sm font-medium">
                    <i className="fas fa-award mr-1"></i> 5+ Years Experience
                  </span>
                  <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 rounded-full text-sm font-medium">
                    <i className="fas fa-star mr-1"></i> Top Performer
                  </span>
                </div>
              </div>
              <div className="mt-6 md:mt-0 md:ml-auto">
                <Link
                  to="/edit-profile"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 inline-flex items-center"
                >
                  <i className="fas fa-edit mr-2"></i> Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Personal Info */}
              <div className="lg:col-span-1">
                {/* Personal Information Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-4">Personal Information</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="text-gray-800">John Michael Doe</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                      <p className="text-gray-800">john.doe@example.com</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="text-gray-800">(555) 123-4567</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                      <p className="text-gray-800">May 15, 1985</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="text-gray-800">
                        123 Driver Lane, Apt 4B
                        <br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
                      <p className="text-gray-800">Jane Doe - (555) 987-6543</p>
                    </div>
                  </div>
                </div>

                {/* License & Certifications Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-4">License & Certifications</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Driver's License</h3>
                      <p className="text-gray-800">Class B Commercial - CA-DL98765432</p>
                      <p className="text-sm text-gray-500">Expires: Dec 31, 2025</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Passenger Endorsement</h3>
                      <p className="text-gray-800">P-Endorsement - Active</p>
                      <p className="text-sm text-gray-500">Issued: Jan 15, 2020</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">First Aid Certification</h3>
                      <p className="text-gray-800">American Red Cross</p>
                      <p className="text-sm text-gray-500">Expires: Aug 10, 2023</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Safety Training</h3>
                      <p className="text-gray-800">Advanced Driver Safety Program</p>
                      <p className="text-sm text-gray-500">Completed: Mar 22, 2022</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Performance & Schedule */}
              <div className="lg:col-span-2">
                {/* Current Assignment Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-4">Current Assignment</h2>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-brand-medium-blue">Route #42 - Westside Express</h3>
                        <p className="text-gray-600">Morning & Afternoon School Service</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active Route
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Vehicle</h4>
                        <p className="text-gray-800">Bus #1042 - 2021 Thomas Saf-T-Liner</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Capacity</h4>
                        <p className="text-gray-800">72 Passengers</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Morning Departure</h4>
                        <p className="text-gray-800">6:30 AM from Central Depot</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Afternoon Departure</h4>
                        <p className="text-gray-800">3:15 PM from Westside High School</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/route-details"
                        className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200"
                      >
                        View Route Details
                      </Link>
                      <Link
                        to="/passenger-list"
                        className="px-3 py-1 bg-brand-light-blue text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200"
                      >
                        Passenger List
                      </Link>
                      <Link
                        to="/route-map"
                        className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200"
                      >
                        View Map
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Weekly Schedule Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Weekly Schedule</h2>
                    <Link
                      to="/full-schedule"
                      className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                    >
                      View Full Schedule
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Day
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Morning Route
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Afternoon Route
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Hours
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monday</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (6:30 AM - 8:15 AM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (3:15 PM - 5:00 PM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tuesday</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (6:30 AM - 8:15 AM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (3:15 PM - 5:00 PM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Wednesday</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (6:30 AM - 8:15 AM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (2:15 PM - 4:00 PM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Thursday</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (6:30 AM - 8:15 AM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (3:15 PM - 5:00 PM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Friday</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (6:30 AM - 8:15 AM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Route #42 (3:15 PM - 5:00 PM)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.5</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </td>
                          <td className="px-6 py-3"></td>
                          <td className="px-6 py-3"></td>
                          <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            41.5 hrs
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Performance Metrics Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-4">Performance Metrics</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">On-Time Performance</h3>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold text-green-600">98.2%</span>
                        <span className="text-sm text-green-600 ml-2">+2.1%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Safety Rating</h3>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold text-brand-medium-blue">4.9/5</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Based on inspections</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Fuel Efficiency</h3>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold text-gray-800">6.2</span>
                        <span className="text-sm text-gray-600 ml-2">MPG</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Fleet avg: 5.8 MPG</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Feedback</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-green-800">Parent Feedback</span>
                          <span className="text-xs text-gray-500">May 12, 2023</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          "John is always friendly and makes my child feel safe on the bus. He's punctual and
                          professional."
                        </p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-blue-800">Supervisor Note</span>
                          <span className="text-xs text-gray-500">Apr 28, 2023</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          "Excellent handling of the route diversion due to construction. Maintained schedule despite
                          challenges."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Safety Record</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Days Since Last Incident:</p>
                        <p className="text-sm text-gray-600">365+ days</p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-shield-alt text-green-600 text-xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default DriverProfile
