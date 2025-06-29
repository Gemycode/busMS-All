"use client"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ParentDashboard = () => {
  const [parent, setParent] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1234567890',
    childrenCount: 2
  });

  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'Emma Johnson',
      age: 12,
      grade: '6th Grade',
      studentId: 'STU002',
      status: 'on_bus',
      currentLocation: 'Route A - Downtown',
      lastSeen: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Michael Johnson',
      age: 15,
      grade: '9th Grade',
      studentId: 'STU003',
      status: 'at_school',
      currentLocation: 'School Campus',
      lastSeen: '1 hour ago'
    }
  ]);

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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Children</p>
                    <p className="text-3xl font-bold text-gray-900">{parent.childrenCount}</p>
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
                      {children.filter(c => c.status === 'on_bus').length}
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
                      {children.filter(c => c.status === 'at_school').length}
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
                      {notifications.filter(n => !n.isRead).length}
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue">Children Status</h2>
                  <Link
                    to="/children"
                    className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                  >
                    Manage All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="font-semibold text-gray-900">{child.name}</h3>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              child.status === 'on_bus' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              <i className={`fas ${child.status === 'on_bus' ? 'fa-bus' : 'fa-school'} mr-1`}></i>
                              {child.status === 'on_bus' ? 'On Bus' : 'At School'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            <i className="fas fa-id-card mr-1"></i>
                            {child.studentId} • {child.grade}
                          </p>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {child.currentLocation}
                          </p>
                          <p className="text-xs text-gray-400">
                            <i className="fas fa-clock mr-1"></i>
                            Last seen: {child.lastSeen}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/track-child/${child.id}`}
                            className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                          >
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            Track
                          </Link>
                          <Link
                            to={`/book-for-child/${child.id}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            <i className="fas fa-plus mr-1"></i>
                            Book
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  {notifications.slice(0, 3).map((notification) => (
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