"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import DynamicModal from "../components/DynamicModal"
import { userSchema, busSchema, routeSchema } from "../components/schemas"
import { fetchBuses, updateBus, deleteBus, clearMessage as clearBusMessage, createBus } from "../redux/busSlice"
import { fetchRoutes, createRoute, updateRoute, deleteRoute, clearMessage as clearRouteMessage } from "../redux/routesSlice"
import { fetchAllUsers, registerUser, updateUser, deleteUser } from "../redux/userSlice"
import dayjs from "dayjs"
import { fetchAttendanceStats } from "../redux/attendanceSlice"
import AdvancedLeafletMap from "../components/AdvancedLeafletMap";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  const dispatch = useDispatch();
  const attendanceStats = useSelector(state => state.attendance?.stats || {});
  const { buses, loading: busesLoading, error: busesError, message: busMsg } = useSelector((state) => state.buses || {});
  const { routes, loading: routesLoading, error: routesError, message: routeMsg } = useSelector((state) => state.routes || {});
  const { allUsers, loading: usersLoading } = useSelector((state) => state.user);
  
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
  const [editingUser, setEditingUser] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  // Bus creation form state
  const [busFormData, setBusFormData] = useState({
    BusNumber: '',
    capacity: '',
    status: 'active',
    assigned_driver_id: '',
    route_id: ''
  })

  const [routeFormData, setRouteFormData] = useState({
    name: '',
    start_point: '',
    end_point: '',
    estimated_time: '',
  });
  const [stops, setStops] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [showStartMapModal, setShowStartMapModal] = useState(false);
  const [showEndMapModal, setShowEndMapModal] = useState(false);
  const [tempLatLng, setTempLatLng] = useState(null);
  const [pointName, setPointName] = useState("");
  const [pointType, setPointType] = useState(null); // 'start' or 'end'

  const [trendData, setTrendData] = useState(null);

  useEffect(() => {
    axios.get('/api/dashboard/trends')
      .then(res => setTrendData(res.data))
      .catch(err => console.error('Trend API error:', err));
  }, []);

  const previousRoutesCount = routes?.filter(route => dayjs(route.createdAt).isBefore(dayjs().subtract(1, 'day'))).length ?? 0;

  // Get drivers from allUsers
  const drivers = allUsers?.filter(user => user.role === 'driver') || [];

  // اجمع البيانات الحقيقية من Redux
  const totalStudents = allUsers?.filter(u => u.role === 'student').length || 0;
  const totalParents = allUsers?.filter(u => u.role === 'parent').length || 0;
  const totalDrivers = allUsers?.filter(u => u.role === 'driver').length || 0;
  const totalBuses = buses?.length || 0;
  const totalRoutes = routes?.length || 0;
  const attendanceRate = attendanceStats?.attendanceRate || 0;

  // بيانات اليوم فقط (يمكنكِ لاحقًا عمل trend حسب الأيام)
  const labels = [new Date().toLocaleDateString()];

  const lineData = trendData ? {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: trendData.attendance,
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Students',
        data: trendData.students,
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Buses',
        data: trendData.buses,
        borderColor: '#f59e42',
        backgroundColor: '#f59e42',
        pointBackgroundColor: '#f59e42',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Routes',
        data: trendData.routes,
        borderColor: '#a21caf',
        backgroundColor: '#a21caf',
        pointBackgroundColor: '#a21caf',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Parents',
        data: trendData.parents,
        borderColor: '#eab308',
        backgroundColor: '#eab308',
        pointBackgroundColor: '#eab308',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Drivers',
        data: trendData.drivers,
        borderColor: '#0ea5e9',
        backgroundColor: '#0ea5e9',
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        pointStyle: 'circle',
      },
    ],
  } : null;

  const tooltipDescriptions = {
    'Attendance Rate (%)': value => `${value}% ${value >= 95 ? '(ممتاز)' : value >= 90 ? '(جيد جداً)' : value >= 80 ? '(جيد)' : '(يحتاج تحسين)'}`,
    'Students': value => `${value} طالب`,
    'Buses': value => `${value} حافلة`,
    'Routes': value => `${value} خط`,
    'Parents': value => `${value} ولي أمر`,
    'Drivers': value => `${value} سائق`
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { size: 13, family: 'inherit', weight: 'bold' }
        }
      },
      title: {
        display: true,
        text: 'System Overview',
        color: '#2563eb',
        font: { size: 20, weight: 'bold', family: 'inherit' },
        align: 'start',
        padding: { bottom: 10 }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#2563eb',
        bodyColor: '#222',
        borderColor: '#2563eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        displayColors: true,
        callbacks: {
          title: (items) => `Date: ${items[0].label}`,
          label: (ctx) => {
            const label = ctx.dataset.label;
            const value = ctx.parsed.y;
            if (tooltipDescriptions[label]) {
              return `${label}: ${tooltipDescriptions[label](value)}`;
            }
            return `${label}: ${value}`;
          }
        },
        titleFont: { weight: 'bold', family: 'inherit' },
        bodyFont: { family: 'inherit' },
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#2563eb',
          font: { family: 'inherit', weight: 'bold', size: 13 },
          padding: 6
        }
      },
      y: {
        grid: {
          color: 'rgba(37,99,235,0.08)',
          borderDash: [4, 4],
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: { family: 'inherit', size: 13 },
          padding: 6
        },
        beginAtZero: true
      }
    },
    animation: { duration: 900, easing: 'easeOutQuart' }
  };

  const chartRef = useRef();

  // Update stats when routes, buses, or users change
  useEffect(() => {
    setStats(prevStats => ({
      ...prevStats,
      totalUsers: allUsers?.length ?? 0,
      totalRoutes: routes?.length ?? 0,
      activeBuses: buses?.filter(bus => bus.status === 'active').length ?? 0,
    }))
  }, [routes, buses, allUsers])

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
    dispatch(fetchAllUsers());
    // Generate dynamic recent activity based on actual data
    const generateRecentActivity = () => {
      const activities = [];
      
      // Add user activities
      if (allUsers && allUsers.length > 0) {
        const recentUsers = allUsers.slice(0, 2);
        recentUsers.forEach((user, index) => {
          activities.push({
            id: `user_${index}`,
            type: "user_created",
            message: `New ${user.role} account created: ${user.firstName} ${user.lastName}`,
            time: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently",
            icon: "fa-user-plus",
            color: "text-green-600",
          });
        });
      }
      
      // Add bus activities
      if (buses && buses.length > 0) {
        const recentBuses = buses.slice(0, 2);
        recentBuses.forEach((bus, index) => {
          activities.push({
            id: `bus_${index}`,
            type: "bus_added",
            message: `Bus #${bus.BusNumber} added to system`,
            time: bus.createdAt ? new Date(bus.createdAt).toLocaleDateString() : "Recently",
            icon: "fa-bus",
            color: "text-blue-600",
          });
        });
      }
      
      // Add route activities
      if (routes && routes.length > 0) {
        const recentRoutes = routes.slice(0, 2);
        recentRoutes.forEach((route, index) => {
          activities.push({
            id: `route_${index}`,
            type: "route_created",
            message: `Route "${route.name}" created`,
            time: route.createdAt ? new Date(route.createdAt).toLocaleDateString() : "Recently",
            icon: "fa-route",
            color: "text-purple-600",
          });
        });
      }
      
      // Add system health activities
      activities.push({
        id: "system_health",
        type: "system_alert",
        message: `System running with ${stats.totalUsers} users, ${stats.activeBuses} active buses`,
        time: "Live",
        icon: "fa-heartbeat",
        color: "text-green-600",
      });
      
      return activities.slice(0, 5); // Limit to 5 activities
    };
    
    setRecentActivity(generateRecentActivity());
  }, [dispatch])

  // Update recent activity when data changes
  useEffect(() => {
    const generateRecentActivity = () => {
      const activities = [];
      
      // Add user activities
      if (allUsers && allUsers.length > 0) {
        const recentUsers = allUsers.slice(0, 2);
        recentUsers.forEach((user, index) => {
          activities.push({
            id: `user_${index}`,
            type: "user_created",
            message: `New ${user.role} account created: ${user.firstName} ${user.lastName}`,
            time: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently",
            icon: "fa-user-plus",
            color: "text-green-600",
          });
        });
      }
      
      // Add bus activities
      if (buses && buses.length > 0) {
        const recentBuses = buses.slice(0, 2);
        recentBuses.forEach((bus, index) => {
          activities.push({
            id: `bus_${index}`,
            type: "bus_added",
            message: `Bus #${bus.BusNumber} added to system`,
            time: bus.createdAt ? new Date(bus.createdAt).toLocaleDateString() : "Recently",
            icon: "fa-bus",
            color: "text-blue-600",
          });
        });
      }
      
      // Add route activities
      if (routes && routes.length > 0) {
        const recentRoutes = routes.slice(0, 2);
        recentRoutes.forEach((route, index) => {
          activities.push({
            id: `route_${index}`,
            type: "route_created",
            message: `Route "${route.name}" created`,
            time: route.createdAt ? new Date(route.createdAt).toLocaleDateString() : "Recently",
            icon: "fa-route",
            color: "text-purple-600",
          });
        });
      }
      
      // Add system health activities
      activities.push({
        id: "system_health",
        type: "system_alert",
        message: `System running with ${stats.totalUsers} users, ${stats.activeBuses} active buses`,
        time: "Live",
        icon: "fa-heartbeat",
        color: "text-green-600",
      });
      
      return activities.slice(0, 5); // Limit to 5 activities
    };
    
    setRecentActivity(generateRecentActivity());
  }, [allUsers, buses, routes, stats.totalUsers, stats.activeBuses])

  // استخدم فقط:
  // - totalStudents, totalParents, totalDrivers, totalBuses, totalRoutes, attendanceRate
  // - labels
  // - lineData
  // - lineOptions
  // - chartRef
  const totalStudentsTrend = allUsers?.filter(u => u.role === 'student').length || 0;
  const totalParentsTrend = allUsers?.filter(u => u.role === 'parent').length || 0;
  const totalDriversTrend = allUsers?.filter(u => u.role === 'driver').length || 0;
  const totalBusesTrend = buses?.length || 0;
  const totalRoutesTrend = routes?.length || 0;
  const attendanceRateTrend = attendanceStats?.attendanceRate || 0;

  // بيانات اليوم فقط (يمكنكِ لاحقًا عمل trend حسب الأيام)
  const labelsTrend = [new Date().toLocaleDateString()];

  const attendanceTrend = [attendanceRateTrend];
  const studentsTrend   = [totalStudentsTrend];
  const busesTrend      = [totalBusesTrend];
  const routesTrend     = [totalRoutesTrend];
  const parentsTrend    = [totalParentsTrend];
  const driversTrend    = [totalDriversTrend];

  const lineDataTrend = {
    labels,
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: attendanceTrend,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37,99,235,0.08)',
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgb(37, 99, 235)',
        pointRadius: 0,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.5,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Students',
        data: studentsTrend,
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245,158,66,0.08)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#f59e42',
        pointRadius: 0,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.5,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Buses',
        data: busesTrend,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,0.08)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#16a34a',
        pointRadius: 0,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.5,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Routes',
        data: routesTrend,
        borderColor: '#a21caf',
        backgroundColor: 'rgba(162,28,175,0.08)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#a21caf',
        pointRadius: 0,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.5,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Parents',
        data: parentsTrend,
        borderColor: '#eab308',
        backgroundColor: 'rgba(234,179,8,0.08)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#eab308',
        pointRadius: 0,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.5,
        fill: false,
        pointStyle: 'circle',
      },
      {
        label: 'Drivers',
        data: driversTrend,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.08)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#0ea5e9',
        pointRadius: 0,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.5,
        fill: false,
        pointStyle: 'circle',
      },
    ],
  };

  const lineOptionsTrend = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Attendance Rate (Last 7 Days)',
        color: '#2563eb',
        font: { size: 18, weight: 'bold', family: 'inherit' },
        align: 'start',
        padding: { bottom: 16 }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#2563eb',
        bodyColor: '#222',
        borderColor: '#2563eb',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) => `📈 Attendance: ${ctx.parsed.y}%`
        },
        titleFont: { weight: 'bold', family: 'inherit' },
        bodyFont: { family: 'inherit' },
      }
    },
    layout: {
      padding: { left: 0, right: 0, top: 0, bottom: 0 }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#2563eb',
          font: { family: 'inherit', weight: 'bold' },
          padding: 6
        }
      },
      y: {
        grid: {
          color: 'rgba(37,99,235,0.08)',
          borderDash: [4, 4],
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: { family: 'inherit' },
          padding: 6
        },
        min: 80,
        max: 100,
        border: { display: false }
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    }
  };

  const chartRefTrend = useRef();

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
                    <p className="text-3xl font-bold text-gray-900">
                      {allUsers?.length?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-arrow-up mr-1"></i>{allUsers?.length || 0} total users
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
                      <i className="fas fa-arrow-up mr-1"></i>{buses?.filter(bus => bus.status === 'active').length || 0} active buses
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
                  <div className="h-80 bg-white rounded-xl flex items-center justify-center mb-6 shadow border border-blue-100">
                    {lineData ? (
                      <Line data={lineData} options={lineOptions} />
                    ) : (
                      <span className="text-gray-400">Loading chart data...</span>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-brand-medium-blue">{attendanceStats?.attendanceRate || 0}%</p>
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{routes?.length || 0}</p>
                      <p className="text-sm text-gray-600">Total Routes</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{buses?.length || 0}</p>
                      <p className="text-sm text-gray-600">Total Buses</p>
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
                    {usersLoading ? (
                      <div>Loading...</div>
                    ) : allUsers && allUsers.length > 0 ? (
                      <>
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
                            {allUsers.slice(0, 5).map((user) => (
                              <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-brand-beige flex items-center justify-center mr-3">
                                      <span className="text-sm font-medium text-brand-dark-blue">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                      </span>
                              </div>
                              <div>
                                      <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                      <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button className="text-brand-medium-blue hover:text-brand-dark-blue mr-3" onClick={() => { setEditingUser(user); setShowEditUserModal(true); }}>Edit</button>
                                  <button className="text-red-600 hover:text-red-900" onClick={async () => {
                                    if(window.confirm('هل أنت متأكد أنك تريد حذف هذا المستخدم؟')) {
                                      await dispatch(deleteUser(user._id));
                                      dispatch(fetchAllUsers());
                                    }
                                  }}>Delete</button>
                          </td>
                        </tr>
                            ))}
                      </tbody>
                    </table>
                      </>
                    ) : (
                      <div>No users found.</div>
                    )}
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
                          {Array.isArray(buses) && buses.slice(0, 5).map((bus) => (
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
                          {Array.isArray(routes) && routes.map((route) => (
                            <tr key={route._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{route.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{route.start_point?.name || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{route.end_point?.name || '-'}</td>
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
                      <span className="text-sm text-gray-600">Users Data</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${usersLoading ? 'bg-yellow-100 text-yellow-800' : allUsers && allUsers.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {usersLoading ? 'Loading...' : allUsers && allUsers.length > 0 ? 'Healthy' : 'No Data'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Buses Data</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${busesLoading ? 'bg-yellow-100 text-yellow-800' : buses && buses.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {busesLoading ? 'Loading...' : buses && buses.length > 0 ? 'Healthy' : 'No Data'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Routes Data</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${routesLoading ? 'bg-yellow-100 text-yellow-800' : routes && routes.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {routesLoading ? 'Loading...' : routes && routes.length > 0 ? 'Healthy' : 'No Data'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Attendance Data</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${attendanceStats && attendanceStats.total > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {attendanceStats && attendanceStats.total > 0 ? 'Healthy' : 'No Data'}
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
        onSubmit={async (data) => {
          try {
            await dispatch(registerUser(data));
            setShowUserModal(false);
            dispatch(fetchAllUsers());
          } catch (err) {
            alert('حدث خطأ أثناء إضافة المستخدم');
          }
        }}
        schema={userSchema}
        title="Add New User"
      />
      
      {/* Custom Bus Modal with Dropdowns */}
      {showBusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Bus</h2>
              <button
                onClick={() => setShowBusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const payload = {
                  BusNumber: busFormData.BusNumber,
                  capacity: parseInt(busFormData.capacity),
                  status: busFormData.status,
                  assigned_driver_id: busFormData.assigned_driver_id || null,
                  route_id: busFormData.route_id || null,
                };
                console.log("Payload being sent:", payload);
                const result = await dispatch(createBus(payload));
                console.log("Create bus result:", result);
                if (!result.error) {
                  setShowBusModal(false);
                  setBusFormData({
                    BusNumber: '',
                    capacity: '',
                    status: 'active',
                    assigned_driver_id: '',
                    route_id: ''
                  });
                }
              } catch (err) {
                console.error("Bus creation error:", err);
                alert("Error creating bus: " + (err.message || "Unknown error"));
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={busFormData.BusNumber}
                    onChange={(e) => setBusFormData(prev => ({ ...prev, BusNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter bus number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={busFormData.capacity}
                    onChange={(e) => setBusFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter capacity"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={busFormData.status}
                    onChange={(e) => setBusFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Driver
                  </label>
                  <select
                    value={busFormData.assigned_driver_id}
                    onChange={(e) => setBusFormData(prev => ({ ...prev, assigned_driver_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a driver (optional)</option>
                    {drivers.map(driver => (
                      <option key={driver._id} value={driver._id}>
                        {driver.firstName} {driver.lastName} - {driver.licenseNumber || 'No License'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Route
                  </label>
                  <select
                    value={busFormData.route_id}
                    onChange={(e) => setBusFormData(prev => ({ ...prev, route_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a route (optional)</option>
                    {routes.map(route => (
                      <option key={route._id} value={route._id}>
                        {route.name} - {route.start_point} to {route.end_point}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBusModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Create Route Modal */}
      <DynamicModal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        onSubmit={async (data) => {
          try {
            await dispatch(createRoute({
              ...data,
              start_point: startPoint,
              end_point: endPoint,
              stops
            }));
            setShowRouteModal(false);
            setRouteFormData({ name: '', start_point: '', end_point: '', estimated_time: '' });
            setStops([]);
            setStartPoint(null);
            setEndPoint(null);
            dispatch(fetchRoutes());
          } catch (err) {
            alert('حدث خطأ أثناء إضافة الطريق');
          }
        }}
        schema={{
          name: { type: 'text', label: 'Route Name', required: true },
          estimated_time: { type: 'text', label: 'Estimated Time', required: true },
        }}
        title="Create Route"
      >
        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"
              onClick={() => { setShowStartMapModal(true); setPointType('start'); }}
            >
              <i className="fas fa-map-marker-alt"></i> اختر نقطة البداية على الخريطة
            </button>
            {startPoint && (
              <span className="ml-2 text-sm text-green-700 font-bold flex items-center gap-2">
                <i className="fas fa-check-circle text-green-500"></i>
                {startPoint.name} ({startPoint.lat.toFixed(5)}, {startPoint.long.toFixed(5)})
                <button className="ml-2 text-red-600 hover:underline" onClick={() => setStartPoint(null)}>حذف</button>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"
              onClick={() => { setShowEndMapModal(true); setPointType('end'); }}
            >
              <i className="fas fa-map-marker-alt"></i> اختر نقطة النهاية على الخريطة
            </button>
            {endPoint && (
              <span className="ml-2 text-sm text-blue-700 font-bold flex items-center gap-2">
                <i className="fas fa-check-circle text-blue-500"></i>
                {endPoint.name} ({endPoint.lat.toFixed(5)}, {endPoint.long.toFixed(5)})
                <button className="ml-2 text-red-600 hover:underline" onClick={() => setEndPoint(null)}>حذف</button>
              </span>
            )}
          </div>
          <div>
            <button
              type="button"
              className="px-3 py-2 bg-brand-medium-blue text-white rounded-md hover:bg-opacity-90"
              onClick={() => setShowMapModal(true)}
            >
              إضافة محطة على الخريطة
            </button>
            <ul className="mt-2">
              {stops.map((stop, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-brand-medium-blue"></i>
                  {stop.name} ({stop.lat.toFixed(5)}, {stop.long.toFixed(5)})
                  <button className="ml-2 text-red-600 hover:underline" onClick={() => setStops(stops.filter((_, i) => i !== idx))}>حذف</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* مودال اختيار نقطة البداية أو النهاية */}
        {(showStartMapModal || showEndMapModal) && (
          <DynamicModal
            isOpen={showStartMapModal || showEndMapModal}
            onClose={() => { setShowStartMapModal(false); setShowEndMapModal(false); setTempLatLng(null); setPointName(""); }}
            title={pointType === 'start' ? "اختر نقطة البداية على الخريطة" : "اختر نقطة النهاية على الخريطة"}
            schema={{}}
          >
            <AdvancedLeafletMap
              height="400px"
              showControls={false}
              onMapClick={({ lat, lng }) => setTempLatLng({ lat, lng })}
              stops={pointType === 'start' && startPoint ? [startPoint] : pointType === 'end' && endPoint ? [endPoint] : []}
            />
            {tempLatLng && (
              <div className="mt-4 p-4 bg-gray-50 rounded shadow flex flex-col gap-2">
                <label className="font-bold text-sm">اسم النقطة:</label>
                <input
                  type="text"
                  value={pointName}
                  onChange={e => setPointName(e.target.value)}
                  className="border rounded px-2 py-1"
                  placeholder="ادخل اسم النقطة"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => {
                      if (pointName) {
                        if (pointType === 'start') setStartPoint({ name: pointName, lat: tempLatLng.lat, long: tempLatLng.lng });
                        if (pointType === 'end') setEndPoint({ name: pointName, lat: tempLatLng.lat, long: tempLatLng.lng });
                        setShowStartMapModal(false);
                        setShowEndMapModal(false);
                        setTempLatLng(null);
                        setPointName("");
                      }
                    }}
                    disabled={!pointName}
                  >
                    حفظ النقطة
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                    onClick={() => { setTempLatLng(null); setPointName(""); }}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </DynamicModal>
        )}
        {/* مودال إضافة محطة */}
        {showMapModal && (
          <DynamicModal isOpen={showMapModal} onClose={() => setShowMapModal(false)} title="اختر موقع المحطة على الخريطة" schema={{}}>
            <AdvancedLeafletMap
              height="400px"
              showControls={false}
              onMapClick={({ lat, lng }) => {
                setTempLatLng({ lat, lng });
                setPointType('stop');
              }}
              stops={stops}
            />
            {tempLatLng && pointType === 'stop' && (
              <div className="mt-4 p-4 bg-gray-50 rounded shadow flex flex-col gap-2">
                <label className="font-bold text-sm">اسم المحطة:</label>
                <input
                  type="text"
                  value={pointName}
                  onChange={e => setPointName(e.target.value)}
                  className="border rounded px-2 py-1"
                  placeholder="ادخل اسم المحطة"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-brand-medium-blue text-white rounded"
                    onClick={() => {
                      if (pointName) {
                        setStops([...stops, { name: pointName, lat: tempLatLng.lat, long: tempLatLng.lng }]);
                        setShowMapModal(false);
                        setTempLatLng(null);
                        setPointName("");
                      }
                    }}
                    disabled={!pointName}
                  >
                    حفظ المحطة
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                    onClick={() => { setTempLatLng(null); setPointName(""); }}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </DynamicModal>
        )}
      </DynamicModal>
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
      <DynamicModal
        isOpen={showEditUserModal}
        onClose={() => { setShowEditUserModal(false); setEditingUser(null); }}
        onSubmit={async (data) => {
          try {
            await dispatch(updateUser({ id: editingUser._id, userData: data }));
            setShowEditUserModal(false);
            setEditingUser(null);
            dispatch(fetchAllUsers());
          } catch (err) {
            alert('حدث خطأ أثناء تعديل المستخدم');
          }
        }}
        schema={userSchema}
        title="Edit User"
        initialData={editingUser}
      />
      {routeMsg && <div className="text-center text-sm mt-2 mb-4 font-bold" style={{color: routeMsg.includes('success') ? '#16a34a' : '#dc2626'}}>{routeMsg}</div>}
      {busMsg && <div className="text-center text-sm mt-2 mb-4 font-bold" style={{color: busMsg.includes('success') ? '#16a34a' : '#dc2626'}}>{busMsg}</div>}
    </div>
  )
}

export default AdminDashboard
