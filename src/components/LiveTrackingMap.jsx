"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import AdvancedLeafletMap from './AdvancedLeafletMap'
import socketService from "../services/socketService"
import { fetchActiveBuses, setSelectedBus } from "../redux/trackingSlice"

const LiveTrackingMap = ({ routeId = null, busId = null, userRole = "parent" }) => {
  const dispatch = useDispatch()
  const { buses, selectedBus, isLoading, error, socketConnected, lastUpdate } = useSelector(
    (state) => state.tracking
  )
  const [routes, setRoutes] = useState([])
  const [stops, setStops] = useState([])

  // Connect to socket on component mount
  useEffect(() => {
    socketService.connect()
    
    return () => {
      socketService.leaveTracking()
    }
  }, [])

  // Fetch active buses on component mount
  useEffect(() => {
    dispatch(fetchActiveBuses())
  }, [dispatch])

  // Join specific tracking rooms based on props
  useEffect(() => {
    if (busId) {
      socketService.joinBusTracking(busId)
    } else if (routeId) {
      socketService.joinRouteTracking(routeId)
    } else {
      socketService.leaveTracking()
    }

    return () => {
      socketService.leaveTracking()
    }
  }, [busId, routeId])

  // Sample route data (you can fetch this from API later)
  useEffect(() => {
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

    setRoutes(sampleRoutes)
    setStops(sampleStops)
  }, [])

  // Robustly handle any buses shape and always show demo buses if no real buses
  let filteredBuses = Array.isArray(buses) ? buses : [];
  // Try to detect if buses are in the wrapped shape (with .bus and .location) or flat
  if (filteredBuses.length > 0 && filteredBuses[0].bus && filteredBuses[0].location) {
    filteredBuses = filteredBuses.filter(bus => {
      if (busId) {
        return bus.bus.id === busId;
      }
      if (routeId) {
        return bus.bus.route_id === routeId;
      }
      return true;
    });
  } else if (filteredBuses.length > 0 && filteredBuses[0].id && filteredBuses[0].lat && filteredBuses[0].lng) {
    // Flat shape
    filteredBuses = filteredBuses.filter(bus => {
      if (busId) {
        return bus.id === busId;
      }
      if (routeId) {
        return bus.route_id === routeId;
      }
      return true;
    });
  }

  // Transform buses data for map component
  let mapBuses = [];
  if (filteredBuses.length > 0 && filteredBuses[0].bus && filteredBuses[0].location) {
    mapBuses = filteredBuses
      .filter(bus => bus.location)
      .map(bus => ({
        id: bus.bus.id,
        number: bus.bus.number,
        route: `Route #${bus.bus.route_id || 'Unknown'}`,
        driver: "Driver Name",
        lat: bus.location.latitude,
        lng: bus.location.longitude,
        status: bus.location.status,
        passengers: 0,
        capacity: bus.bus.capacity,
        speed: bus.location.speed,
        heading: bus.location.heading,
        nextStop: bus.location.next_station || "Unknown",
        eta: "Calculating...",
        isMoving: bus.location.speed > 0,
        lastUpdate: bus.location.timestamp,
        batteryLevel: bus.location.battery_level || 100,
        signalStrength: bus.location.signal_strength || 100,
      }));
  } else if (filteredBuses.length > 0 && filteredBuses[0].id && filteredBuses[0].lat && filteredBuses[0].lng) {
    mapBuses = filteredBuses;
  }

  // بيانات تجريبية fallback
  const demoBuses = [
    {
      id: "DEMO001",
      number: "كورنيش النيل",
      route: "Route #1",
      driver: "أحمد محمد",
      lat: 24.088269,
      lng: 32.906964,
      status: "active",
      passengers: 30,
      capacity: 50,
      speed: 35,
      heading: 45,
      nextStop: "شارع كورنيش النيل",
      eta: "7:15 ص",
      isMoving: true,
      lastUpdate: new Date().toISOString(),
      batteryLevel: 90,
      signalStrength: 95,
    },
    {
      id: "DEMO002",
      number: "شارع المستشفى",
      route: "Route #2",
      driver: "منى علي",
      lat: 24.089272,
      lng: 32.908548,
      status: "active",
      passengers: 20,
      capacity: 50,
      speed: 28,
      heading: 60,
      nextStop: "شارع المحطة",
      eta: "7:20 ص",
      isMoving: true,
      lastUpdate: new Date().toISOString(),
      batteryLevel: 85,
      signalStrength: 90,
    },
    {
      id: "DEMO003",
      number: "طريق الأستاد",
      route: "Route #3",
      driver: "خالد حسن",
      lat: 24.095245,
      lng: 32.899451,
      status: "active",
      passengers: 15,
      capacity: 50,
      speed: 42,
      heading: 90,
      nextStop: "طريق الأستاد",
      eta: "7:30 ص",
      isMoving: true,
      lastUpdate: new Date().toISOString(),
      batteryLevel: 80,
      signalStrength: 88,
    }
  ];

  if (!Array.isArray(mapBuses) || mapBuses.length === 0) {
    mapBuses = demoBuses;
  }

  // If still no buses, show a fallback message
  if (!Array.isArray(mapBuses) || mapBuses.length === 0) {
    return <div style={{textAlign:'center',marginTop:'2rem',color:'#888'}}>لا توجد بيانات باصات متاحة حالياً</div>;
  }

  const handleBusClick = (bus) => {
    dispatch(setSelectedBus(bus))
  }

  const handleStopClick = (stop) => {
    console.log("Stop clicked:", stop)
  }

  if (isLoading && buses.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live tracking data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <p className="text-red-600 mb-2">Error loading tracking data</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => dispatch(fetchActiveBuses())}
            className="mt-4 px-4 py-2 bg-brand-medium-blue text-white rounded-md hover:bg-opacity-90"
          >
            Retry
          </button>
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
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Real-time GPS tracking</span>
            {lastUpdate && (
              <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
            )}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{socketConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
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
      <AdvancedLeafletMap
        height="600px"
        showControls={true}
        showCoverage={false}
        showRoutes={true}
        showStops={true}
        autoCenter={true}
        selectedBusId={busId}
        selectedRouteId={routeId}
        onBusClick={handleBusClick}
        buses={mapBuses}
      />

      {/* Bus Status Panel */}
      {selectedBus && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold text-brand-dark-blue">Bus #{selectedBus.number}</h4>
              <p className="text-gray-600">{selectedBus.route}</p>
            </div>
            <button onClick={() => dispatch(setSelectedBus(null))} className="text-gray-400 hover:text-gray-600">
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
                      selectedBus.status === "active"
                        ? "text-green-600"
                        : selectedBus.status === "stopped"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {selectedBus.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Speed:</span>
                  <span className="text-sm font-medium">{Math.round(selectedBus.speed)} km/h</span>
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
              <h5 className="text-sm font-medium text-gray-500 mb-2">System Status</h5>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Battery:</span>
                  <span className="text-sm font-medium">{selectedBus.batteryLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Signal:</span>
                  <span className="text-sm font-medium">{selectedBus.signalStrength}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Connection:</span>
                  <span className={`text-sm font-medium ${socketConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {socketConnected ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Data Feed */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Live Data Feed</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {mapBuses.length > 0 ? (
            mapBuses.map((bus) => (
              <div key={bus.id} className="flex justify-between items-center text-sm py-1">
                <span className="text-gray-600">Bus #{bus.number}</span>
                <span className="text-gray-500">{Math.round(bus.speed)} km/h</span>
                <span
                  className={`font-medium ${
                    bus.status === "active"
                      ? "text-green-600"
                      : bus.status === "stopped"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {bus.status}
                </span>
                <span className="text-xs text-gray-400">{new Date(bus.lastUpdate).toLocaleTimeString()}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No active buses found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveTrackingMap