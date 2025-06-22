"use client"

import { useState, useEffect } from "react"
import InteractiveMap from "./InteractiveMap"

const LiveTrackingMap = ({ routeId = null, busId = null, userRole = "parent" }) => {
  const [buses, setBuses] = useState([])
  const [routes, setRoutes] = useState([])
  const [stops, setStops] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading real-time data
    setTimeout(() => {
      // Sample bus data with GPS coordinates
      const sampleBuses = [
        {
          id: 1,
          number: "1042",
          route: "Route #42 - Westside Express",
          driver: "John Doe",
          lat: 37.7849,
          lng: -122.4094,
          status: "on-time",
          passengers: 28,
          capacity: 72,
          speed: 25,
          heading: 45,
          nextStop: "Maple & Oak Street",
          eta: "7:15 AM",
          isMoving: true,
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 2,
          number: "1087",
          route: "Route #15 - Downtown Loop",
          driver: "Sarah Wilson",
          lat: 37.7749,
          lng: -122.4194,
          status: "delayed",
          passengers: 45,
          capacity: 72,
          speed: 15,
          heading: 180,
          nextStop: "Central Station",
          eta: "7:23 AM",
          isMoving: true,
          lastUpdate: new Date().toISOString(),
        },
        {
          id: 3,
          number: "1156",
          route: "Route #28 - Northside Route",
          driver: "Mike Johnson",
          lat: 37.7949,
          lng: -122.4294,
          status: "stopped",
          passengers: 32,
          capacity: 72,
          speed: 0,
          heading: 90,
          nextStop: "Pine Street",
          eta: "7:18 AM",
          isMoving: false,
          lastUpdate: new Date().toISOString(),
        },
      ]

      // Sample route data
      const sampleRoutes = [
        {
          id: 42,
          name: "Westside Express",
          color: "#3B82F6",
          isActive: true,
          path: "M 10,50 Q 30,10 50,50 T 90,50",
        },
        {
          id: 15,
          name: "Downtown Loop",
          color: "#EF4444",
          isActive: true,
          path: "M 20,80 Q 50,20 80,80",
        },
        {
          id: 28,
          name: "Northside Route",
          color: "#10B981",
          isActive: true,
          path: "M 10,20 Q 50,60 90,20",
        },
      ]

      // Sample stop data
      const sampleStops = [
        {
          id: 1,
          name: "Westside Elementary",
          address: "123 School Street",
          lat: 37.7849,
          lng: -122.4094,
          type: "school",
          studentCount: 45,
          nextArrival: "7:15 AM",
        },
        {
          id: 2,
          name: "Maple & Oak Street",
          address: "Maple Ave & Oak St",
          lat: 37.7799,
          lng: -122.4144,
          type: "pickup",
          studentCount: 8,
          nextArrival: "7:12 AM",
        },
        {
          id: 3,
          name: "Central Station",
          address: "100 Central Ave",
          lat: 37.7749,
          lng: -122.4194,
          type: "pickup",
          studentCount: 12,
          nextArrival: "7:23 AM",
        },
        {
          id: 4,
          name: "Pine Street Stop",
          address: "Pine St & 5th Ave",
          lat: 37.7949,
          lng: -122.4294,
          type: "dropoff",
          studentCount: 6,
          nextArrival: "7:18 AM",
        },
      ]

      setBuses(sampleBuses)
      setRoutes(sampleRoutes)
      setStops(sampleStops)
      setIsLoading(false)

      // If specific bus or route is requested, filter data
      if (busId) {
        setBuses(sampleBuses.filter((bus) => bus.id === Number.parseInt(busId)))
      }
      if (routeId) {
        const routeBuses = sampleBuses.filter((bus) => bus.route.includes(`#${routeId}`))
        setBuses(routeBuses)
      }
    }, 1000)
  }, [routeId, busId])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => ({
          ...bus,
          // Simulate small GPS movements
          lat: bus.lat + (Math.random() - 0.5) * 0.0002,
          lng: bus.lng + (Math.random() - 0.5) * 0.0002,
          // Simulate speed changes
          speed: Math.max(0, bus.speed + (Math.random() - 0.5) * 5),
          // Update timestamp
          lastUpdate: new Date().toISOString(),
        })),
      )
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const handleBusClick = (bus) => {
    setSelectedBus(bus)
  }

  const handleStopClick = (stop) => {
    console.log("Stop clicked:", stop)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live tracking data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Map Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-brand-dark-blue">Live Bus Tracking</h3>
          <p className="text-sm text-gray-600">
            Real-time GPS tracking • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm hover:bg-opacity-90">
            <i className="fas fa-expand mr-1"></i>Fullscreen
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">
            <i className="fas fa-download mr-1"></i>Export
          </button>
        </div>
      </div>

      {/* Interactive Map */}
      <InteractiveMap
        height="500px"
        buses={buses}
        routes={routes}
        stops={stops}
        center={{ lat: 37.7749, lng: -122.4194 }}
        zoom={13}
        showControls={true}
        onBusClick={handleBusClick}
        onStopClick={handleStopClick}
        userRole={userRole}
      />

      {/* Bus Status Panel */}
      {selectedBus && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold text-brand-dark-blue">Bus #{selectedBus.number}</h4>
              <p className="text-gray-600">{selectedBus.route}</p>
            </div>
            <button onClick={() => setSelectedBus(null)} className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Current Status</h5>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`text-sm font-medium ${
                      selectedBus.status === "on-time"
                        ? "text-green-600"
                        : selectedBus.status === "delayed"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {selectedBus.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Speed:</span>
                  <span className="text-sm font-medium">{Math.round(selectedBus.speed)} mph</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Passengers:</span>
                  <span className="text-sm font-medium">
                    {selectedBus.passengers}/{selectedBus.capacity}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Location</h5>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Latitude:</span>
                  <span className="text-sm font-medium">{selectedBus.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Longitude:</span>
                  <span className="text-sm font-medium">{selectedBus.lng.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Updated:</span>
                  <span className="text-sm font-medium">{new Date(selectedBus.lastUpdate).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Next Stop</h5>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-900">{selectedBus.nextStop}</div>
                <div className="text-sm text-gray-600">ETA: {selectedBus.eta}</div>
                <button className="mt-2 px-3 py-1 bg-brand-medium-blue text-white rounded text-xs hover:bg-opacity-90">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Data Feed */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Live Data Feed</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {buses.map((bus) => (
            <div key={bus.id} className="flex justify-between items-center text-sm py-1">
              <span className="text-gray-600">Bus #{bus.number}</span>
              <span className="text-gray-500">{Math.round(bus.speed)} mph</span>
              <span
                className={`font-medium ${
                  bus.status === "on-time"
                    ? "text-green-600"
                    : bus.status === "delayed"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                {bus.status.replace("-", " ")}
              </span>
              <span className="text-xs text-gray-400">{new Date(bus.lastUpdate).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LiveTrackingMap
