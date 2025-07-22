import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrips } from '../redux/tripsSlice';
import dayjs from 'dayjs';

const getStatusColor = (status) => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'started': return 'bg-yellow-100 text-yellow-800';
    case 'ended': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const AdminTrips = () => {
  const dispatch = useDispatch();
  const { trips, loading, error } = useSelector((state) => state.trips);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    // Fetch all trips initially
    dispatch(fetchTrips());
  }, [dispatch]);

  const filterTrips = () => {
    const today = dayjs().startOf('day');
    switch (activeTab) {
      case 'upcoming':
        return trips.filter(trip => dayjs(trip.date).isAfter(today));
      case 'previous':
        return trips.filter(trip => dayjs(trip.date).isBefore(today));
      case 'today':
      default:
        return trips.filter(trip => dayjs(trip.date).isSame(today, 'day'));
    }
  };

  const filteredTrips = filterTrips();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Trips</h1>
      
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('today')}
            className={`${
              activeTab === 'today'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Today's Trips
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`${
              activeTab === 'upcoming'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Upcoming Trips
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`${
              activeTab === 'previous'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Previous Trips
          </button>
        </nav>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="text-center py-4 text-red-600">Error loading trips.</td></tr>
              ) : filteredTrips.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4">No trips found for this category.</td></tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{dayjs(trip.date).format('YYYY-MM-DD HH:mm')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.routeId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.driverId?.firstName} {trip.driverId?.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.busId?.BusNumber || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTrips; 