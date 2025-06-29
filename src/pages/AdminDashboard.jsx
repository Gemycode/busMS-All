"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import DynamicModal from "../components/DynamicModal"
import { userSchema, busSchema, routeSchema } from "../components/schemas"
import { useSelector, useDispatch } from "react-redux"
import { fetchBuses, updateBus, deleteBus, clearMessage as clearBusMessage } from "../redux/busSlice"
import { fetchRoutes, createRoute, updateRoute, deleteRoute, clearMessage as clearRouteMessage } from "../redux/routesSlice"
import dayjs from "dayjs"
import { fetchAttendanceStats } from "../redux/attendanceSlice"

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats: attendanceStats } = useSelector(state => state.attendance);
  const { buses, loading: busesLoading, error: busesError, message: busMsg } = useSelector((state) => state.buses);
  const { routes, loading: routesLoading, error: routesError, message: routeMsg } = useSelector((state) => state.routes);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBuses: 0,
    totalRoutes: 0,
    systemUptime: 0,
  })

  const [recentActivity, setRecentActivity] = useState([])

  const [showUserModal, setShowUserModal] = useState(false)
  const [showBusModal, setShowBusModal] = useState(false)
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [showEditRouteModal, setShowEditRouteModal] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [showEditBusModal, setShowEditBusModal] = useState(false)
  const [editingBus, setEditingBus] = useState(null)

  const previousRoutesCount = routes?.filter(route => dayjs(route.createdAt).isBefore(dayjs().subtract(1, 'day'))).length ?? 0;

  // Update stats when routes or buses change
  useEffect(() => {
    setStats(prevStats => ({
      ...prevStats,
      totalRoutes: routes?.length ?? 0,
      activeBuses: buses?.filter(bus => bus.status === 'active').length ?? 0,
    }))
  }, [routes, buses])

  // Clear messages after 3 seconds
  useEffect(() => {
    if (routeMsg) {
      const timer = setTimeout(() => {
        dispatch(clearRouteMessage())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [routeMsg, dispatch])

  useEffect(() => {
    if (busMsg) {
      const timer = setTimeout(() => {
        dispatch(clearBusMessage())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [busMsg, dispatch])

  useEffect(() => {
    dispatch(fetchAttendanceStats());
    dispatch(fetchBuses());
    dispatch(fetchRoutes());
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: 15847,
        systemUptime: 99.8,
      }))
      setRecentActivity([
        {
          id: 1,
          type: "user_created",
          message: "New parent account created: Sarah Johnson",
          time: "2 minutes ago",
          icon: "fa-user-plus",
          color: "text-green-600",
        },
        {
          id: 2,
          type: "route_updated",
          message: "Route #42 schedule updated by Manager Davis",
          time: "15 minutes ago",
          icon: "fa-route",
          color: "text-blue-600",
        },
        {
          id: 3,
          type: "system_alert",
          message: "Bus #1087 maintenance reminder triggered",
          time: "1 hour ago",
          icon: "fa-exclamation-triangle",
          color: "text-yellow-600",
        },
        {
          id: 4,
          type: "driver_assigned",
          message: "Driver John Smith assigned to Route #15",
          time: "2 hours ago",
          icon: "fa-id-badge",
          color: "text-purple-600",
        },
      ])
    }, 1000)
  }, [dispatch])

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="pt-20 pb-16">
        {/* Dashboard Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">System Administration</h1>
                <p >Welcome back, Administrator</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/admin/users"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-users mr-2"></i>Manage Users
                </Link>
                <Link
                  to="/attendance"
                  className="px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-all duration-200"
                >
                  <i className="fas fa-clipboard-check mr-2"></i>Attendance
                </Link>
                <Link
                  to="/admin/settings"
                  className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-all duration-200"
                >
                  <i className="fas fa-cog mr-2"></i>Settings
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
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-arrow-up mr-1"></i>+12% from last month
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-users text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Buses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeBuses}</p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-arrow-up mr-1"></i>+5% from last month
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-bus text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Routes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalRoutes}</p>
                    <p className="text-sm flex items-center gap-1" style={{ color: stats.totalRoutes > previousRoutesCount ? '#16a34a' : stats.totalRoutes < previousRoutesCount ? '#dc2626' : '#64748b' }}>
                      {(() => {
                        const diff = stats.totalRoutes - previousRoutesCount;
                        if (diff > 0) return <><i className="fas fa-arrow-up"></i>+{diff} Increased Routes</>;
                        if (diff < 0) return <><i className="fas fa-arrow-down"></i>{diff} Decreased Routes</>;
                        return <><i className="fas fa-minus"></i>No change</>;
                      })()}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-route text-purple-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{attendanceStats?.attendanceRate || 0}%</p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-clipboard-check mr-1"></i>
                      {attendanceStats?.present || 0} present today
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-clipboard-check text-orange-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* System Overview */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">System Overview</h2>
                    <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <i className="fas fa-chart-line text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-600">System Performance Chart</p>
                      <p className="text-sm text-gray-500">Real-time analytics would be displayed here</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-brand-medium-blue">98.5%</p>
                      <p className="text-sm text-gray-600">On-Time Performance</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">2.3M</p>
                      <p className="text-sm text-gray-600">Miles Driven</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">45K</p>
                      <p className="text-sm text-gray-600">Students Transported</p>
                    </div>
                  </div>

                  {/* Attendance Stats */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-2xl font-bold text-orange-600">{attendanceStats?.total || 0}</p>
                      <p className="text-sm text-gray-600">Total Records</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-2xl font-bold text-green-600">{attendanceStats?.present || 0}</p>
                      <p className="text-sm text-gray-600">Present</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-2xl font-bold text-red-600">{attendanceStats?.absent || 0}</p>
                      <p className="text-sm text-gray-600">Absent</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">{attendanceStats?.students || 0}</p>
                      <p className="text-sm text-gray-600">Students</p>
                    </div>
                  </div>
                </div>

                {/* User Management */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">User Management</h2>
                    <Link
                      to="/admin/users"
                      className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm hover:bg-opacity-90"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-brand-beige flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-brand-dark-blue">JD</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">John Doe</div>
                                <div className="text-sm text-gray-500">john.doe@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Driver
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-brand-medium-blue hover:text-brand-dark-blue mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Suspend</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-brand-beige flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-brand-dark-blue">SM</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">Sarah Miller</div>
                                <div className="text-sm text-gray-500">sarah.miller@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              Parent
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day ago</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-brand-medium-blue hover:text-brand-dark-blue mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Suspend</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Bus Management</h2>
                    <Link
                      to="/admin/buses"
                      className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm hover:bg-opacity-90"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    {busesLoading ? <div>Loading...</div> : busesError ? <div className="text-red-600">{busesError}</div> : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {buses.map((bus) => (
                            <tr key={bus._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{bus.BusNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{bus.capacity}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{bus.status}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{bus.assigned_driver_id || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{bus.route_id || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-brand-medium-blue hover:text-brand-dark-blue mr-3" onClick={() => { setEditingBus(bus); setShowEditBusModal(true); }}>Edit</button>
                                <button className="text-red-600 hover:text-red-900" onClick={async () => { 
                                  if (window.confirm('Are you sure you want to delete this bus?')) { 
                                    try {
                                      await dispatch(deleteBus(bus._id));
                                    } catch (err) {
                                      console.error("Bus deletion error:", err);
                                    }
                                  } 
                                }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Route Management</h2>
                    <Link
                      to="/admin/routes"
                      className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm hover:bg-opacity-90"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    {routesLoading ? <div>Loading...</div> : routesError ? <div className="text-red-600">{routesError}</div> : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stops Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {routes.map((route) => (
                            <tr key={route._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{route.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{route.start_point}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{route.end_point}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{route.stops?.length || 0}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{route.estimated_time}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-brand-medium-blue hover:text-brand-dark-blue mr-3" onClick={() => { setEditingRoute(route); setShowEditRouteModal(true); }}>Edit</button>
                                <button className="text-red-600 hover:text-red-900" onClick={async () => { 
                                  if (window.confirm('Are you sure you want to delete this route?')) { 
                                    try {
                                      await dispatch(deleteRoute(route._id));
                                    } catch (err) {
                                      console.error("Route deletion error:", err);
                                    }
                                  } 
                                }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  {/* Recent Activity */}
                  <div>
                    <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <i className={`fas ${activity.icon} ${activity.color} text-sm`}></i>
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link
                        to="/admin/activity"
                        className="text-sm text-brand-medium-blue hover:text-brand-dark-blue font-medium"
                      >
                        View all activity →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">System Health</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Healthy
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">API Services</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Healthy
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">GPS Tracking</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Warning
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Notifications</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Healthy
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowUserModal(true)}
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-user-plus text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Add New User</span>
                    </button>
                    <button
                      onClick={() => setShowBusModal(true)}
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-bus text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Add New Bus</span>
                    </button>
                    <button
                      onClick={() => setShowRouteModal(true)}
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-route text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Create Route</span>
                    </button>
                    <Link
                      to="/admin/driver-reports"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-id-badge text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Driver Reports</span>
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-chart-bar text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Generate Report</span>
                    </Link>
                    <Link
                      to="/admin/backup"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-download text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Backup System</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <DynamicModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={(data) => { setShowUserModal(false); console.log("User Data:", data); }}
        schema={userSchema}
        title="Add New User"
      />
      <DynamicModal
        isOpen={showBusModal}
        onClose={() => setShowBusModal(false)}
        onSubmit={(data) => { setShowBusModal(false); console.log("Bus Data:", data); }}
        schema={busSchema}
        title="Add New Bus"
      />
      <DynamicModal
        isOpen={showRouteModal}
        onClose={() => { setShowRouteModal(false); }}
        onSubmit={async (data) => {
          try {
            const payload = {
              name: data.name,
              start_point: data.start_point,
              end_point: data.end_point,
              stops: (typeof data.stops === 'string') ? data.stops.split(",").map(s => s.trim()).filter(Boolean) : [],
              estimated_time: data.estimated_time,
            };
            await dispatch(createRoute(payload));
            setShowRouteModal(false);
          } catch (err) {
            console.error("Route creation error:", err);
          }
        }}
        schema={routeSchema}
        title="Create Route"
      />
      <DynamicModal
        isOpen={showEditRouteModal}
        onClose={() => { setShowEditRouteModal(false); setEditingRoute(null); }}
        onSubmit={async (data) => {
          try {
            const payload = {
              name: data.name,
              start_point: data.start_point,
              end_point: data.end_point,
              stops: (typeof data.stops === 'string') ? data.stops.split(",").map(s => s.trim()).filter(Boolean) : [],
              estimated_time: data.estimated_time,
            };
            await dispatch(updateRoute({ id: editingRoute._id, routeData: payload }));
            setShowEditRouteModal(false);
            setEditingRoute(null);
          } catch (err) {
            console.error("Route update error:", err);
          }
        }}
        schema={routeSchema}
        title="Edit Route"
        initialData={editingRoute}
      />
      <DynamicModal
        isOpen={showEditBusModal}
        onClose={() => { setShowEditBusModal(false); setEditingBus(null); }}
        onSubmit={async (data) => {
          try {
            const payload = {
              BusNumber: data.BusNumber,
              capacity: data.capacity,
              status: data.status,
              assigned_driver_id: data.assigned_driver_id || null,
              route_id: data.route_id || null,
            };
            await dispatch(updateBus({ id: editingBus._id, busData: payload }));
            setShowEditBusModal(false);
            setEditingBus(null);
          } catch (err) {
            console.error("Bus update error:", err);
          }
        }}
        schema={busSchema}
        title="Edit Bus"
        initialData={editingBus}
      />
      {routeMsg && <div className="text-center text-sm mt-2 mb-4 font-bold" style={{color: routeMsg.includes('success') ? '#16a34a' : '#dc2626'}}>{routeMsg}</div>}
      {busMsg && <div className="text-center text-sm mt-2 mb-4 font-bold" style={{color: busMsg.includes('success') ? '#16a34a' : '#dc2626'}}>{busMsg}</div>}
    </div>
  )
}

export default AdminDashboard
