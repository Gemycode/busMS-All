import { Link } from "react-router-dom"
import LiveTrackingMap from "../components/LiveTrackingMap" // Import LiveTrackingMap component

const ParentProfile = () => {
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
                  SM
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold  mb-2">Sarah Miller</h1>
                <p className="mb-4">Parent/Guardian - Account ID: PAR-2023-0128</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-300 rounded-full text-sm font-medium">
                    <i className="fas fa-check-circle mr-1"></i> Verified
                  </span>
                  <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full text-sm font-medium">
                    <i className="fas fa-bell mr-1"></i> Notifications Enabled
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
                      <p className="text-gray-800">Sarah Jane Miller</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                      <p className="text-gray-800">sarah.miller@example.com</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="text-gray-800">(555) 987-6543</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Secondary Phone</h3>
                      <p className="text-gray-800">(555) 456-7890</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="text-gray-800">
                        456 Maple Avenue
                        <br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Relationship to Children</h3>
                      <p className="text-gray-800">Mother</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Emergency Contacts</h2>
                    <Link to="/edit-contacts" className="text-sm text-brand-medium-blue hover:text-brand-dark-blue">
                      <i className="fas fa-plus-circle mr-1"></i> Add
                    </Link>
                  </div>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-md font-medium text-gray-800">Robert Miller</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Primary
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Relationship: Father</p>
                      <p className="text-sm text-gray-600">(555) 123-4567</p>
                      <p className="text-sm text-gray-600">robert.miller@example.com</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-md font-medium text-gray-800">Jennifer Wilson</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          Secondary
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Relationship: Grandmother</p>
                      <p className="text-sm text-gray-600">(555) 789-0123</p>
                      <p className="text-sm text-gray-600">jennifer.wilson@example.com</p>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Bus Arrival Alerts</h3>
                        <p className="text-xs text-gray-500">Notify when bus is 5 minutes away</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-arrival"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-arrival"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Delay Notifications</h3>
                        <p className="text-xs text-gray-500">Notify about route delays</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-delay"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-delay"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Attendance Confirmation</h3>
                        <p className="text-xs text-gray-500">Notify when child boards/exits bus</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-attendance"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-attendance"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Schedule Changes</h3>
                        <p className="text-xs text-gray-500">Notify about route/schedule changes</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-schedule"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-schedule"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Weather Alerts</h3>
                        <p className="text-xs text-gray-500">Notify about severe weather impacts</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-weather"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-weather"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Children & Bus Info */}
              <div className="lg:col-span-2">
                {/* Children Information Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Children Information</h2>
                    <Link
                      to="/add-child"
                      className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Child
                    </Link>
                  </div>

                  {/* Child 1 */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="h-16 w-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center mr-4">
                          <i className="fas fa-child text-brand-light-blue text-2xl"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-brand-dark-blue">Emma Miller</h3>
                          <p className="text-gray-600">Grade 5 - Student ID: STU-2023-0456</p>
                        </div>
                      </div>
                      <div>
                        <Link
                          to="/child-details?id=STU-2023-0456"
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">School</h4>
                        <p className="text-gray-800">Westside Elementary School</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Bus Route</h4>
                        <p className="text-gray-800">Route #42 - Westside Express</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Morning Pickup</h4>
                        <p className="text-gray-800">Stop #8 - Maple & Oak St (7:15 AM)</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Afternoon Dropoff</h4>
                        <p className="text-gray-800">Stop #8 - Maple & Oak St (4:05 PM)</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <i className="fas fa-check text-green-600"></i>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Current Status</h4>
                          <p className="text-sm text-gray-600">Safely arrived at school at 8:05 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Child 2 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="h-16 w-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center mr-4">
                          <i className="fas fa-child text-brand-light-blue text-2xl"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-brand-dark-blue">Noah Miller</h3>
                          <p className="text-gray-600">Grade 3 - Student ID: STU-2023-0457</p>
                        </div>
                      </div>
                      <div>
                        <Link
                          to="/child-details?id=STU-2023-0457"
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">School</h4>
                        <p className="text-gray-800">Westside Elementary School</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Bus Route</h4>
                        <p className="text-gray-800">Route #42 - Westside Express</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Morning Pickup</h4>
                        <p className="text-gray-800">Stop #8 - Maple & Oak St (7:15 AM)</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Afternoon Dropoff</h4>
                        <p className="text-gray-800">Stop #8 - Maple & Oak St (4:05 PM)</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <i className="fas fa-check text-green-600"></i>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Current Status</h4>
                          <p className="text-sm text-gray-600">Safely arrived at school at 8:05 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bus Tracking Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-4">Live Bus Tracking</h2>

                  <LiveTrackingMap busId="1042" userRole="parent" height="300px" />

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500">Current Location</h4>
                      <p className="text-gray-800">Pine Street & 10th Avenue</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500">Next Stop</h4>
                      <p className="text-gray-800">Stop #6 - Cedar & Elm St</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500">ETA to Your Stop</h4>
                      <p className="text-gray-800">12 minutes (7:15 AM)</p>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <Link
                      to="/map-view"
                      className="px-4 py-2 bg-brand-medium-blue text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 inline-flex items-center"
                    >
                      <i className="fas fa-map-marker-alt mr-2"></i> Open Full Tracking View
                    </Link>
                  </div>
                </div>

                {/* Recent Notifications Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Recent Notifications</h2>
                    <Link
                      to="/notifications"
                      className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                    >
                      View All Notifications
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {/* Notification 1 */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">Bus Arrival</span>
                        <span className="text-xs text-gray-500">Today, 7:12 AM</span>
                      </div>
                      <p className="text-sm text-gray-600">Bus #1042 is approaching your stop (ETA: 3 minutes).</p>
                    </div>

                    {/* Notification 2 */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">Boarding Confirmation</span>
                        <span className="text-xs text-gray-500">Today, 7:16 AM</span>
                      </div>
                      <p className="text-sm text-gray-600">Emma and Noah have boarded the bus at Stop #8.</p>
                    </div>

                    {/* Notification 3 */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">Arrival Confirmation</span>
                        <span className="text-xs text-gray-500">Today, 8:05 AM</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Emma and Noah have arrived safely at Westside Elementary School.
                      </p>
                    </div>

                    {/* Notification 4 */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-800">Schedule Update</span>
                        <span className="text-xs text-gray-500">Yesterday, 5:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Early dismissal next Friday. Afternoon pickup will be at 1:15 PM instead of 3:15 PM.
                      </p>
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

export default ParentProfile
