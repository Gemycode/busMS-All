"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import LiveTrackingMap from "../components/LiveTrackingMap"
import TrackingTestPanel from "../components/TrackingTestPanel"

const MapView = () => {
  const [viewMode, setViewMode] = useState("all") // all, route, bus
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedBus, setSelectedBus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showTestPanel, setShowTestPanel] = useState(false)

  const routes = [
    { id: "42", name: "Route #42 - Westside Express" },
    { id: "15", name: "Route #15 - Downtown Loop" },
    { id: "28", name: "Route #28 - Northside Route" },
  ]

  const buses = [
    { id: "1042", name: "Bus #1042" },
    { id: "1087", name: "Bus #1087" },
    { id: "1156", name: "Bus #1156" },
  ]

  // Read busId and routeId from query params for deep linking from notifications
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const busIdFromQuery = params.get('busId');
  const routeIdFromQuery = params.get('routeId');

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl  font-bold  mb-2">Live Bus Tracking</h1>
                <p >Real-time GPS tracking and route monitoring</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-filter mr-2"></i>Filters
                </button>
                <button
                  onClick={() => setShowTestPanel(!showTestPanel)}
                  className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-cog mr-2"></i>Test Panel
                </button>
                <Link
                  to="/reports"
                  className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-all duration-200"
                >
                  <i className="fas fa-chart-bar mr-2"></i>Reports
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Test Panel */}
            {showTestPanel && (
              <div className="mb-8">
                <TrackingTestPanel />
              </div>
            )}

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Map Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setViewMode("all")
                        setSelectedRoute("")
                        setSelectedBus("")
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live Tracking Map */}
            <LiveTrackingMap
              routeId={routeIdFromQuery || (viewMode === "route" ? selectedRoute : null)}
              busId={busIdFromQuery || (viewMode === "bus" ? selectedBus : null)}
              userRole="admin"
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Buses Online</p>
                    <p className="text-2xl font-bold text-green-600">3/3</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-wifi text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">On Time</p>
                    <p className="text-2xl font-bold text-blue-600">2/3</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-clock text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg Speed</p>
                    <p className="text-2xl font-bold text-purple-600">22 km/h</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-tachometer-alt text-purple-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Passengers</p>
                    <p className="text-2xl font-bold text-yellow-600">105</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-users text-yellow-600 text-xl"></i>
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

export default MapView