"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveTrackingMap from "../components/LiveTrackingMap"
import { useDispatch, useSelector } from "react-redux";
import { createAttendance, fetchUserAttendance, clearError, clearSuccess } from "../redux/attendanceSlice";
import Toast from "../components/Toast";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { userAttendances, loading, error, success } = useSelector(state => state.attendance);

  const [currentTrip, setCurrentTrip] = useState(null);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [location, setLocation] = useState({ lat: 24.7136, lng: 46.6753 }); // Riyadh coordinates
  const [passengers, setPassengers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    personId: '',
    personType: 'Employee',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    boardingTime: '',
    deboardingTime: ''
  });
  // --- Attendance for passengers ---
  const [passengerAttendance, setPassengerAttendance] = useState({}); // { [passengerId]: 'present' | 'absent' }
  const [routeStats, setRouteStats] = useState({}); // { [routeId]: { present: n, absent: n } }

  // Dummy data for demonstration
  const assignedRoutes = [
    {
      id: 1,
      name: "Route A - School Zone",
      startLocation: "Al Olaya District",
      endLocation: "King Fahd School",
      estimatedTime: "45 min",
      passengers: 12,
      status: "active",
      schedule: "07:30 AM - 08:15 AM"
    },
    {
      id: 2,
      name: "Route B - Residential Area",
      startLocation: "Al Malaz District",
      endLocation: "Al Riyadh School",
      estimatedTime: "35 min",
      passengers: 8,
      status: "pending",
      schedule: "02:30 PM - 03:05 PM"
    }
  ];

  const dummyPassengers = [
    { id: 1, name: "Ahmed Al-Rashid", grade: "5th Grade", pickupTime: "07:30 AM", status: "onboard" },
    { id: 2, name: "Fatima Al-Zahra", grade: "3rd Grade", pickupTime: "07:35 AM", status: "waiting" },
    { id: 3, name: "Omar Al-Sayed", grade: "6th Grade", pickupTime: "07:40 AM", status: "onboard" },
    { id: 4, name: "Aisha Al-Mansour", grade: "4th Grade", pickupTime: "07:45 AM", status: "waiting" }
  ];

  const dummyNotifications = [
    { id: 1, message: "New passenger added to Route A", time: "2 min ago", type: "info" },
    { id: 2, message: "Traffic alert: Delay expected on King Fahd Road", time: "5 min ago", type: "warning" },
    { id: 3, message: "Route B schedule updated", time: "10 min ago", type: "success" }
  ];

  useEffect(() => {
    setPassengers(dummyPassengers);
    setNotifications(dummyNotifications);
    // Set user ID for attendance
    if (user?._id) {
      setAttendanceData(prev => ({ ...prev, personId: user._id }));
      dispatch(fetchUserAttendance({ userId: user._id }));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [success, error, dispatch]);

  const startTrip = (routeId) => {
    const route = assignedRoutes.find(r => r.id === routeId);
    setCurrentTrip(route);
    setIsOnDuty(true);
    setSelectedRoute(route);
  };

  const endTrip = () => {
    setCurrentTrip(null);
    setIsOnDuty(false);
    setSelectedRoute(null);
  };

  const updateLocation = () => {
    // Simulate location update
    const newLat = location.lat + (Math.random() - 0.5) * 0.01;
    const newLng = location.lng + (Math.random() - 0.5) * 0.01;
    setLocation({ lat: newLat, lng: newLng });
  };

  const markPassengerBoarded = (passengerId) => {
    setPassengers(prev =>
      prev.map(p =>
        p.id === passengerId
          ? { ...p, status: 'onboard' }
          : p
      )
    );
  };

  const markPassengerDropped = (passengerId) => {
    setPassengers(prev =>
      prev.map(p =>
        p.id === passengerId
          ? { ...p, status: 'dropped' }
          : p
      )
    );
  };

  const getScheduleStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "current":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleDutyStatus = () => {
    setIsOnDuty(!isOnDuty);
  };

  // Attendance functions
  const handleLogAttendance = () => {
    setShowAttendanceModal(true);
  };

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    const submitData = {
      ...attendanceData,
      boardingTime: attendanceData.status === 'present' ? currentTime : '',
      deboardingTime: attendanceData.status === 'absent' ? currentTime : ''
    };

    dispatch(createAttendance(submitData));
    setShowAttendanceModal(false);
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return userAttendances.find(att =>
      new Date(att.date).toISOString().split('T')[0] === today
    );
  };

  const todayAttendance = getTodayAttendance();

  // Mock API for marking attendance
  const markAttendanceAPI = async ({ userId, role, routeId, status }) => {
    // Simulate API call
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
  };

  // Mark attendance for a passenger
  const handlePassengerAttendance = async (passengerId, routeId, status) => {
    await markAttendanceAPI({ userId: passengerId, role: 'passenger', routeId, status });
    setPassengerAttendance(prev => ({ ...prev, [passengerId]: status }));
    // Update stats
    setRouteStats(prev => {
      const stats = prev[routeId] || { present: 0, absent: 0 };
      const oldStatus = passengerAttendance[passengerId];
      let present = stats.present;
      let absent = stats.absent;
      if (oldStatus === 'present') present--;
      if (oldStatus === 'absent') absent--;
      if (status === 'present') present++;
      if (status === 'absent') absent++;
      return { ...prev, [routeId]: { present, absent } };
    });
  };

  // Mark attendance for driver
  const [driverAbsentRoutes, setDriverAbsentRoutes] = useState({}); // { [routeId]: true/false }

  const handleDriverAttendance = async (routeId, status) => {
    await markAttendanceAPI({ userId: user._id, role: 'driver', routeId, status });
    setAttendanceData(prev => ({ ...prev, status }));
    setDriverAbsentRoutes(prev => ({ ...prev, [routeId]: status === 'absent' }));
  };

  // Fetch live stats (mock)
  const fetchRouteStats = async (routeId) => {
    // Simulate API call
    return { present: Object.values(passengerAttendance).filter(s => s === 'present').length, absent: Object.values(passengerAttendance).filter(s => s === 'absent').length };
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-brand-medium-blue rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-bus text-white"></i>
              </div>
              <h1 className="text-xl font-bold text-brand-dark-blue">Driver Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${isOnDuty ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {isOnDuty ? 'On Duty' : 'Off Duty'}
                </span>
              </div>
              <Link
                to="/profile"
                className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <i className="fas fa-user text-gray-600"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-route text-brand-medium-blue text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Routes</p>
                <p className="text-2xl font-bold text-brand-dark-blue">
                  {assignedRoutes.filter(r => r.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-users text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Passengers</p>
                <p className="text-2xl font-bold text-brand-dark-blue">
                  {passengers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Time</p>
                <p className="text-2xl font-bold text-brand-dark-blue">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-bell text-purple-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-bold text-brand-dark-blue">
                  {notifications.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assigned Routes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-brand-dark-blue">Assigned Routes</h2>
                <p className="text-gray-600 text-sm">Manage your assigned routes and trips</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {assignedRoutes.map((route) => (
                    <div key={route.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-brand-dark-blue">{route.name}</h3>
                          <p className="text-sm text-gray-600">
                            {route.startLocation} → {route.endLocation}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${route.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {route.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Schedule</p>
                          <p className="text-sm font-medium">{route.schedule}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-sm font-medium">{route.estimatedTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Passengers</p>
                          <p className="text-sm font-medium">{route.passengers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="text-sm font-medium capitalize">{route.status}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        {currentTrip?.id === route.id ? (
                          <button
                            onClick={endTrip}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                          >
                            <i className="fas fa-stop mr-2"></i>
                            End Trip
                          </button>
                        ) : (
                          !driverAbsentRoutes[route.id] && (
                            <button
                              onClick={() => startTrip(route.id)}
                              disabled={currentTrip !== null}
                              className="flex-1 bg-brand-medium-blue hover:bg-brand-dark-blue text-white py-2 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <i className="fas fa-play mr-2"></i>
                              Start Trip
                            </button>
                          )
                        )}

                        <Link
                          to={`/map-view?route=${route.id}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors text-center"
                        >
                          <i className="fas fa-map mr-2"></i>
                          View Map
                        </Link>
                      </div>

                      {/* Driver Attendance for each route */}
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleDriverAttendance(route.id, 'present')}
                          className={`px-3 py-1 rounded text-xs font-medium ${attendanceData.status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          Mark Myself attendant
                        </button>
                        <button
                          onClick={() => handleDriverAttendance(route.id, 'absent')}
                          className={`px-3 py-1 rounded text-xs font-medium ${attendanceData.status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          Mark Myself Absent
                        </button>
                      </div>
                      {/* Live stats */}
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Live Attendance:</span>
                        <span className="ml-2 text-green-600">attendant: {routeStats[route.id]?.present || 0}</span>
                        <span className="ml-2 text-red-600">Absent: {routeStats[route.id]?.absent || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Trip Status */}
            {currentTrip && (
              <div className="bg-white rounded-lg shadow-md mt-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-brand-dark-blue">Current Trip</h2>
                  <p className="text-gray-600 text-sm">Active trip details and controls</p>
                </div>
                <div className="p-6">
                  <div className="bg-brand-beige rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-brand-dark-blue">{currentTrip.name}</h3>
                      <span className="text-sm text-green-600 font-medium">
                        <i className="fas fa-circle mr-1"></i>
                        In Progress
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Started at:</p>
                        <p className="font-medium">{new Date().toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location:</p>
                        <p className="font-medium">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={updateLocation}
                      className="flex-1 bg-brand-medium-blue hover:bg-brand-dark-blue text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      <i className="fas fa-location-arrow mr-2"></i>
                      Update Location
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                      <i className="fas fa-phone mr-2"></i>
                      Emergency Call
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Passenger List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-brand-dark-blue">Passenger List</h3>
                <p className="text-gray-600 text-xs">Manage passenger status</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {passengers.map((passenger) => (
                    <div key={passenger.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{passenger.name}</p>
                        <p className="text-xs text-gray-600">{passenger.grade} • {passenger.pickupTime}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePassengerAttendance(passenger.id, currentTrip?.id || assignedRoutes[0].id, 'present')}
                          className={`px-2 py-1 rounded text-xs font-medium ${passengerAttendance[passenger.id] === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          attendant
                        </button>
                        <button
                          onClick={() => handlePassengerAttendance(passenger.id, currentTrip?.id || assignedRoutes[0].id, 'absent')}
                          className={`px-2 py-1 rounded text-xs font-medium ${passengerAttendance[passenger.id] === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          Absent
                        </button>
                        {passengerAttendance[passenger.id] === 'present' && <span className="ml-2 text-green-600">✅</span>}
                        {passengerAttendance[passenger.id] === 'absent' && <span className="ml-2 text-red-600">❌</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-brand-dark-blue">Recent Notifications</h3>
                <p className="text-gray-600 text-xs">Latest updates and alerts</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`h-2 w-2 rounded-full mt-2 ${notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-sm text-brand-medium-blue hover:text-brand-dark-blue font-medium">
                  View All Notifications
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-brand-dark-blue">Quick Actions</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fas fa-file-alt text-brand-medium-blue mr-3"></i>
                    <span className="text-sm font-medium">Trip Report</span>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fas fa-tools text-brand-medium-blue mr-3"></i>
                    <span className="text-sm font-medium">Maintenance Request</span>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fas fa-calendar text-brand-medium-blue mr-3"></i>
                    <span className="text-sm font-medium">Schedule View</span>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fas fa-cog text-brand-medium-blue mr-3"></i>
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Log Attendance
              </h3>

              <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={attendanceData.date}
                    onChange={(e) => setAttendanceData({ ...attendanceData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={attendanceData.status}
                    onChange={(e) => setAttendanceData({ ...attendanceData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Logging...' : 'Log Attendance'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAttendanceModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Messages */}
      {error && <Toast message={error} type="error" />}
      {success && <Toast message={success} type="success" />}
    </div>
  );
};

export default DriverDashboard;
