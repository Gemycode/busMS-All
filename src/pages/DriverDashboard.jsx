"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveTrackingMap from "../components/LiveTrackingMap"
import { useDispatch, useSelector } from "react-redux";
import { createAttendance, fetchUserAttendance, clearError, clearSuccess } from "../redux/attendanceSlice";
import { fetchTrips } from '../redux/tripsSlice';
import { fetchBookings } from '../redux/bookingSlice';
import Toast from "../components/Toast";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { userAttendances, loading, error, success } = useSelector(state => state.attendance);
  const { trips, loading: tripsLoading, error: tripsError } = useSelector(state => state.trips);
  const { bookings, loading: bookingsLoading, error: bookingsError } = useSelector(state => state.bookings);

  const [currentTrip, setCurrentTrip] = useState(null);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [location, setLocation] = useState({ lat: 24.7136, lng: 46.6753 }); // Riyadh coordinates
  const [passengers, setPassengers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
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


  const dummyNotifications = [
    { id: 1, message: "New passenger added to Route A", time: "2 min ago", type: "info" },
    { id: 2, message: "Traffic alert: Delay expected on King Fahd Road", time: "5 min ago", type: "warning" },
    { id: 3, message: "Route B schedule updated", time: "10 min ago", type: "success" }
  ];

  useEffect(() => {
    dispatch(fetchBookings());
    if (user?._id) {
      dispatch(fetchTrips({ driverId: user._id }));
      setAttendanceData(prev => ({ ...prev, personId: user._id }));
      dispatch(fetchUserAttendance({ userId: user._id }));
    }
    setNotifications(dummyNotifications);
  }, [dispatch, user]);



  useEffect(() => {
    if (selectedTrip) {
      // Assuming you have a way to fetch bookings for a route
      // This part might need adjustment based on your bookings slice
      const routePassengers = bookings
        .filter(booking => booking.routeId?._id === selectedTrip.routeId?._id)
        .map(booking => booking.studentId)
        .filter(Boolean);
      setPassengers(routePassengers);
    } else {
      setPassengers([]);
    }
  }, [selectedTrip, bookings]);

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [success, error, dispatch]);

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setCurrentTrip(trip); // You might want to set the full trip object as the current trip
    setIsOnDuty(trip.status === 'in-progress'); // Set duty status based on trip status
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
              <h1 className="text-xl font-bold text-brand-dark-blue">Welcome, {user ? `${user.firstName} ${user.lastName}` : 'Driver'}</h1>
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
                <p className="text-sm font-medium text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-brand-dark-blue">
                  {trips.filter(t => t.status !== 'completed').length}
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
          {/* Assigned Trips */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-brand-dark-blue">Assigned Trips</h3>
                <p className="text-sm text-gray-600">Manage your assigned trips for today</p>
              </div>
              <div className="p-6">
                <div className="mt-4 space-y-3">
                  {tripsLoading ? (
                    <p>Loading trips...</p>
                  ) : tripsError ? (
                    <p className="text-red-500">Error loading trips.</p>
                  ) : trips.length > 0 ? (
                    trips.map((trip) => (
                      <div
                        key={trip._id}
                        onClick={() => handleTripSelect(trip)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedTrip?._id === trip._id ? 'bg-brand-medium-blue text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-bold">{trip.routeId?.name}</p>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${trip.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                            {trip.status}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{new Date(trip.date).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <i className="fas fa-route text-4xl text-gray-300 mb-3"></i>
                      <p className="font-medium text-gray-600">No trips assigned for today.</p>
                      <p className="text-sm text-gray-500">Contact your administrator for assignments.</p>
                    </div>
                  )}
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
                  {selectedTrip ? (
                    passengers.length > 0 ? (
                      passengers.map((passenger) => (
                        <div key={passenger._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{passenger.firstName} {passenger.lastName}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No passengers for this trip's route.</p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500">Select a trip to view passengers.</p>
                  )}
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
