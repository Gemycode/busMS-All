"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import LiveTrackingMap from "../components/LiveTrackingMap"
import TrackingTestPanel from "../components/TrackingTestPanel"
import { useDispatch, useSelector } from "react-redux"
import { fetchActiveBuses } from "../redux/trackingSlice"
import { fetchRoutes } from "../redux/routesSlice"
<<<<<<< HEAD
import api from "../redux/api";
=======
>>>>>>> 4729efbc99067405f72840029fa89122382d305b

const MapView = () => {
  const [viewMode, setViewMode] = useState("all") // all, route, bus
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedBus, setSelectedBus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showTestPanel, setShowTestPanel] = useState(false)
  const [selectedChild, setSelectedChild] = useState("");
  const [children, setChildren] = useState([]);
  const [childBookings, setChildBookings] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [childLoading, setChildLoading] = useState(false);
  const [tripLoading, setTripLoading] = useState(false);

  // --- جديد: حالة الدور والبيانات ---

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { buses, loading: busesLoading, error: busesError } = useSelector(state => state.tracking);
  const { routes, loading: routesLoading, error: routesError } = useSelector(state => state.routes);

  const loading = busesLoading || routesLoading;
  const error = busesError || routesError;

  useEffect(() => {
    dispatch(fetchActiveBuses());
    dispatch(fetchRoutes());
  }, [dispatch]);

<<<<<<< HEAD
  // جلب الأبناء إذا كان Parent
  useEffect(() => {
    if (user?.role === "parent") {
      setChildLoading(true);
      api.get("/users/me/children").then(res => {
        setChildren(res.data.data?.children || res.data.children || []);
      }).finally(() => setChildLoading(false));
    }
  }, [user]);

  // جلب حجوزات الطفل عند اختياره
  useEffect(() => {
    if (user?.role === "parent" && selectedChild) {
      setTripLoading(true);
      api.get(`/bookings/student/${selectedChild}`).then(res => {
        setChildBookings((res.data || []).filter(b => b.status !== 'cancelled'));
      }).finally(() => setTripLoading(false));
    } else {
      setChildBookings([]);
      setSelectedTrip("");
    }
  }, [user, selectedChild]);

=======
>>>>>>> 4729efbc99067405f72840029fa89122382d305b
  // منطق اختيار الباص للـ parent/student
  const isParentOrStudent = user?.role === "parent" || user?.role === "student"
  const busesForSelect = buses.map(bus => ({ id: bus._id || bus.id, name: bus.BusNumber || bus.number }))
  const hasSingleBus = isParentOrStudent && busesForSelect.length === 1
  const hasMultipleBuses = isParentOrStudent && busesForSelect.length > 1

  // إذا parent/student وباص واحد فقط: اختاره تلقائيًا
  useEffect(() => {
    if (hasSingleBus) {
      setSelectedBus(busesForSelect[0].id)
    }
  }, [hasSingleBus, busesForSelect])

  // إذا تم تغيير الدور أو الباصات: إعادة تعيين الاختيار
  useEffect(() => {
    if (!isParentOrStudent) {
      setSelectedBus("")
    }
  }, [user?.role, buses])

  // Read busId and routeId from query params for deep linking from notifications
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const busIdFromQuery = params.get('busId');
  const routeIdFromQuery = params.get('routeId');

<<<<<<< HEAD
  // تحديد الباص والمسار بناءً على الرحلة المختارة
  let busIdProp = null;
  let routeIdProp = null;
  if (user?.role === "parent" && selectedTrip) {
    const selectedBooking = childBookings.find(b => b.tripId === selectedTrip || b.tripId?._id === selectedTrip);
    console.log('selected booking:', selectedBooking);
    if (selectedBooking) {
      busIdProp = selectedBooking.busId?._id || selectedBooking.busId;
      routeIdProp = selectedBooking.routeId?._id || selectedBooking.routeId;
    }
  } else {
    // --- تمرير البيانات لمكون الخريطة ---
    busIdProp = busIdFromQuery || selectedBus || null
    routeIdProp = routeIdFromQuery || (viewMode === "route" ? selectedRoute : null)
  }

  // تعريف المتغيرين دائمًا لتفادي الخطأ
  let busesToShow = buses;
  let routesToShow = routes;
=======
  // --- تمرير البيانات لمكون الخريطة ---
  let busesToShow = buses
  let routesToShow = routes
  let busIdProp = busIdFromQuery || selectedBus || null
  let routeIdProp = routeIdFromQuery || (viewMode === "route" ? selectedRoute : null)
>>>>>>> 4729efbc99067405f72840029fa89122382d305b

  if (isParentOrStudent) {
    // parent/student: عرض باص واحد فقط (المختار)
    busesToShow = buses.filter(b => (b._id || b.id) === busIdProp)
    // عرض المسار الخاص بالباص فقط
    const busObj = buses.find(b => (b._id || b.id) === busIdProp)
    if (busObj && busObj.route_id) {
      routesToShow = routes.filter(r => (r._id || r.id) === (busObj.route_id._id || busObj.route_id || ""))
    } else {
      routesToShow = []
    }
  }

<<<<<<< HEAD
  console.log('buses:', buses);
  console.log('routes:', routes);
  console.log('busIdProp:', busIdProp, 'routeIdProp:', routeIdProp);

=======
>>>>>>> 4729efbc99067405f72840029fa89122382d305b
  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-0 pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl  font-bold  mb-2">Live Bus Tracking</h1>
                <p >Real-time GPS tracking and route monitoring</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                {!isParentOrStudent && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                  >
                    <i className="fas fa-filter mr-2"></i>Filters
                  </button>
                )}
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
            {/* اختيار الباص للـ parent/student */}
            {/* حذف صندوق اختيار الباص للـ parent/student */}

<<<<<<< HEAD
=======
            {/* اختيار الباص للـ parent/student */}
            {hasMultipleBuses && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-bold text-brand-dark-blue mb-4">اختر الباص الخاص بك</h3>
                <select
                  value={selectedBus}
                  onChange={e => setSelectedBus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
                >
                  <option value="">اختر باص...</option>
                  {busesForSelect.map(bus => (
                    <option key={bus.id} value={bus.id}>{bus.name}</option>
                  ))}
                </select>
              </div>
            )}

>>>>>>> 4729efbc99067405f72840029fa89122382d305b
            {/* Filters Panel (لغير parent/student) */}
            {showFilters && !isParentOrStudent && (
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
                          <option key={route._id || route.id} value={route._id || route.id}>
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
                          <option key={bus._id || bus.id} value={bus._id || bus.id}>
                            {bus.BusNumber || bus.number}
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

<<<<<<< HEAD
            {/* Parent Flow: اختيار الطفل ثم الرحلة */}
            {user?.role === "parent" ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="mb-4">
                  <label className="block font-medium mb-1 text-brand-dark-blue">اختر الطفل</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedChild}
                    onChange={e => setSelectedChild(e.target.value)}
                    disabled={childLoading || children.length === 0}
                  >
                    <option value="">-- اختر الطفل --</option>
                    {children.map(child => (
                      <option key={child._id} value={child._id}>{child.firstName} {child.lastName}</option>
                    ))}
                  </select>
=======
            {/* Live Tracking Map */}
            {loading ? (
              <div className="text-center py-16 text-gray-500">جاري تحميل بيانات الخريطة...</div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">{error}</div>
            ) : isParentOrStudent && !busIdProp ? (
              <div className="text-center py-16 text-gray-500">
                يرجى اختيار باص لعرض التتبع الحي.
              </div>
            ) : (
              <LiveTrackingMap
                routeId={routeIdProp}
                busId={busIdProp}
                userRole={user?.role}
                buses={busesToShow}
                routes={routesToShow}
              />
            )}

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
>>>>>>> 4729efbc99067405f72840029fa89122382d305b
                </div>
                {selectedChild && (
                  <div className="mb-4">
                    <label className="block font-medium mb-1 text-brand-dark-blue">اختر الرحلة</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={selectedTrip}
                      onChange={e => setSelectedTrip(e.target.value)}
                      disabled={tripLoading || childBookings.length === 0}
                    >
                      <option value="">-- اختر الرحلة --</option>
                      {childBookings.map(b => (
                        <option key={b._id} value={b.tripId?._id || b.tripId}>
                          {b.routeId?.name || 'Trip'} | {b.date ? new Date(b.date).toLocaleDateString() : ''} | {b.busId?.BusNumber || ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {selectedChild && selectedTrip && (
                  <div className="mt-8">
                    <LiveTrackingMap
                      routeId={routeIdProp}
                      busId={busIdProp}
                      userRole="parent"
                      buses={buses}
                      routes={(Array.isArray(routes) ? routes : []).filter(r => (r._id || r.id) === routeIdProp)}
                      showRoutes={true}
                      showStops={true}
                      autoCenter={true}
                    />
                  </div>
                )}
                {(!selectedChild || !selectedTrip) && (
                  <div className="text-center text-gray-500 py-8">
                    يرجى اختيار الطفل ثم الرحلة لعرض الخريطة والتتبع.
                  </div>
                )}
              </div>
            ) : (
              // ... existing code for other roles ...
              <>
                {/* Live Tracking Map */}
                {loading ? (
                  <div className="text-center py-16 text-gray-500">جاري تحميل بيانات الخريطة...</div>
                ) : error ? (
                  <div className="text-center py-16 text-red-500">{error}</div>
                ) : isParentOrStudent && !busIdProp ? (
                  <div className="text-center py-16 text-gray-500">
                    يرجى اختيار باص لعرض التتبع الحي.
                  </div>
                ) : (
                  <LiveTrackingMap
                    routeId={routeIdProp}
                    busId={busIdProp}
                    userRole={user?.role}
                    buses={busesToShow}
                    routes={routesToShow}
                  />
                )}

                {/* Quick Stats */}
                {/* حذف قسم الإحصائيات السريعة (Quick Stats) */}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default MapView