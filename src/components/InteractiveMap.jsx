"use client"

import { useState, useEffect, useRef } from "react"

const InteractiveMap = ({
  height = "400px",
  buses = [],
  routes = [],
  stops = [],
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 12,
  showControls = true,
  onBusClick = null,
  onStopClick = null,
  userRole = "parent",
}) => {
  const mapRef = useRef(null)
  const [mapCenter, setMapCenter] = useState(center)
  const [mapZoom, setMapZoom] = useState(zoom)
  const [selectedBus, setSelectedBus] = useState(null)
  const [selectedStop, setSelectedStop] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [mapStyle, setMapStyle] = useState("standard")

  // Simulate real-time GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This would normally come from a WebSocket or API
      // For demo purposes, we'll simulate small movements
      buses.forEach((bus) => {
        if (bus.isMoving) {
          // Simulate GPS coordinate updates (very small movements)
          bus.lat += (Math.random() - 0.5) * 0.0001
          bus.lng += (Math.random() - 0.5) * 0.0001
          bus.lastUpdate = new Date().toISOString()
        }
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [buses])

  const handleBusClick = (bus) => {
    setSelectedBus(bus)
    setMapCenter({ lat: bus.lat, lng: bus.lng })
    if (onBusClick) onBusClick(bus)
  }

  const handleStopClick = (stop) => {
    setSelectedStop(stop)
    setMapCenter({ lat: stop.lat, lng: stop.lng })
    if (onStopClick) onStopClick(stop)
  }

  const zoomIn = () => {
    setMapZoom(Math.min(mapZoom + 1, 18))
  }

  const zoomOut = () => {
    setMapZoom(Math.max(mapZoom - 1, 1))
  }

  const centerOnUser = () => {
    // Simulate getting user location
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setMapZoom(15)
      },
      () => {
        // Fallback to default center
        setMapCenter(center)
      },
    )
  }

  const toggleTracking = () => {
    setIsTracking(!isTracking)
  }

  const getBusStatusColor = (status) => {
    switch (status) {
      case "on-time":
        return "#10B981" // green
      case "delayed":
        return "#EF4444" // red
      case "early":
        return "#3B82F6" // blue
      case "stopped":
        return "#F59E0B" // yellow
      default:
        return "#6B7280" // gray
    }
  }

  const getStopTypeColor = (type) => {
    switch (type) {
      case "school":
        return "#8B5CF6" // purple
      case "pickup":
        return "#06B6D4" // cyan
      case "dropoff":
        return "#F97316" // orange
      default:
        return "#6B7280" // gray
    }
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden" style={{ height }}>
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full relative bg-gradient-to-br from-green-100 to-blue-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        {/* Grid overlay to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Routes */}
        {routes.map((route, index) => (
          <div key={route.id} className="absolute inset-0">
            <svg className="w-full h-full">
              <path
                d={route.path}
                stroke={route.color || "#3B82F6"}
                strokeWidth="3"
                fill="none"
                strokeDasharray={route.isActive ? "none" : "5,5"}
                opacity={route.isActive ? 1 : 0.5}
              />
            </svg>
          </div>
        ))}

        {/* Bus Stops */}
        {stops.map((stop) => (
          <div
            key={stop.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${(stop.lng - mapCenter.lng) * 1000 + 50}%`,
              top: `${-(stop.lat - mapCenter.lat) * 1000 + 50}%`,
            }}
            onClick={() => handleStopClick(stop)}
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform duration-200"
              style={{ backgroundColor: getStopTypeColor(stop.type) }}
            ></div>
            {selectedStop?.id === stop.id && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-10">
                <div className="text-sm font-medium text-gray-900">{stop.name}</div>
                <div className="text-xs text-gray-500">{stop.address}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Type: {stop.type} | Students: {stop.studentCount || 0}
                </div>
                {stop.nextArrival && <div className="text-xs text-blue-600 mt-1">Next bus: {stop.nextArrival}</div>}
              </div>
            )}
          </div>
        ))}

        {/* Buses */}
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${(bus.lng - mapCenter.lng) * 1000 + 50}%`,
              top: `${-(bus.lat - mapCenter.lat) * 1000 + 50}%`,
            }}
            onClick={() => handleBusClick(bus)}
          >
            <div className="relative">
              {/* Bus Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: getBusStatusColor(bus.status) }}
              >
                <i className="fas fa-bus text-sm"></i>
              </div>

              {/* Bus Number Badge */}
              <div className="absolute -top-2 -right-2 bg-white text-xs font-bold text-gray-800 rounded-full w-5 h-5 flex items-center justify-center shadow">
                {bus.number}
              </div>

              {/* Direction Indicator */}
              {bus.heading && (
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"
                  style={{ transform: `translateX(-50%) translateY(-4px) rotate(${bus.heading}deg)` }}
                >
                  <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-800"></div>
                </div>
              )}

              {/* Bus Info Popup */}
              {selectedBus?.id === bus.id && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 min-w-64 z-10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-bold text-gray-900">Bus #{bus.number}</div>
                      <div className="text-xs text-gray-500">{bus.route}</div>
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getBusStatusColor(bus.status) }}
                    >
                      {bus.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Driver: {bus.driver}</div>
                    <div>
                      Passengers: {bus.passengers}/{bus.capacity}
                    </div>
                    <div>Speed: {bus.speed || 0} mph</div>
                    <div>Next Stop: {bus.nextStop}</div>
                    {bus.eta && <div>ETA: {bus.eta}</div>}
                  </div>

                  <div className="mt-3 flex space-x-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                      Track
                    </button>
                    <button className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600">
                      Contact
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Map Controls */}
        {showControls && (
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            {/* Zoom Controls */}
            <div className="bg-white rounded-lg shadow-md">
              <button
                onClick={zoomIn}
                className="block w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-t-lg"
              >
                <i className="fas fa-plus"></i>
              </button>
              <div className="border-t border-gray-200"></div>
              <button
                onClick={zoomOut}
                className="block w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-b-lg"
              >
                <i className="fas fa-minus"></i>
              </button>
            </div>

            {/* Location Control */}
            <button
              onClick={centerOnUser}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              <i className="fas fa-location-arrow"></i>
            </button>

            {/* Tracking Toggle */}
            <button
              onClick={toggleTracking}
              className={`w-10 h-10 rounded-lg shadow-md flex items-center justify-center text-white ${
                isTracking ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
              }`}
            >
              <i className={`fas ${isTracking ? "fa-pause" : "fa-play"}`}></i>
            </button>

            {/* Map Style Toggle */}
            <button
              onClick={() => setMapStyle(mapStyle === "standard" ? "satellite" : "standard")}
              className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              <i className="fas fa-layer-group"></i>
            </button>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
          <div className="text-xs font-medium text-gray-900 mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">On Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-600">Delayed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-xs text-gray-600">Stopped</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-xs text-gray-600">School</span>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isTracking ? "bg-green-500" : "bg-gray-400"}`}></div>
            <span className="text-xs font-medium text-gray-900">
              {isTracking ? "Live Tracking" : "Tracking Paused"}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {buses.length} buses • {stops.length} stops
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveMap
