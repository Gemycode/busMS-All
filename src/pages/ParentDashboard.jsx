"use client"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildren, addChild } from '../redux/userSlice';

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

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      childName: 'Emma Johnson',
      route: 'Route A - Downtown',
      date: '2024-01-15',
      time: '08:00 AM',
      status: 'confirmed',
      busNumber: 'BUS001'
    },
    {
      id: 2,
      childName: 'Michael Johnson',
      route: 'Route B - Campus',
      date: '2024-01-14',
      time: '07:30 AM',
      status: 'completed',
      busNumber: 'BUS002'
    }
  ]);

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

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="pt-20 pb-16">
        {/* Dashboard Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Parent Dashboard</h1>
                <p className="text-brand-beige">Welcome back, {parent.name}</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/children"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-child mr-2"></i>Manage Children
                </Link>
                <Link
                  to="/notifications"
                  className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-all duration-200"
                >
                  <i className="fas fa-bell mr-2"></i>Notifications
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Add Child Form */}
            <div className="mb-8 max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-brand-dark-blue mb-4">Add a Child</h2>
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
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={childForm.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-brand-dark-blue text-white font-semibold rounded-md hover:bg-brand-medium-blue transition-all duration-200"
                  disabled={addChildLoading}
                >
                  {addChildLoading ? 'Adding...' : 'Add Child'}
                </button>
                {addChildError && <p className="text-red-600 text-sm mt-2">{addChildError}</p>}
                {addChildSuccess && <p className="text-green-600 text-sm mt-2">Child added successfully!</p>}
              </form>
            </div>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Children Status */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue">Children Status</h2>
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
                              <h3 className="font-semibold text-gray-900">{child.firstName} {child.lastName}</h3>
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue">Recent Bookings</h2>
                  <Link
                    to="/bookings"
                    className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                  >
                    View All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
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
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-brand-dark-blue">Recent Notifications</h2>
                <Link
                  to="/notifications"
                  className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
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
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <Link
                  to="/booking"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors duration-200">
                    <i className="fas fa-ticket-alt text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Book Trip</h3>
                  <p className="text-sm text-gray-600">Reserve seat for child</p>
                </Link>

                <Link
                  to="/tracking"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors duration-200">
                    <i className="fas fa-map-marker-alt text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Live Tracking</h3>
                  <p className="text-sm text-gray-600">Track children's buses</p>
                </Link>

                <Link
                  to="/profile"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-beige-1 transition-colors duration-200">
                    <i className="fas fa-user text-brand-dark-blue text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">My Profile</h3>
                  <p className="text-sm text-gray-600">View & edit profile</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ParentDashboard; 