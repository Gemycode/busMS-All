"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import LiveTrackingMap from "../components/LiveTrackingMap"

const MapView = () => {
  const [viewMode, setViewMode] = useState("all") // all, route, bus
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedBus, setSelectedBus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [timeRange, setTimeRange] = useState("live") // live, today, week
  const [mapType, setMapType] = useState("standard") // standard, satellite, hybrid
  const [liveStats, setLiveStats] = useState({
    totalBuses: 3,
    onlineBuses: 3,
    onTimeBuses: 2,
    delayedBuses: 1,
    totalPassengers: 105,
    avgSpeed: 22,
    totalDistance: 156.7
  })

  const routes = [
    { id: "A", name: "Route A - School Zone", color: "#3B82F6", buses: 1 },
    { id: "B", name: "Route B - Residential Area", color: "#EF4444", buses: 1 },
    { id: "C", name: "Route C - Express Line", color: "#10B981", buses: 1 },
  ]

  const buses = [
    { id: "BUS-001", name: "Bus #BUS-001", route: "Route A", status: "on-time" },
    { id: "BUS-002", name: "Bus #BUS-002", route: "Route B", status: "delayed" },
    { id: "BUS-003", name: "Bus #BUS-003", route: "Route C", status: "stopped" },
  ]

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        avgSpeed: Math.round(prev.avgSpeed + (Math.random() - 0.5) * 2),
        totalPassengers: prev.totalPassengers + Math.floor(Math.random() * 3) - 1,
        totalDistance: prev.totalDistance + (Math.random() * 0.5)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'stopped': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-time': return 'fas fa-check-circle';
      case 'delayed': return 'fas fa-exclamation-triangle';
      case 'stopped': return 'fas fa-pause-circle';
      default: return 'fas fa-question-circle';
    }
  }

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        {/* Enhanced Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div>
                <h1 className="text-3xl font-bold text-brand-dark-blue mb-2 drop-shadow-sm">Live Bus Tracking</h1>
                <p className="text-brand-dark-blue text-opacity-95 font-medium">Real-time GPS tracking and route monitoring</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-brand-dark-blue text-opacity-90 font-medium">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Live Updates
                  </span>
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-filter mr-2"></i>Filters
                </button>
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="px-4 py-2 bg-brand-beige bg-opacity-80 text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-chart-bar mr-2"></i>Stats
                </button>
                <Link
                  to="/reports"
                  className="px-4 py-2 bg-brand-beige bg-opacity-80 text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-file-alt mr-2"></i>Reports
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-brand-dark-blue">Map Filters & Controls</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                    <select
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                    >
                      <option value="all">All Buses</option>
                      <option value="route">Specific Route</option>
                      <option value="bus">Specific Bus</option>
                    </select>
                  </div>

                  {viewMode === "route" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Route</label>
                      <select
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                      >
                        <option value="">Choose a route...</option>
                        {routes.map((route) => (
                          <option key={route.id} value={route.id}>
                            {route.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {viewMode === "bus" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Bus</label>
                      <select
                        value={selectedBus}
                        onChange={(e) => setSelectedBus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                      >
                        <option value="">Choose a bus...</option>
                        {buses.map((bus) => (
                          <option key={bus.id} value={bus.id}>
                            {bus.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Map Type</label>
                    <select
                      value={mapType}
                      onChange={(e) => setMapType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                    >
                      <option value="standard">Standard</option>
                      <option value="satellite">Satellite</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => {
                        setViewMode("all")
                        setSelectedRoute("")
                        setSelectedBus("")
                        setMapType("standard")
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live Tracking Map */}
            <div className="mb-8">
              <LiveTrackingMap
                routeId={viewMode === "route" ? selectedRoute : null}
                busId={viewMode === "bus" ? selectedBus : null}
                userRole="admin"
              />
            </div>

            {/* Enhanced Quick Stats */}
            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Buses Online</p>
                      <p className="text-2xl font-bold text-green-600">{liveStats.onlineBuses}/{liveStats.totalBuses}</p>
                      <p className="text-xs text-gray-400 mt-1">All systems operational</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-wifi text-green-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">On Time</p>
                      <p className="text-2xl font-bold text-blue-600">{liveStats.onTimeBuses}/{liveStats.totalBuses}</p>
                      <p className="text-xs text-gray-400 mt-1">Running smoothly</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-clock text-blue-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg Speed</p>
                      <p className="text-2xl font-bold text-purple-600">{liveStats.avgSpeed} km/h</p>
                      <p className="text-xs text-gray-400 mt-1">Optimal performance</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-tachometer-alt text-purple-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Passengers</p>
                      <p className="text-2xl font-bold text-yellow-600">{liveStats.totalPassengers}</p>
                      <p className="text-xs text-gray-400 mt-1">Currently traveling</p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-users text-yellow-600 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bus Status Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-brand-dark-blue">Bus Status Overview</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Passengers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Speed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Update
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {buses.map((bus) => (
                      <tr key={bus.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-brand-medium-blue rounded-full flex items-center justify-center">
                              <i className="fas fa-bus text-white text-sm"></i>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{bus.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{bus.route}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bus.status)}`}>
                            <i className={`${getStatusIcon(bus.status)} mr-1`}></i>
                            {bus.status.replace("-", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.floor(Math.random() * 50) + 20}/72
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.floor(Math.random() * 30) + 10} km/h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-brand-medium-blue hover:text-brand-dark-blue mr-3">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <i className="fas fa-phone"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MapView
