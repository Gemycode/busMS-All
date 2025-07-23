"use client"

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../redux/api';
import Toast from '../components/Toast';
import { fetchRoutes } from '../redux/routeSlice';
import { fetchTrips } from '../redux/tripsSlice';
import { fetchChildren, addChild } from '../redux/userSlice';

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
  const { user, children, childrenLoading, childrenError } = useSelector(state => state.user);
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
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [childForm, setChildForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const { addChildLoading, addChildError, addChildSuccess } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  // جلب الأبناء إذا كان المستخدم Parent
  useEffect(() => {
    if (user && user.role === 'parent') {
      dispatch(fetchChildren());
    }
  }, [user, dispatch]);

  // عند نجاح إضافة طفل، أغلق المودال وافرغ الفورم وجلب الأبناء
  useEffect(() => {
    if (addChildSuccess) {
      setShowAddChildModal(false);
      setChildForm({ firstName: '', lastName: '', email: '', password: '' });
      dispatch(fetchChildren());
    }
  }, [addChildSuccess, dispatch]);

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

  useEffect(() => {
    if (user && user.role === 'parent' && Array.isArray(children) && children.length > 0) {
      if (!passengerData.studentId) {
        setPassengerData(prev => ({ ...prev, studentId: children[children.length - 1]._id || children[children.length - 1].id }));
      }
    }
    // eslint-disable-next-line
  }, [children]);

  useEffect(() => {
    if (addChildSuccess && user && user.role === 'parent' && Array.isArray(children) && children.length > 0) {
      setPassengerData(prev => ({
        ...prev,
        studentId: children[children.length - 1]._id || children[children.length - 1].id
      }));
    }
    // eslint-disable-next-line
  }, [addChildSuccess, children]);

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
      const studentIdToSend = user && user.role === 'parent' ? passengerData.studentId : /* منطق آخر للطالب */ '';
      const res = await api.post('/bookings/create', {
        tripId: selectedTrip._id,
        studentId: studentIdToSend,
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
                <div className={`h-2 w-2 rounded-full ${step >= 4 ? 'bg-brand-medium-blue' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: اختيار الطريق */}
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
                      onClick={() => { setSelectedRoute(route); setStep(2); setSelectedDate(''); setSelectedTrip(null); }}
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
                    </div>
                  ))
                )}
                      </div>
                    </div>
          )}

          {/* Step 2: اختيار التاريخ */}
          {step === 2 && selectedRoute && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-dark-blue mb-2">Select Date</h2>
                <p className="text-gray-600">Choose the date for your trip on <span className="font-semibold">{selectedRoute.name}</span></p>
                  </div>
              <div className="mb-6">
                <select
                  className="w-full border rounded px-3 py-2"
                  value={selectedDate}
                  onChange={e => { setSelectedDate(e.target.value); setSelectedTrip(null); if (e.target.value) dispatch(fetchTrips({ routeId: selectedRoute._id, date: e.target.value })); }}
                >
                  <option value="">Select a date</option>
                  {getAvailableDates().map(date => (
                    <option key={date.value} value={date.value}>{date.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                {selectedDate && (
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2 bg-brand-medium-blue hover:bg-brand-dark-blue text-white rounded-md transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: اختيار الرحلة */}
          {step === 3 && selectedRoute && selectedDate && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-dark-blue mb-2">Select Trip</h2>
                <p className="text-gray-600">Choose a trip for <span className="font-semibold">{selectedRoute.name}</span> on <span className="font-semibold">{selectedDate}</span></p>
              </div>
              {tripsLoading ? (
                <p>Loading trips...</p>
              ) : tripsError ? (
                <p className="text-red-600">Error loading trips: {tripsError?.message || tripsError}</p>
              ) : trips.length === 0 ? (
                <p>No trips available for this route and date.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {trips.map(trip => (
                    <div key={trip._id} className={`border rounded p-4 flex flex-col gap-2 ${selectedTrip && selectedTrip._id === trip._id ? 'border-brand-medium-blue' : ''}`}>
                      <div><b>Time:</b> {new Date(trip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div><b>Bus:</b> {trip.busId?.BusNumber || 'N/A'}</div>
                      <div><b>Driver:</b> {trip.driverId?.firstName} {trip.driverId?.lastName}</div>
                      <div><b>Status:</b> {trip.status}</div>
                      <button className="mt-2 px-4 py-2 bg-brand-medium-blue text-white rounded hover:bg-brand-dark-blue" onClick={() => { setSelectedTrip(trip); setStep(4); }}>Book This Trip</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 4: إدخال بيانات الراكب وتأكيد الحجز */}
          {step === 4 && selectedTrip && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-dark-blue mb-2">Passenger Details & Confirm</h2>
                <p className="text-gray-600">Enter passenger information and confirm your booking for <span className="font-semibold">{selectedRoute.name}</span> at <span className="font-semibold">{new Date(selectedTrip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
              </div>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* اختيار الطفل إذا كان Parent */}
                {user && user.role === 'parent' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Child *</label>
                    {childrenLoading ? (
                      <p>Loading children...</p>
                    ) : childrenError ? (
                      <p className="text-red-600">{childrenError}</p>
                    ) : !Array.isArray(children) || children.length === 0 ? (
                      <div>
                        <p>No children found. Please add your children.</p>
                        <button type="button" className="mt-2 px-4 py-2 bg-brand-medium-blue text-white rounded hover:bg-brand-dark-blue" onClick={() => setShowAddChildModal(true)}>Add a Child</button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <select
                          value={passengerData.studentId || ''}
                          onChange={e => setPassengerData(prev => ({ ...prev, studentId: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                          required
                        >
                          <option value="">Select Child</option>
                          {Array.isArray(children) && children.map((child, idx) => (
                            <option key={child._id || child.id || idx} value={child._id || child.id}>
                              {child.firstName} {child.lastName}
                            </option>
                          ))}
                        </select>
                        <button type="button" className="px-3 py-2 bg-brand-medium-blue text-white rounded hover:bg-brand-dark-blue" onClick={() => setShowAddChildModal(true)}>Add a Child</button>
                      </div>
                    )}
                  </div>
                )}
                {/* إذا لم يكن Parent، أظهر فورم بيانات الراكب العادي */}
                {(!user || user.role !== 'parent') && (
                  <>
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
                  </>
                )}

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-brand-dark-blue mb-3">Booking Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span>{selectedRoute.name}</span>
                      </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{new Date(selectedTrip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                    onClick={() => setStep(3)}
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
      {/* Modal لإضافة طفل جديد */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowAddChildModal(false)}>&times;</button>
            <h3 className="text-xl font-bold text-brand-dark-blue mb-4">Add a Child</h3>
            <form onSubmit={e => { e.preventDefault(); dispatch(addChild(childForm)); }} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" name="firstName" value={childForm.firstName} onChange={e => setChildForm(f => ({ ...f, firstName: e.target.value }))} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" name="lastName" value={childForm.lastName} onChange={e => setChildForm(f => ({ ...f, lastName: e.target.value }))} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
                <input type="email" name="email" value={childForm.email} onChange={e => setChildForm(f => ({ ...f, email: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password (optional)</label>
                <input type="password" name="password" value={childForm.password} onChange={e => setChildForm(f => ({ ...f, password: e.target.value }))} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <button type="submit" className="w-full py-2 px-4 bg-brand-dark-blue text-white font-semibold rounded-md hover:bg-brand-medium-blue transition-all duration-200" disabled={addChildLoading}>
                {addChildLoading ? 'Adding...' : 'Add Child'}
              </button>
              {addChildError && <p className="text-red-600 text-sm mt-2">{addChildError}</p>}
              {addChildSuccess && <p className="text-green-600 text-sm mt-2">Child added successfully!</p>}
            </form>
          </div>
        </div>
      )}
      {/* Toast */}
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
};

export default BookingPage; 