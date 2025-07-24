import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrips } from '../redux/tripsSlice';

const TripsList = () => {
  const dispatch = useDispatch();
  const { trips, loading, error } = useSelector((state) => state.trips);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center p-4">Loading trips...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error fetching trips: {error.message || 'Unknown error'}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold text-brand-dark-blue mb-4">All Trips</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Route</th>
              <th className="py-2 px-4 border-b">Bus</th>
              <th className="py-2 px-4 border-b">Driver</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td className="py-2 px-4 border-b">{new Date(trip.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{trip.routeId?.name || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{trip.busId?.BusNumber || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{trip.driverId ? `${trip.driverId.firstName} ${trip.driverId.lastName}` : 'N/A'}</td>
                <td className="py-2 px-4 border-b">{trip.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripsList;
