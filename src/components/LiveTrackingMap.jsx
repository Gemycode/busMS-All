"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import AdvancedLeafletMap from './AdvancedLeafletMap'
import socketService from "../services/socketService"
import { fetchActiveBuses, setSelectedBus } from "../redux/trackingSlice"

function getClosestPointOnRoute(busLat, busLng, routePoints) {
  let minDist = Infinity;
  let closest = routePoints[0];
  routePoints.forEach(pt => {
    if (!pt || pt.length !== 2) return;
    const dist = Math.sqrt(Math.pow(pt[0] - busLat, 2) + Math.pow(pt[1] - busLng, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = pt;
    }
  });
  return closest;
}

const LiveTrackingMap = ({ routeId = null, busId = null, userRole = "parent", buses: busesProp = null, routes: routesProp = null }) => {
  const dispatch = useDispatch()
  const { selectedBus, isLoading, error, socketConnected, lastUpdate } = useSelector(
    (state) => state.tracking
  )
  // --- جديد: استخدم البيانات الممررة من props إذا وجدت ---
  const [routes, setRoutes] = useState(routesProp || [])
  const [stops, setStops] = useState([])
  // لا تجلب الباصات من redux، بل من props
  const [buses, setBuses] = useState(busesProp || [])

  // إذا تغيرت props، حدث الحالة
  useEffect(() => {
    if (routesProp) {
      setRoutes(routesProp)
      console.log("🚦 routesProp in LiveTrackingMap:", routesProp);
    }
  }, [routesProp])
  useEffect(() => {
    if (busesProp) setBuses(busesProp)
  }, [busesProp])

  // Connect to socket on component mount
  useEffect(() => {
    // parent/student: اشترك فقط في الباص المختار
    if ((userRole === 'parent' || userRole === 'student') && busId) {
      socketService.connect()
      socketService.joinBusTracking(busId)
      return () => { socketService.leaveTracking() }
    }
    // باقي الأدوار: اشترك في كل الباصات المعروضة
    if (Array.isArray(buses) && buses.length > 0) {
      socketService.connect()
      buses.forEach(bus => {
        const id = bus._id || bus.id
        if (id) socketService.joinBusTracking(id)
      })
      return () => { socketService.leaveTracking() }
    }
    // افتراضيًا: لا اشتراك
    return () => { socketService.leaveTracking() }
  }, [userRole, busId, buses])

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
  let mapBuses = Array.isArray(buses) ? buses.map(bus => ({
    id: bus._id || bus.id,
    number: bus.BusNumber || bus.number,
    route: bus.route_id?.name || bus.route_id || bus.route || "",
    route_id: bus.route_id?._id || bus.route_id || bus.route || "", // أضف هذا السطر
    driver: bus.assigned_driver_id?.firstName ? `${bus.assigned_driver_id.firstName} ${bus.assigned_driver_id.lastName}` : bus.driver || "",
    lat: bus.currentLocation?.lat ?? bus.currentLocation?.latitude ?? bus.lat,
    lng: bus.currentLocation?.lng ?? bus.currentLocation?.long ?? bus.currentLocation?.longitude ?? bus.lng ?? bus.long ?? bus.longitude,
    status: bus.status || "active",
    passengers: bus.passengers || 0,
    capacity: bus.capacity || 0,
    speed: bus.speed || 0,
    heading: bus.heading || 0,
    nextStop: bus.nextStop || "",
    eta: bus.eta || "",
    isMoving: bus.isMoving || true,
    lastUpdate: bus.lastUpdate || new Date().toISOString(),
    batteryLevel: bus.batteryLevel || 100,
    signalStrength: bus.signalStrength || 100,
  })) : []

  // ثم ضع شرط عدم وجود باصات هنا:
  if (!Array.isArray(mapBuses) || mapBuses.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}>لا توجد بيانات باصات متاحة حالياً</div>;
  }

  const handleBusClick = (bus) => {
    dispatch(setSelectedBus(bus))
  }

  const handleStopClick = (stop) => {
    console.log("Stop clicked:", stop)
  }

  useEffect(() => {
    // فحص استقبال بيانات التتبع الحي
    const handler = (data) => {
      console.log('🟢 [Socket] busLocationUpdate:', data);
    };
    socketService.on('busLocationUpdate', handler);
    return () => socketService.off('busLocationUpdate', handler);
  }, []);

  useEffect(() => {
    // فحص صحة إحداثيات الباصات وربطها بالمسار
    if (!Array.isArray(buses) || !Array.isArray(routes)) return;
    buses.forEach(bus => {
      const lat = bus.currentLocation?.lat || bus.lat;
      const lng = bus.currentLocation?.long || bus.lng;
      const hasValidCoords = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
      const route = routes.find(r => (r._id || r.id) === (bus.route_id?._id || bus.route_id || bus.route));
      console.log('🔵 Bus:', bus.BusNumber || bus.number || bus._id, '| lat:', lat, '| lng:', lng, '| valid:', hasValidCoords, '| route found:', !!route);
      if (hasValidCoords && route) {
        // snap-to-route (فقط طباعة)
        const points = [
          route.start_point && [route.start_point.lat, route.start_point.long],
          ...(Array.isArray(route.stops) ? route.stops.map(stop => [stop.lat, stop.long || stop.lng]) : []),
          route.end_point && [route.end_point.lat, route.end_point.long]
        ].filter(pt => Array.isArray(pt) && pt.length === 2 && pt[0] != null && pt[1] != null && !isNaN(pt[0]) && !isNaN(pt[1]));
        const [snapLat, snapLng] = getClosestPointOnRoute(lat, lng, points);
        console.log('🟡 Snap-to-route:', { bus: bus.BusNumber || bus.number || bus._id, orig: [lat, lng], snapped: [snapLat, snapLng] });
      }
    });
  }, [buses, routes]);

  // أضف طباعة للـ buses و mapBuses لمراقبة اختفاء الباصات
  useEffect(() => {
    console.log('🚌 buses:', buses);
    console.log('🗺️ mapBuses:', mapBuses);
  }, [buses, mapBuses]);

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
        routes={routes}
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
                    className={`text-sm font-medium ${selectedBus.status === "active"
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
                  <span className="text-sm font-medium">{typeof selectedBus.lat === 'number' && !isNaN(selectedBus.lat) ? selectedBus.lat.toFixed(6) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Longitude:</span>
                  <span className="text-sm font-medium">{typeof selectedBus.lng === 'number' && !isNaN(selectedBus.lng) ? selectedBus.lng.toFixed(6) : '-'}</span>
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
                  className={`font-medium ${bus.status === "active"
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