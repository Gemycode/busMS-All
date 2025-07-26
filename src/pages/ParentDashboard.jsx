"use client"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildren, addChild } from '../redux/userSlice';
import api from '../redux/api';
import Toast from '../components/Toast';

const ParentDashboard = () => {
  const dispatch = useDispatch();
  const {
    children,
    childrenLoading,
    childrenError,
    addChildLoading,
    addChildError,
    addChildSuccess,
    user
  } = useSelector((state) => state.user);

  // Add Child Form State
  const [childForm, setChildForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  // Fetch children on mount
  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  // Reset form and refresh children after successful add
  useEffect(() => {
    if (addChildSuccess) {
      setChildForm({ firstName: '', lastName: '', email: '', password: '' });
      dispatch(fetchChildren());
    }
  }, [addChildSuccess, dispatch]);

  // Auto-hide success/error messages after 3 seconds
  useEffect(() => {
    let timer;
    if (addChildSuccess || addChildError) {
      timer = setTimeout(() => {
        // Optionally, you could dispatch an action to reset addChildSuccess/addChildError in Redux
        // For now, just let the message disappear from the UI by local state
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [addChildSuccess, addChildError]);

  // Handlers
  const handleInputChange = (e) => {
    setChildForm({ ...childForm, [e.target.name]: e.target.value });
  };

  const handleAddChild = (e) => {
    e.preventDefault();
    dispatch(addChild(childForm));
  };

  const [parent, setParent] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1234567890',
    childrenCount: 2
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'arrival',
      message: 'Emma has arrived at school safely',
      time: '2 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'boarding',
      message: 'Michael has boarded the bus',
      time: '15 minutes ago',
      isRead: true
    },
    {
      id: 3,
      type: 'delay',
      message: 'Route A is running 5 minutes late',
      time: '1 hour ago',
      isRead: true
    }
  ]);

  const [attendanceToast, setAttendanceToast] = useState({ show: false, type: 'success', message: '' });
  const [quickBookModal, setQuickBookModal] = useState(false);
  const [quickBookForm, setQuickBookForm] = useState({
    childId: '',
    date: '',
    tripType: 'morning', // morning or afternoon
    pickupStop: '' // new field for pickup stop
  });
  const [availableTrips, setAvailableTrips] = useState([]);
  const [availableStops, setAvailableStops] = useState([]); // new state for stops
  const [quickBookLoading, setQuickBookLoading] = useState(false);

  // Fetch available trips and stops when child/date/tripType changes
  useEffect(() => {
    const fetchTripsAndStops = async () => {
      if (quickBookForm.childId && quickBookForm.date && quickBookForm.tripType) {
        try {
          const res = await api.get('/bookings/available-buses', {
            params: { date: quickBookForm.date }
          });
          setAvailableTrips(res.data || []);
          // Extract stops from the first available trip's route
          if (res.data && res.data.length > 0 && res.data[0].route && Array.isArray(res.data[0].route.stops)) {
            setAvailableStops(res.data[0].route.stops);
          } else {
            setAvailableStops([]);
          }
        } catch (err) {
          setAvailableTrips([]);
          setAvailableStops([]);
        }
      } else {
        setAvailableTrips([]);
        setAvailableStops([]);
      }
    };
    fetchTripsAndStops();
  }, [quickBookForm.childId, quickBookForm.date, quickBookForm.tripType]);

  const markAbsent = async (childId) => {
    try {
      await api.post('/attendance', {
        personId: childId,
        personType: 'student',
        date: new Date(),
        status: 'absent',
      });
      setAttendanceToast({ show: true, type: 'success', message: 'تم تسجيل غياب الطفل بنجاح.' });
    } catch (err) {
      setAttendanceToast({ show: true, type: 'error', message: 'حدث خطأ أثناء تسجيل الغياب.' });
    }
  };

  // Quick Book functionality
  const handleQuickBook = async () => {
    if (!quickBookForm.childId || !quickBookForm.date || !quickBookForm.pickupStop) {
      setAttendanceToast({ show: true, type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    setQuickBookLoading(true);
    try {
      // Use the first available trip for now
      const firstOption = availableTrips[0];
      const bookingData = {
        studentId: quickBookForm.childId,
        busId: firstOption.busId,
        routeId: firstOption.routeId,
        date: quickBookForm.date,
        tripType: quickBookForm.tripType,
        pickupLocation: quickBookForm.pickupStop, // use selected pickup stop
        dropoffLocation: firstOption.route?.end_point
      };
      await api.post('/bookings/create', bookingData);
      setAttendanceToast({ show: true, type: 'success', message: 'Trip booked successfully!' });
      setQuickBookModal(false);
      setQuickBookForm({ childId: '', date: '', tripType: 'morning', pickupStop: '' });
      fetchBookings();
    } catch (err) {
      setAttendanceToast({ show: true, type: 'error', message: 'Failed to book trip. Please try again.' });
    } finally {
      setQuickBookLoading(false);
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const res = await api.get('/bookings/parent');
      // Map backend data to UI format
      const bookings = (res.data || []).map((b) => ({
        id: b._id,
        childName: b.studentId?.firstName && b.studentId?.lastName ? `${b.studentId.firstName} ${b.studentId.lastName}` : 'N/A',
        route: b.routeId?.name || 'N/A',
        date: b.date ? new Date(b.date).toLocaleDateString() : 'N/A',
        time: b.date ? new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        status: b.status || 'confirmed',
        busNumber: b.busId?.BusNumber || 'N/A',
      }));
      setRecentBookings(bookings);
    } catch (err) {
      setBookingsError('Failed to load bookings');
      setRecentBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="pt-0 pb-16">
        {/* Dashboard Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                {/* يمكنك إضافة زر رجوع هنا إذا أردت */}
                <h1 className="text-xl font-bold text-brand-dark-blue">Parent Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/children"
                  className="px-3 py-1 bg-brand-beige text-brand-dark-blue font-bold rounded-md shadow hover:bg-opacity-90 transition-all duration-200 text-base border-2 border-brand-beige hover:border-brand-dark-blue"
                >
                  <i className="fas fa-child mr-2"></i>Manage Children
                </Link>
                <Link
                  to="/notifications"
                  className="px-3 py-1 bg-brand-medium-blue hover:bg-brand-dark-blue text-white font-bold rounded-md shadow transition-all duration-200 text-base border-2 border-brand-medium-blue hover:border-brand-dark-blue"
                >
                  <i className="fas fa-bell mr-2"></i>Notifications
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Add Child Form */}
            <div className="mb-12 max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-brand-light-blue">
              <h2 className="text-2xl font-bold text-brand-dark-blue mb-6 tracking-wide border-b pb-2">Add a Child</h2>
              <form onSubmit={handleAddChild} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={childForm.firstName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-dark-blue"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={childForm.lastName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-dark-blue"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={childForm.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-dark-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={childForm.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-dark-blue"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-brand-dark-blue text-white font-bold rounded-md hover:bg-brand-medium-blue transition-all duration-200 shadow-lg"
                  disabled={addChildLoading}
                >
                  {addChildLoading ? 'Adding...' : 'Add Child'}
                </button>
                {addChildError && <p className="text-red-600 text-sm mt-2">{addChildError}</p>}
                {addChildSuccess && <p className="text-green-600 text-sm mt-2">Child added successfully!</p>}
              </form>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-brand-light-blue my-12"></div>

            {/* Key Metrics */}
            <h2 className="text-xl font-bold text-brand-dark-blue mb-6 tracking-wide">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Children</p>
                    <p className="text-3xl font-bold text-gray-900">{(Array.isArray(children) ? children.length : 0)}</p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-check mr-1"></i>All safe
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-child text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Trips</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(Array.isArray(children) ? children.filter(c => c.status === 'on_bus').length : 0)}
                    </p>
                    <p className="text-sm text-orange-600">
                      <i className="fas fa-bus mr-1"></i>On the way
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-bus text-orange-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">At School</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(Array.isArray(children) ? children.filter(c => c.status === 'at_school').length : 0)}
                    </p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-school mr-1"></i>Safe arrival
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-school text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Unread Alerts</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0)}
                    </p>
                    <p className="text-sm text-red-600">
                      <i className="fas fa-exclamation-triangle mr-1"></i>New updates
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-bell text-red-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-brand-light-blue my-12"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Children Status */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-light-blue mb-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-brand-dark-blue tracking-wide">Children Status</h2>
                </div>
                {childrenLoading ? (
                  <p>Loading children...</p>
                ) : childrenError ? (
                  <p className="text-red-600">{childrenError}</p>
                ) : (Array.isArray(children) ? children : []).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-child text-4xl mb-2"></i>
                  <p className="mt-2">You have not added any children yet.</p>
                  <p className="text-sm">Use the form above to register your first child.</p>
                </div>
                ) : (
                  <div className="space-y-4">
                    {(Array.isArray(children) ? children : []).map((child) => (
                      <div key={child._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Link to={`/child/${child._id}`} className="font-semibold text-gray-900 hover:text-brand-dark-blue underline">
                                {child.firstName} {child.lastName}
                              </Link>
                            </div>
                            <p className="text-sm text-gray-600">
                              <i className="fas fa-id-card mr-1"></i>
                              {child.email || 'No email'}
                            </p>
                           {child.grade && (
                             <p className="text-sm text-gray-500">
                               <i className="fas fa-graduation-cap mr-1"></i>
                               Grade: {child.grade}
                             </p>
                           )}
                           {child.status && (
                             <p className="text-sm text-gray-500">
                               <i className="fas fa-info-circle mr-1"></i>
                               Status: {child.status}
                             </p>
                           )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-light-blue">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-brand-dark-blue tracking-wide">Recent Bookings</h2>
                  <Link
                    to="/bookings"
                    className="text-brand-medium-blue hover:text-brand-dark-blue text-base font-bold"
                  >
                    View All →
                  </Link>
                </div>
                {bookingsLoading ? (
                  <div className="text-center text-gray-500 py-8">Loading bookings...</div>
                ) : bookingsError ? (
                  <div className="text-center text-red-500 py-8">{bookingsError}</div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No bookings found.</div>
                ) : (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.childName}</h3>
                          <p className="text-sm text-gray-600">
                            <i className="fas fa-route mr-1"></i>
                            {booking.route}
                          </p>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-calendar mr-1"></i>
                            {booking.date} at {booking.time}
                          </p>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-bus mr-1"></i>
                            Bus: {booking.busNumber}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <i className={`fas ${booking.status === 'confirmed' ? 'fa-check' : 'fa-check-circle'} mr-1`}></i>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-brand-light-blue my-12"></div>

            {/* Notifications */}
            <h2 className="text-xl font-bold text-brand-dark-blue mb-6 tracking-wide">Recent Notifications</h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-light-blue">
              <div className="space-y-4">
                  {(Array.isArray(notifications) ? notifications : []).slice(0, 3).map((notification) => (
                    <div key={notification.id} className={`flex items-start p-3 rounded-lg ${
                      notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                    }`}>
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        notification.type === 'arrival' ? 'bg-green-100' :
                        notification.type === 'boarding' ? 'bg-blue-100' :
                        'bg-orange-100'
                      }`}>
                        <i className={`fas ${
                          notification.type === 'arrival' ? 'fa-check text-green-600' :
                          notification.type === 'boarding' ? 'fa-bus text-blue-600' :
                          'fa-exclamation-triangle text-orange-600'
                        } text-sm`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-brand-light-blue my-12"></div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-brand-dark-blue mb-6 tracking-wide">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Link
                  to="/children/add"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-brand-medium-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-dark-blue transition-colors duration-200">
                    <i className="fas fa-child text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Add Child</h3>
                  <p className="text-sm text-gray-600">Register new child</p>
                </Link>

                <button
                  onClick={() => setQuickBookModal(true)}
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors duration-200">
                    <i className="fas fa-ticket-alt text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Book</h3>
                  <p className="text-sm text-gray-600">Fast trip booking</p>
                </button>

                <Link
                  to="/map-view"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group relative"
                >
                  <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors duration-200">
                    <i className="fas fa-map-marker-alt text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Live Tracking</h3>
                  <p className="text-sm text-gray-600">Track children's buses</p>
                  {(Array.isArray(children) ? children.filter(c => c.status === 'on_bus').length : 0) > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {(Array.isArray(children) ? children.filter(c => c.status === 'on_bus').length : 0)}
                    </div>
                  )}
                </Link>

                <Link
                  to="/parent-profile"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-beige-1 transition-colors duration-200">
                    <i className="fas fa-user text-brand-dark-blue text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">My Profile</h3>
                  <p className="text-sm text-gray-600">View & edit profile</p>
                </Link>
              </div>

              {/* Additional Quick Actions Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                <Link
                  to="/notifications"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group relative"
                >
                  <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition-colors duration-200">
                    <i className="fas fa-bell text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                  <p className="text-sm text-gray-600">View all alerts</p>
                  {(Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0) > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {(Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0)}
                    </div>
                  )}
                </Link>

                <Link
                  to="/bookings"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group relative"
                >
                  <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-200">
                    <i className="fas fa-list-alt text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">My Bookings</h3>
                  <p className="text-sm text-gray-600">View all reservations</p>
                  {recentBookings.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {recentBookings.length}
                    </div>
                  )}
                </Link>

                <button
                  onClick={() => window.open('/help', '_blank')}
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 transition-colors duration-200">
                    <i className="fas fa-question-circle text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Help & Support</h3>
                  <p className="text-sm text-gray-600">Get assistance</p>
                </button>

                <button
                  onClick={() => {
                    const statusSummary = {
                      total: children.length,
                      onBus: children.filter(c => c.status === 'on_bus').length,
                      atSchool: children.filter(c => c.status === 'at_school').length,
                      atHome: children.filter(c => c.status === 'at_home' || !c.status).length
                    };
                    setAttendanceToast({ 
                      show: true, 
                      type: 'info', 
                      message: `Status Summary: ${statusSummary.onBus} on bus, ${statusSummary.atSchool} at school, ${statusSummary.atHome} at home` 
                    });
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 transition-colors duration-200">
                    <i className="fas fa-chart-pie text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Status</h3>
                  <p className="text-sm text-gray-600">View children status</p>
                </button>
              </div>
            </div>
          
        </section>
      </main>
      {attendanceToast.show && <Toast type={attendanceToast.type} message={attendanceToast.message} />}

      {/* Quick Book Modal */}
      {quickBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-brand-dark-blue">Quick Book Trip</h3>
              <button
                onClick={() => setQuickBookModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Child</label>
                <select
                  value={quickBookForm.childId}
                  onChange={(e) => setQuickBookForm({ ...quickBookForm, childId: e.target.value, pickupStop: '' })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-dark-blue"
                >
                  <option value="">Choose a child...</option>
                  {(Array.isArray(children) ? children : []).map((child) => (
                    <option key={child._id} value={child._id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={quickBookForm.date}
                  onChange={(e) => setQuickBookForm({ ...quickBookForm, date: e.target.value, pickupStop: '' })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-dark-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                <select
                  value={quickBookForm.tripType}
                  onChange={(e) => setQuickBookForm({ ...quickBookForm, tripType: e.target.value, pickupStop: '' })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-dark-blue"
                >
                  <option value="morning">Morning (To School)</option>
                  <option value="afternoon">Afternoon (From School)</option>
                </select>
              </div>
              {/* Pickup Stop Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Stop</label>
                <select
                  value={quickBookForm.pickupStop}
                  onChange={(e) => setQuickBookForm({ ...quickBookForm, pickupStop: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-brand-dark-blue"
                  disabled={availableStops.length === 0}
                >
                  <option value="">{availableStops.length === 0 ? 'No stops available' : 'Choose a pickup stop...'}</option>
                  {availableStops.map((stop, idx) => (
                    <option key={idx} value={JSON.stringify(stop)}>
                      {stop.name || stop.label || `Stop ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setQuickBookModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickBook}
                  disabled={quickBookLoading}
                  className="flex-1 px-4 py-2 bg-brand-dark-blue text-white rounded-md hover:bg-brand-medium-blue disabled:opacity-50"
                >
                  {quickBookLoading ? 'Booking...' : 'Book Trip'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard; 