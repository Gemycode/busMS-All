import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../redux/api';
import Toast from '../components/Toast';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/bookings/parent');
        // Map backend data to UI format
        const bookings = (res.data || []).map((b) => ({
          _id: b._id,
          childName: b.studentId?.firstName && b.studentId?.lastName ? `${b.studentId.firstName} ${b.studentId.lastName}` : 'N/A',
          route: b.routeId?.name || 'N/A',
          bus: b.busId?.BusNumber || 'N/A',
          date: b.date ? new Date(b.date).toLocaleDateString() : 'N/A',
          time: b.date ? new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          status: b.status || 'confirmed',
        }));
        setBookings(bookings);
      } catch (error) {
        setToast({ show: true, type: 'error', message: error.response?.data?.message || 'حدث خطأ أثناء جلب الحجوزات' });
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.route?.toLowerCase().includes(search.toLowerCase()) || b.bus?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCancel = async (id) => {
    try {
      await api.delete(`/bookings/cancel/${id}`);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      setToast({ show: true, type: 'success', message: 'تم إلغاء الحجز بنجاح' });
    } catch (error) {
      setToast({ show: true, type: 'error', message: error.response?.data?.message || 'حدث خطأ أثناء إلغاء الحجز' });
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">My Bookings</h1>
                <p className="text-brand-beige">View and manage all your trip bookings</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/booking"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-bus mr-2"></i>Book a Trip
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings Table */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by route or bus..."
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
                {loading ? (
                  <div className="text-center py-8 text-brand-dark-blue">جاري تحميل الحجوزات...</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Child</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-gray-500">No bookings found.</td>
                        </tr>
                      ) : (
                        filteredBookings.map((booking) => (
                          <tr key={booking._id}>
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
                            <td className="px-6 py-4 whitespace-nowrap">{booking.childName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {booking.status === 'confirmed' && (
                                <button
                                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs font-medium"
                                  onClick={() => handleCancel(booking._id)}
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
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Toast */}
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
};

export default BookingsPage; 