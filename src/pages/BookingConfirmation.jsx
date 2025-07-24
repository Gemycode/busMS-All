"use client"

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // استخدم بيانات الراكب من أي مصدر متوفر
  const passenger = bookingData?.passengerData || bookingData?.studentId || {};
  // استخدم بيانات الطريق من أي مصدر متوفر
  const route = bookingData?.route || bookingData?.routeId || {};

  useEffect(() => {
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
      setIsLoading(false);
    } else {
      // If no booking data, redirect to booking page
      navigate('/booking');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (bookingData) {
      console.log('bookingData:', bookingData);
    }
  }, [bookingData]);

  const generateBookingId = () => {
    return 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const downloadTicket = () => {
    // Simulate ticket download
    const ticketData = {
      bookingId: generateBookingId(),
      ...bookingData
    };
    
    // Create a simple text representation of the ticket
    const ticketText = `
BOOKING CONFIRMATION
===================
Booking ID: ${ticketData.bookingId}
Route: ${route.name || 'N/A'}
Date: ${ticketData.date}
Time: ${ticketData.time}
Passengers: ${ticketData.passengerCount}
Total Amount: $${ticketData.totalPrice}
Passenger: ${passenger.firstName || 'N/A'} ${passenger.lastName || 'N/A'}
Email: ${passenger.email || 'N/A'}
Phone: ${passenger.phone || 'N/A'}
    `;
    
    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticketData.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Bus Booking',
        text: `I've booked a trip on ${route.name || 'N/A'} for ${bookingData.date} at ${bookingData.time}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Booking ID: ${generateBookingId()}\nRoute: ${route.name || 'N/A'}\nDate: ${bookingData.date}\nTime: ${bookingData.time}`);
      alert('Booking details copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="font-sans text-gray-800 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-brand-medium-blue mb-4"></i>
          <p className="text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return null;
  }

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-arrow-left text-xl"></i>
              </Link>
              <h1 className="text-xl font-bold text-brand-dark-blue">Booking Confirmation</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-600 font-medium">
                <i className="fas fa-check-circle mr-1"></i>
                Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-brand-dark-blue mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your trip has been successfully booked. You will receive a confirmation email shortly.</p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brand-dark-blue">Booking Details</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {generateBookingId()}
              </span>
            </div>

            <div className="space-y-4">
              {/* Route Information */}
              <div className="bg-brand-beige rounded-lg p-4">
                <h4 className="font-semibold text-brand-dark-blue mb-2">Route Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Route:</p>
                    <p className="font-medium">{route.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration:</p>
                    <p className="font-medium">{route.duration || route.estimated_time || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">From:</p>
                    <p className="font-medium">{route.startLocation || route.start_point?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">To:</p>
                    <p className="font-medium">{route.endLocation || route.end_point?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h4 className="font-semibold text-brand-dark-blue mb-2">Trip Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Travel Date:</p>
                    <p className="font-medium">{new Date(bookingData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Departure Time:</p>
                    <p className="font-medium">{bookingData.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Number of Passengers:</p>
                    <p className="font-medium">{bookingData.passengerCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking Type:</p>
                    <p className="font-medium capitalize">{bookingData.bookingType}</p>
                  </div>
                </div>
              </div>

              {/* Passenger Information */}
              <div>
                <h4 className="font-semibold text-brand-dark-blue mb-2">Passenger Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name:</p>
                    <p className="font-medium">{passenger.firstName || 'N/A'} {passenger.lastName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{passenger.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone:</p>
                    <p className="font-medium">{passenger.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Age:</p>
                    <p className="font-medium">{passenger.age || 'N/A'}</p>
                  </div>
                </div>
                {passenger.pickupAddress && (
                  <div className="mt-2">
                    <p className="text-gray-600 text-sm">Pickup Address:</p>
                    <p className="font-medium text-sm">{passenger.pickupAddress}</p>
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-brand-dark-blue mb-2">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span>{route.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingData.passengerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Type:</span>
                    <span className="capitalize">{bookingData.bookingType}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Cost:</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <i className="fas fa-info-circle mr-1"></i>
                    This service is provided free of charge for company employees
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={downloadTicket}
              className="flex items-center justify-center px-4 py-3 bg-brand-medium-blue hover:bg-brand-dark-blue text-white rounded-md transition-colors"
            >
              <i className="fas fa-download mr-2"></i>
              Download Ticket
            </button>
            <button
              onClick={shareBooking}
              className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <i className="fas fa-share mr-2"></i>
              Share Booking
            </button>
            <Link
              to="/dashboard/user"
              className="flex items-center justify-center px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
            >
              <i className="fas fa-user mr-2"></i>
              My Dashboard
            </Link>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Important Information</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <i className="fas fa-info-circle mr-2 mt-1"></i>
                Please arrive at the pickup location 10 minutes before departure time
              </li>
              <li className="flex items-start">
                <i className="fas fa-info-circle mr-2 mt-1"></i>
                Bring your employee ID and booking confirmation
              </li>
              <li className="flex items-start">
                <i className="fas fa-info-circle mr-2 mt-1"></i>
                Cancellations must be made at least 2 hours before departure
              </li>
              <li className="flex items-start">
                <i className="fas fa-info-circle mr-2 mt-1"></i>
                This service is exclusively for company employees and their families
              </li>
              <li className="flex items-start">
                <i className="fas fa-info-circle mr-2 mt-1"></i>
                Contact HR department at +966-50-123-4567 for any questions
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-semibold text-brand-dark-blue mb-4">What's Next?</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-8 w-8 bg-brand-medium-blue rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white text-sm font-medium">1</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">Check Your Email</h5>
                  <p className="text-sm text-gray-600">You'll receive a detailed confirmation email with all booking information</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 bg-brand-medium-blue rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white text-sm font-medium">2</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">Track Your Bus</h5>
                  <p className="text-sm text-gray-600">Use our live tracking feature to see your bus location in real-time</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 bg-brand-medium-blue rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white text-sm font-medium">3</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">Board Your Bus</h5>
                  <p className="text-sm text-gray-600">Show your booking confirmation to the driver when boarding</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center mt-8">
            <Link
              to="/booking"
              className="inline-flex items-center px-6 py-3 bg-brand-dark-blue hover:bg-blue-800 text-white rounded-md transition-colors mr-4"
            >
              <i className="fas fa-plus mr-2"></i>
              Book Another Trip
            </Link>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
            >
              <i className="fas fa-home mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation; 