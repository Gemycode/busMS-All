"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [selectedReport, setSelectedReport] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  // Sample data for reports
  const [reportData, setReportData] = useState({
    overview: {
      totalTrips: 1247,
      totalDistance: 15680,
      totalPassengers: 45230,
      avgSpeed: 28.5,
      onTimePercentage: 94.2,
      fuelConsumption: 2340,
      maintenanceAlerts: 3,
      revenue: 0 // Free service
    },
    performance: {
      daily: [
        { day: "Mon", trips: 45, passengers: 1200, avgSpeed: 26 },
        { day: "Tue", trips: 52, passengers: 1350, avgSpeed: 28 },
        { day: "Wed", trips: 48, passengers: 1280, avgSpeed: 27 },
        { day: "Thu", trips: 55, passengers: 1420, avgSpeed: 29 },
        { day: "Fri", trips: 50, passengers: 1300, avgSpeed: 28 },
        { day: "Sat", trips: 35, passengers: 900, avgSpeed: 25 },
        { day: "Sun", trips: 25, passengers: 650, avgSpeed: 24 }
      ],
      routes: [
        { name: "Route A", efficiency: 96, passengers: 8500, trips: 180 },
        { name: "Route B", efficiency: 92, passengers: 7200, trips: 165 },
        { name: "Route C", efficiency: 94, passengers: 6800, trips: 155 }
      ]
    },
    analytics: {
      peakHours: [
        { hour: "6-8 AM", passengers: 8500, trips: 45 },
        { hour: "8-10 AM", passengers: 7200, trips: 38 },
        { hour: "2-4 PM", passengers: 6800, trips: 42 },
        { hour: "4-6 PM", passengers: 9200, trips: 48 }
      ],
      busUtilization: [
        { bus: "BUS-001", utilization: 87, trips: 45, passengers: 1200 },
        { bus: "BUS-002", utilization: 92, trips: 52, passengers: 1350 },
        { bus: "BUS-003", utilization: 78, trips: 38, passengers: 980 }
      ]
    }
  })

  useEffect(() => {
    setIsLoading(true)
    // Simulate loading report data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [selectedPeriod, selectedReport])

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBgColor = (percentage) => {
    if (percentage >= 90) return "bg-green-100"
    if (percentage >= 75) return "bg-yellow-100"
    return "bg-red-100"
  }

  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1)
  }

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div>
                <h1 className="text-3xl font-bold text-brand-dark-blue mb-2 drop-shadow-sm">Reports & Analytics</h1>
                <p className="text-brand-dark-blue text-opacity-95 font-medium">Comprehensive insights and performance metrics</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-brand-dark-blue text-opacity-90 font-medium">
                  <span className="flex items-center">
                    <i className="fas fa-chart-line mr-2"></i>
                    Real-time Analytics
                  </span>
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md border-0 focus:ring-2 focus:ring-brand-medium-blue"
                >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
                <button className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-md">
                  <i className="fas fa-download mr-2"></i>Export
                </button>
                <Link
                  to="/map"
                  className="px-4 py-2 bg-brand-beige bg-opacity-80 text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-map mr-2"></i>Live Map
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Report Navigation */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedReport("overview")}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    selectedReport === "overview"
                      ? "bg-brand-medium-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-chart-pie mr-2"></i>Overview
                </button>
                <button
                  onClick={() => setSelectedReport("performance")}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    selectedReport === "performance"
                      ? "bg-brand-medium-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-tachometer-alt mr-2"></i>Performance
                </button>
                <button
                  onClick={() => setSelectedReport("analytics")}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    selectedReport === "analytics"
                      ? "bg-brand-medium-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-chart-line mr-2"></i>Analytics
                </button>
                <button
                  onClick={() => setSelectedReport("financial")}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    selectedReport === "financial"
                      ? "bg-brand-medium-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="fas fa-dollar-sign mr-2"></i>Financial
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium-blue mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading report data...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Overview Report */}
                {selectedReport === "overview" && (
                  <div className="space-y-8">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Trips</p>
                            <p className="text-2xl font-bold text-blue-600">{formatNumber(reportData.overview.totalTrips)}</p>
                            <p className="text-xs text-gray-400 mt-1">This {selectedPeriod}</p>
                          </div>
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-route text-blue-600 text-xl"></i>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Distance</p>
                            <p className="text-2xl font-bold text-green-600">{formatNumber(reportData.overview.totalDistance)} km</p>
                            <p className="text-xs text-gray-400 mt-1">Average per trip: 12.6 km</p>
                          </div>
                          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-road text-green-600 text-xl"></i>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Passengers</p>
                            <p className="text-2xl font-bold text-purple-600">{formatNumber(reportData.overview.totalPassengers)}</p>
                            <p className="text-xs text-gray-400 mt-1">Average per trip: 36.3</p>
                          </div>
                          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-users text-purple-600 text-xl"></i>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">On-Time Rate</p>
                            <p className="text-2xl font-bold text-yellow-600">{reportData.overview.onTimePercentage}%</p>
                            <p className="text-xs text-gray-400 mt-1">Excellent performance</p>
                          </div>
                          <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-clock text-yellow-600 text-xl"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Weekly Performance Trend</h3>
                      <div className="h-64 flex items-end justify-between space-x-2">
                        {reportData.performance.daily.map((day, index) => (
                          <div key={day.day} className="flex flex-col items-center flex-1">
                            <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                            <div
                              className="w-full bg-gradient-to-t from-brand-medium-blue to-brand-dark-blue rounded-t"
                              style={{ height: `${(day.trips / 60) * 200}px` }}
                            ></div>
                            <div className="text-xs text-gray-600 mt-2">{day.trips}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Fuel Consumption</h4>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(reportData.overview.fuelConsumption)} L</div>
                        <p className="text-sm text-gray-600">Average: 1.88 L per trip</p>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">85% efficiency</p>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Maintenance Alerts</h4>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{reportData.overview.maintenanceAlerts}</div>
                        <p className="text-sm text-gray-600">Pending maintenance</p>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Bus #BUS-002</span>
                            <span className="text-yellow-600">Oil Change</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Bus #BUS-003</span>
                            <span className="text-red-600">Brake Check</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Service Status</h4>
                        <div className="text-3xl font-bold text-green-600 mb-2">Free</div>
                        <p className="text-sm text-gray-600">Internal company service</p>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Employee Benefits</span>
                            <span className="text-green-600">100%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Family Members</span>
                            <span className="text-green-600">100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Report */}
                {selectedReport === "performance" && (
                  <div className="space-y-8">
                    {/* Route Performance */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Route Performance Analysis</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.performance.routes.map((route) => (
                              <tr key={route.name} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{route.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceBgColor(route.efficiency)} ${getPerformanceColor(route.efficiency)}`}>
                                    {route.efficiency}%
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatNumber(route.passengers)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {route.trips}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    route.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                                    route.efficiency >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {route.efficiency >= 90 ? 'Excellent' :
                                     route.efficiency >= 75 ? 'Good' : 'Needs Attention'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Daily Performance Metrics</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-medium text-gray-700 mb-3">Passenger Volume</h4>
                          <div className="h-48 flex items-end justify-between space-x-2">
                            {reportData.performance.daily.map((day) => (
                              <div key={day.day} className="flex flex-col items-center flex-1">
                                <div
                                  className="w-full bg-gradient-to-t from-purple-500 to-purple-700 rounded-t"
                                  style={{ height: `${(day.passengers / 1500) * 150}px` }}
                                ></div>
                                <div className="text-xs text-gray-600 mt-2">{day.day}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-md font-medium text-gray-700 mb-3">Average Speed</h4>
                          <div className="h-48 flex items-end justify-between space-x-2">
                            {reportData.performance.daily.map((day) => (
                              <div key={day.day} className="flex flex-col items-center flex-1">
                                <div
                                  className="w-full bg-gradient-to-t from-green-500 to-green-700 rounded-t"
                                  style={{ height: `${(day.avgSpeed / 30) * 150}px` }}
                                ></div>
                                <div className="text-xs text-gray-600 mt-2">{day.avgSpeed} km/h</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analytics Report */}
                {selectedReport === "analytics" && (
                  <div className="space-y-8">
                    {/* Peak Hours Analysis */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Peak Hours Analysis</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-medium text-gray-700 mb-3">Passenger Volume by Hour</h4>
                          <div className="space-y-3">
                            {reportData.analytics.peakHours.map((peak) => (
                              <div key={peak.hour} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{peak.hour}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-brand-medium-blue h-2 rounded-full"
                                      style={{ width: `${(peak.passengers / 10000) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{formatNumber(peak.passengers)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-md font-medium text-gray-700 mb-3">Bus Utilization</h4>
                          <div className="space-y-3">
                            {reportData.analytics.busUtilization.map((bus) => (
                              <div key={bus.bus} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{bus.bus}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full"
                                      style={{ width: `${bus.utilization}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{bus.utilization}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Bus Performance Details</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Passengers</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {reportData.analytics.busUtilization.map((bus) => (
                                <tr key={bus.bus}>
                                  <td className="px-4 py-2 text-sm text-gray-900">{bus.bus}</td>
                                  <td className="px-4 py-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      bus.utilization >= 90 ? 'bg-green-100 text-green-800' :
                                      bus.utilization >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {bus.utilization}%
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{bus.trips}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{formatNumber(bus.passengers)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Key Insights</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                              <i className="fas fa-lightbulb text-blue-600 mr-3"></i>
                              <div>
                                <h5 className="text-sm font-medium text-blue-900">Peak Hours Identified</h5>
                                <p className="text-sm text-blue-700">6-8 AM and 4-6 PM show highest demand</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                              <i className="fas fa-chart-line text-green-600 mr-3"></i>
                              <div>
                                <h5 className="text-sm font-medium text-green-900">Efficiency Improvement</h5>
                                <p className="text-sm text-green-700">Average utilization increased by 8% this month</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <div className="flex items-center">
                              <i className="fas fa-exclamation-triangle text-yellow-600 mr-3"></i>
                              <div>
                                <h5 className="text-sm font-medium text-yellow-900">Maintenance Alert</h5>
                                <p className="text-sm text-yellow-700">BUS-003 requires brake system inspection</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Financial Report */}
                {selectedReport === "financial" && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Financial Overview</h3>
                      <div className="text-center py-12">
                        <i className="fas fa-hand-holding-heart text-6xl text-green-500 mb-4"></i>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Free Service</h4>
                        <p className="text-gray-600 mb-4">This is an internal company service provided free of charge to employees and their families.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">0 SAR</div>
                            <div className="text-sm text-gray-600">Revenue</div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">100%</div>
                            <div className="text-sm text-gray-600">Employee Coverage</div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">100%</div>
                            <div className="text-sm text-gray-600">Family Coverage</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Reports 