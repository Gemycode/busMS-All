"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import LiveTrackingMap from "../components/LiveTrackingMap"

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    activeRoutes: 0,
    totalDrivers: 0,
    onTimePerformance: 0,
    fuelEfficiency: 0,
  })

  const [alerts, setAlerts] = useState([])
  const [todayRoutes, setTodayRoutes] = useState([])

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        activeRoutes: 42,
        totalDrivers: 38,
        onTimePerformance: 94.2,
        fuelEfficiency: 6.8,
      })

      setAlerts([
        {
          id: 1,
          type: "warning",
          message: "Route #15 is running 8 minutes behind schedule",
          time: "5 minutes ago",
          priority: "high",
        },
        {
          id: 2,
          type: "info",
          message: "Driver John Smith completed safety training",
          time: "1 hour ago",
          priority: "low",
        },
        {
          id: 3,
          type: "maintenance",
          message: "Bus #1042 scheduled for maintenance tomorrow",
          time: "2 hours ago",
          priority: "medium",
        },
      ])

      setTodayRoutes([
        {
          id: 1,
          routeNumber: "42",
          routeName: "Westside Express",
          driver: "John Doe",
          bus: "1042",
          status: "on-time",
          nextStop: "Maple & Oak St",
          eta: "7:15 AM",
          passengers: 28,
          capacity: 72,
        },
        {
          id: 2,
          routeNumber: "15",
          routeName: "Downtown Loop",
          driver: "Sarah Wilson",
          bus: "1087",
          status: "delayed",
          nextStop: "Central Station",
          eta: "7:23 AM",
          passengers: 45,
          capacity: 72,
        },
        {
          id: 3,
          routeNumber: "28",
          routeName: "Northside Route",
          driver: "Mike Johnson",
          bus: "1156",
          status: "on-time",
          nextStop: "Pine Street",
          eta: "7:18 AM",
          passengers: 32,
          capacity: 72,
        },
      ])
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "on-time":
        return "bg-green-100 text-green-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      case "early":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "maintenance":
        return "bg-purple-50 border-purple-200 text-purple-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="pt-20 pb-16">
        {/* Dashboard Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold  mb-2">Operations Management</h1>
                <p>Good morning, Transportation Manager</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/manager/routes"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-route mr-2"></i>Manage Routes
                </Link>
                <Link
                  to="/manager/drivers"
                  className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-all duration-200"
                >
                  <i className="fas fa-users mr-2"></i>Drivers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Routes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeRoutes}</p>
                    <p className="text-sm text-blue-600">
                      <i className="fas fa-info-circle mr-1"></i>Currently running
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-route text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Drivers</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalDrivers}</p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-check mr-1"></i>All certified
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-id-badge text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">On-Time Performance</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.onTimePerformance}%</p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-arrow-up mr-1"></i>+2.1% this week
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-clock text-purple-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fuel Efficiency</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.fuelEfficiency}</p>
                    <p className="text-sm text-yellow-600">
                      <span className="text-xs">MPG</span> Fleet average
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-gas-pump text-yellow-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Routes */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Today's Routes</h2>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                        <i className="fas fa-filter mr-1"></i>Filter
                      </button>
                      <Link
                        to="/manager/routes"
                        className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm hover:bg-opacity-90"
                      >
                        View All
                      </Link>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Driver
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Next Stop
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Passengers
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {todayRoutes.map((route) => (
                          <tr key={route.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">#{route.routeNumber}</div>
                                <div className="text-sm text-gray-500">{route.routeName}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{route.driver}</div>
                                <div className="text-sm text-gray-500">Bus #{route.bus}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}
                              >
                                {route.status.replace("-", " ")}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm text-gray-900">{route.nextStop}</div>
                                <div className="text-sm text-gray-500">ETA: {route.eta}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm text-gray-900">
                                  {route.passengers}/{route.capacity}
                                </div>
                                <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-brand-medium-blue h-2 rounded-full"
                                    style={{ width: `${(route.passengers / route.capacity) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-brand-medium-blue hover:text-brand-dark-blue mr-3">Track</button>
                              <button className="text-gray-600 hover:text-gray-900">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Performance Analytics */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Performance Analytics</h2>
                    <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Quarter</option>
                    </select>
                  </div>

                  {/* Live Fleet Overview */}
                  <LiveTrackingMap userRole="manager" height="250px" />

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">96.8%</p>
                      <p className="text-sm text-gray-600">Route Completion</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">4.2 min</p>
                      <p className="text-sm text-gray-600">Avg Delay</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">98.1%</p>
                      <p className="text-sm text-gray-600">Parent Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                {/* Alerts & Notifications */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Alerts & Notifications</h2>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium uppercase tracking-wide">{alert.type}</span>
                          <span className="text-xs">{alert.time}</span>
                        </div>
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      to="/manager/alerts"
                      className="text-sm text-brand-medium-blue hover:text-brand-dark-blue font-medium"
                    >
                      View all alerts →
                    </Link>
                  </div>
                </div>

                {/* Driver Status */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Driver Status</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">On Duty</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        32 drivers
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Off Duty</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        6 drivers
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">On Break</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        4 drivers
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sick Leave</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        2 drivers
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link
                      to="/manager/routes/new"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-plus text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Create New Route</span>
                    </Link>
                    <Link
                      to="/manager/schedule"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-calendar text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Manage Schedules</span>
                    </Link>
                    <Link
                      to="/manager/drivers/assign"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-user-check text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Assign Drivers</span>
                    </Link>
                    <Link
                      to="/manager/maintenance"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-wrench text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Schedule Maintenance</span>
                    </Link>
                    <Link
                      to="/manager/reports"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-file-alt text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Generate Reports</span>
                    </Link>
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

export default ManagerDashboard
