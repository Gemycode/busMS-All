"use client"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student',
    studentId: 'STU001'
  });

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      route: 'Route A - Downtown',
      date: '2024-01-15',
      time: '08:00 AM',
      status: 'confirmed',
      busNumber: 'BUS001'
    },
    {
      id: 2,
      route: 'Route B - Campus',
      date: '2024-01-14',
      time: '07:30 AM',
      status: 'completed',
      busNumber: 'BUS002'
    }
  ]);

  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      id: 1,
      route: 'Route A - Downtown',
      departure: '08:00 AM',
      arrival: '08:45 AM',
      driver: 'Ahmed Hassan',
      busNumber: 'BUS001'
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
                <h1 className="text-3xl font-bold mb-2 text-white">Student Dashboard</h1>
                <p className="text-brand-beige">Welcome back, {user.name}</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/booking"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-bus mr-2"></i>Book a Trip
                </Link>
                <Link
                  to="/map-view"
                  className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-all duration-200"
                >
                  <i className="fas fa-map-marker-alt mr-2"></i>Live Tracking
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
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{recentBookings.length}</p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-arrow-up mr-1"></i>+2 this week
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-ticket-alt text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed Trips</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {recentBookings.filter(b => b.status === 'completed').length}
                    </p>
                    <p className="text-sm text-green-600">
                      <i className="fas fa-check mr-1"></i>On time
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check-circle text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Upcoming Trips</p>
                    <p className="text-3xl font-bold text-gray-900">{upcomingTrips.length}</p>
                    <p className="text-sm text-orange-600">
                      <i className="fas fa-clock mr-1"></i>Next: {upcomingTrips[0]?.departure}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-clock text-orange-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Student ID</p>
                    <p className="text-3xl font-bold text-gray-900">{user.studentId}</p>
                    <p className="text-sm text-brand-medium-blue">
                      <i className="fas fa-id-card mr-1"></i>Active
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-brand-beige rounded-full flex items-center justify-center">
                    <i className="fas fa-user-graduate text-brand-dark-blue text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                          <h3 className="font-semibold text-gray-900">{booking.route}</h3>
                          <p className="text-sm text-gray-600">
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

              {/* Upcoming Trips */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue">Upcoming Trips</h2>
                  <Link
                    to="/trips"
                    className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                  >
                    View All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingTrips.map((trip) => (
                    <div key={trip.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{trip.route}</h3>
                          <p className="text-sm text-gray-600">
                            <i className="fas fa-clock mr-1"></i>
                            {trip.departure} - {trip.arrival}
                          </p>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-user mr-1"></i>
                            Driver: {trip.driver}
                          </p>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-bus mr-1"></i>
                            Bus: {trip.busNumber}
                          </p>
                        </div>
                        <Link
                          to={`/trip/${trip.id}`}
                          className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
                        >
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          Track →
                        </Link>
                      </div>
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
                  to="/booking"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-brand-medium-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-dark-blue transition-colors duration-200">
                    <i className="fas fa-bus text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Book a Trip</h3>
                  <p className="text-sm text-gray-600">Reserve your seat</p>
                </Link>

                <Link
                  to="/map-view"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors duration-200">
                    <i className="fas fa-map-marker-alt text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Live Tracking</h3>
                  <p className="text-sm text-gray-600">Track your bus</p>
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

                <Link
                  to="/notifications"
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors duration-200">
                    <i className="fas fa-bell text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                  <p className="text-sm text-gray-600">View alerts</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard; 