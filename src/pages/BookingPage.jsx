"use client"

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../redux/api';
import Toast from '../components/Toast';
import { fetchRoutes } from '../redux/routeSlice';
import { fetchTrips } from '../redux/tripsSlice';

// بيانات تجريبية للرحلات والحجوزات
const availableTrips = [
  { id: 1, route: 'Route A - Downtown', time: '08:00 AM', driver: 'Ahmed Hassan', bus: 'BUS001', seats: 5 },
  { id: 2, route: 'Route B - Campus', time: '07:30 AM', driver: 'Sara Ali', bus: 'BUS002', seats: 2 },
  { id: 3, route: 'Route C - Mall', time: '09:00 AM', driver: 'Mohamed Saleh', bus: 'BUS003', seats: 0 },
];

const initialBookings = [
  { id: 1, route: 'Route A - Downtown', time: '08:00 AM', status: 'confirmed', bus: 'BUS001', date: '2024-07-01' },
  { id: 2, route: 'Route B - Campus', time: '07:30 AM', status: 'completed', bus: 'BUS002', date: '2024-06-28' },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { routes, loading: routesLoading, error: routesError } = useSelector(state => state.routes);
  const { trips, loading: tripsLoading, error: tripsError } = useSelector(state => state.trips);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [bookingType, setBookingType] = useState('oneway'); // oneway, roundtrip, monthly
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Route Selection, 2: Passenger Details, 3: Confirmation
  const [bookings, setBookings] = useState(initialBookings);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  // Passenger form data
  const [passengerData, setPassengerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    emergencyContact: '',
    emergencyPhone: '',
    pickupAddress: '',
    dropoffAddress: '',
    specialNeeds: '',
    notes: ''
  });

  // Get available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  // عند اختيار الطريق
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setStep(2);
    setSelectedDate(''); // إعادة تعيين التاريخ عند تغيير الطريق
  };

  // عند اختيار التاريخ
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (selectedRoute && date) {
      dispatch(fetchTrips({ routeId: selectedRoute._id, date }));
    }
  };

  const handlePassengerDataChange = (field, value) => {
    setPassengerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalPrice = () => {
    // For internal company booking, no payment required
    return 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToast({ show: false, type: 'success', message: '' });
    try {
      // إرسال الطلب للباك اند مع tripId فقط
      const res = await api.post('/bookings/create', {
        tripId: selectedTrip._id,
        studentId: /* ضع هنا منطق جلب الطالب المناسب (مثلاً من المستخدم الحالي أو اختيار من قائمة الأبناء) */ '',
        pickupLocation: {
          name: passengerData.pickupAddress,
          lat: 0, // عدل لاحقًا حسب اختيار المستخدم
          long: 0
        },
        dropoffLocation: {
          name: passengerData.dropoffAddress,
          lat: 0, // عدل لاحقًا حسب اختيار المستخدم
          long: 0
        },
        notes: passengerData.notes
      });
      // عند النجاح
      navigate('/booking-confirmation', {
        state: {
          bookingData: {
            trip: selectedTrip,
            passengerData,
            ...res.data // أضف أي بيانات إضافية من الباك اند
          }
        }
      });
    } catch (error) {
      setToast({ show: true, type: 'error', message: error.response?.data?.message || 'حدث خطأ أثناء الحجز' });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleBook = (trip) => {
    setSelectedTrip(trip);
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    if (selectedTrip) {
      setBookings([
        { id: Date.now(), route: selectedTrip.route, time: selectedTrip.time, status: 'confirmed', bus: selectedTrip.bus, date: '2024-07-01' },
        ...bookings,
      ]);
    }
    setShowConfirm(false);
    setSelectedTrip(null);
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={goBack}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-arrow-left text-xl"></i>
              </button>
              <h1 className="text-xl font-bold text-brand-dark-blue">Book Your Trip</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-brand-medium-blue' : 'bg-gray-300'}`}></div>
                <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-brand-medium-blue' : 'bg-gray-300'}`}></div>
                <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-brand-medium-blue' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Route Selection */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-dark-blue mb-2">Select Your Route</h2>
                <p className="text-gray-600">Choose from our available routes and schedules</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routesLoading ? (
                  <p>Loading routes...</p>
                ) : routesError ? (
                  <p>Error loading routes: {routesError}</p>
                ) : routes.length === 0 ? (
                  <p>No routes available.</p>
                ) : (
                  routes.map((route) => (
                    <div
                      key={route._id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-brand-medium-blue"
                      onClick={() => handleRouteSelect(route)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-brand-dark-blue">{route.name}</h3>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {route.estimated_time || "N/A"}
                        </span>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-map-marker-alt text-brand-medium-blue mr-2"></i>
                          <span>{route.start_point?.name || "-"} → {route.end_point?.name || "-"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-clock text-brand-medium-blue mr-2"></i>
                          <span>{route.estimated_time || "N/A"}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Stops:</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(route.stops) && route.stops.length > 0 ? (
                            route.stops.map((stop, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {stop.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No stops</span>
                          )}
                        </div>
                      </div>
                      {/* لا يوجد description في بيانات route، إذا أردت أضفها لاحقًا */}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Passenger Details */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-dark-blue mb-2">Passenger Details</h2>
                <p className="text-gray-600">Provide passenger information and trip preferences</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Route Summary */}
                <div className="bg-brand-beige rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-brand-dark-blue mb-2">Selected Route</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Route:</p>
                      <p className="font-medium">{selectedRoute.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration:</p>
                      <p className="font-medium">{selectedRoute.duration}</p>
                    </div>
                  </div>
                </div>

                {/* اختيار التاريخ */}
                {step === 2 && (
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Select Date</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={selectedDate}
                      onChange={e => handleDateSelect(e.target.value)}
                    >
                      <option value="">Select a date</option>
                      {getAvailableDates().map(date => (
                        <option key={date.value} value={date.value}>{date.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* بعد اختيار التاريخ، اعرض الرحلات المتاحة: */}
                {step === 2 && selectedDate && (
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Available Trips</label>
                    {tripsLoading ? (
                      <p>Loading trips...</p>
                    ) : tripsError ? (
                      <p className="text-red-600">Error loading trips: {tripsError?.message || tripsError}</p>
                    ) : trips.length === 0 ? (
                      <p>No trips available for this route and date.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trips.map(trip => (
                          <div key={trip._id} className="border rounded p-4 flex flex-col gap-2">
                            <div><b>Time:</b> {new Date(trip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div><b>Bus:</b> {trip.busId?.BusNumber || 'N/A'}</div>
                            <div><b>Driver:</b> {trip.driverId?.firstName} {trip.driverId?.lastName}</div>
                            <div><b>Status:</b> {trip.status}</div>
                            <button className="mt-2 px-4 py-2 bg-brand-medium-blue text-white rounded hover:bg-brand-dark-blue" onClick={() => { setSelectedTrip(trip); setStep(3); }}>Book This Trip</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  {/* Trip Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-brand-dark-blue mb-4">Trip Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Travel Date
                        </label>
                        <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                          required
                        >
                          <option value="">Select Date</option>
                          {getAvailableDates().map((date) => (
                            <option key={date.value} value={date.value}>
                              {date.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Departure Time
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                          required
                        >
                          <option value="">Select Time</option>
                          {selectedRoute.schedule.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Passengers
                        </label>
                        <select
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Passenger' : 'Passengers'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Booking Type
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="bookingType"
                            value="oneway"
                            checked={bookingType === 'oneway'}
                            onChange={(e) => setBookingType(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium">One Way</div>
                            <div className="text-sm text-gray-600">Single trip</div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="bookingType"
                            value="roundtrip"
                            checked={bookingType === 'roundtrip'}
                            onChange={(e) => setBookingType(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium">Round Trip</div>
                            <div className="text-sm text-gray-600">To and from</div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="bookingType"
                            value="monthly"
                            checked={bookingType === 'monthly'}
                            onChange={(e) => setBookingType(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium">Monthly Pass</div>
                            <div className="text-sm text-gray-600">Regular schedule</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Passenger Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-brand-dark-blue mb-4">Passenger Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={passengerData.firstName}
                          onChange={(e) => handlePassengerDataChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={passengerData.lastName}
                          onChange={(e) => handlePassengerDataChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={passengerData.email}
                          onChange={(e) => handlePassengerDataChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={passengerData.phone}
                          onChange={(e) => handlePassengerDataChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          value={passengerData.age}
                          onChange={(e) => handlePassengerDataChange('age', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          value={passengerData.emergencyContact}
                          onChange={(e) => handlePassengerDataChange('emergencyContact', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Address
                      </label>
                      <input
                        type="text"
                        value={passengerData.pickupAddress}
                        onChange={(e) => handlePassengerDataChange('pickupAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                        placeholder="Enter pickup address"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Needs or Notes
                      </label>
                      <textarea
                        value={passengerData.notes}
                        onChange={(e) => handlePassengerDataChange('notes', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                        placeholder="Any special requirements or notes..."
                      />
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-brand-dark-blue mb-3">Booking Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span>{selectedRoute.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passengers:</span>
                        <span>{passengerCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Booking Type:</span>
                        <span className="capitalize">{bookingType}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Cost:</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        This service is provided free of charge for company employees and their families
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-brand-medium-blue hover:bg-brand-dark-blue text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Processing...
                        </span>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* My Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-dark-blue">My Bookings</h2>
              <Link
                to="/bookings"
                className="text-brand-medium-blue hover:text-brand-dark-blue text-sm font-medium"
              >
                View All Bookings →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-xl font-bold text-brand-dark-blue mb-4">Confirm Booking</h3>
            <p className="mb-6">Are you sure you want to book <span className="font-semibold">{selectedTrip.route}</span> at <span className="font-semibold">{selectedTrip.time}</span>?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-brand-medium-blue text-white rounded-md hover:bg-brand-dark-blue"
                onClick={confirmBooking}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast */}
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
};

export default BookingPage; 