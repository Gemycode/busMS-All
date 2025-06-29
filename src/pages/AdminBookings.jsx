import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialBookings = [
  { id: 1, user: 'John Doe', route: 'Route A - Downtown', time: '08:00 AM', status: 'confirmed', bus: 'BUS001', date: '2024-07-01' },
  { id: 2, user: 'Sarah Miller', route: 'Route B - Campus', time: '07:30 AM', status: 'completed', bus: 'BUS002', date: '2024-06-28' },
  { id: 3, user: 'Emma Johnson', route: 'Route C - Mall', time: '09:00 AM', status: 'cancelled', bus: 'BUS003', date: '2024-06-25' },
  { id: 4, user: 'Michael Johnson', route: 'Route A - Downtown', time: '08:00 AM', status: 'confirmed', bus: 'BUS001', date: '2024-07-01' },
  { id: 5, user: 'Ahmed Ali', route: 'Route B - Campus', time: '07:30 AM', status: 'confirmed', bus: 'BUS002', date: '2024-07-01' },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // إحصائيات سريعة
  const today = '2024-07-01';
  const todayCount = bookings.filter(b => b.date === today).length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.user.toLowerCase().includes(search.toLowerCase()) || b.route.toLowerCase().includes(search.toLowerCase()) || b.bus.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCancel = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const handleEdit = (id) => {
    alert('Edit booking feature coming soon!');
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Bookings Management</h1>
                <p className="text-brand-beige">View, search, and manage all bookings in the system</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-arrow-left mr-2"></i>Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bookings Today</p>
                  <p className="text-2xl font-bold text-brand-dark-blue">{todayCount}</p>
                </div>
                <i className="fas fa-calendar-day text-2xl text-brand-medium-blue"></i>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
                </div>
                <i className="fas fa-check-circle text-2xl text-green-500"></i>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
                </div>
                <i className="fas fa-times-circle text-2xl text-red-500"></i>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings Table */}
        <section className="py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by user, route, or bus..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                  />
                  <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                  >
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-500">No bookings found.</td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.user}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.route}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.bus}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'completed'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                            <button
                              className="px-3 py-1 bg-brand-medium-blue text-white rounded-md hover:bg-brand-dark-blue text-xs font-medium"
                              onClick={() => handleEdit(booking.id)}
                            >
                              Edit
                            </button>
                            {booking.status === 'confirmed' && (
                              <button
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs font-medium"
                                onClick={() => handleCancel(booking.id)}
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminBookings; 