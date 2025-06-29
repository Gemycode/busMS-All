"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LiveTrackingMap from "../components/LiveTrackingMap";
import { createAttendance, fetchUserAttendance, clearError, clearSuccess } from "../redux/attendanceSlice";
import Toast from "../components/Toast";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { userAttendances, loading, error, success } = useSelector(state => state.attendance);
  
  const [currentRoute, setCurrentRoute] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    personId: '',
    personType: 'Employee',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    boardingTime: '',
    deboardingTime: ''
  });

  useEffect(() => {
    // Set user ID for attendance
    if (user?._id) {
      setAttendanceData(prev => ({ ...prev, personId: user._id }));
      dispatch(fetchUserAttendance({ userId: user._id }));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    // Simulate loading driver data
    setTimeout(() => {
      setCurrentRoute({
        routeNumber: "42",
        routeName: "Westside Express",
        busNumber: "1042",
        currentStop: 8,
        totalStops: 15,
        nextStop: "Maple & Oak Street",
        nextStopETA: "7:15 AM",
        passengersOnBoard: 28,
        capacity: 72,
        status: "on-time",
      });

      setTodaySchedule([
        {
          id: 1,
          type: "Morning Route",
          time: "6:30 AM - 8:15 AM",
          route: "Route #42 - Westside Express",
          status: "completed",
        },
        {
          id: 2,
          type: "Break",
          time: "8:15 AM - 2:45 PM",
          route: "Off Duty",
          status: "current",
        },
        {
          id: 3,
          type: "Afternoon Route",
          time: "3:15 PM - 5:00 PM",
          route: "Route #42 - Westside Express",
          status: "upcoming",
        },
      ]);

      setVehicleStatus({
        busNumber: "1042",
        model: "2021 Thomas Saf-T-Liner",
        fuelLevel: 78,
        mileage: 45672,
        lastMaintenance: "2023-04-15",
        nextMaintenance: "2023-06-15",
        issues: [],
      });

      setMessages([
        {
          id: 1,
          from: "Dispatch",
          message:
            "Route #42 is clear for afternoon run. No construction delays reported.",
          time: "2:30 PM",
          priority: "normal",
          read: false,
        },
        {
          id: 2,
          from: "Manager Davis",
          message:
            "Great job on maintaining schedule this morning. Keep up the excellent work!",
          time: "9:15 AM",
          priority: "normal",
          read: true,
        },
        {
          id: 3,
          from: "Maintenance",
          message:
            "Bus #1042 scheduled for routine inspection next Tuesday at 7:00 AM.",
          time: "Yesterday",
          priority: "high",
          read: true,
        },
      ]);

      setIsOnDuty(true);
    }, 1000);
  }, []);

  const getScheduleStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "current":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleDutyStatus = () => {
    setIsOnDuty(!isOnDuty);
  };

  // Attendance functions
  const handleLogAttendance = () => {
    setShowAttendanceModal(true);
  };

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const submitData = {
      ...attendanceData,
      boardingTime: attendanceData.status === 'present' ? currentTime : '',
      deboardingTime: attendanceData.status === 'absent' ? currentTime : ''
    };
    
    dispatch(createAttendance(submitData));
    setShowAttendanceModal(false);
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return userAttendances.find(att => 
      new Date(att.date).toISOString().split('T')[0] === today
    );
  };

  const todayAttendance = getTodayAttendance();

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="pt-20 pb-16">
        {/* Dashboard Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold  mb-2">Driver Dashboard</h1>
                <p>Welcome back, John Doe</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={toggleDutyStatus}
                  className={`px-4 py-2 font-medium rounded-md transition-all duration-200 ${
                    isOnDuty
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  <i
                    className={`fas ${isOnDuty ? "fa-stop" : "fa-play"} mr-2`}
                  ></i>
                  {isOnDuty ? "End Shift" : "Start Shift"}
                </button>
                <Link
                  to="/driver/profile"
                  className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-all duration-200"
                >
                  <i className="fas fa-user mr-2"></i>Profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Duty Status
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        isOnDuty ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {isOnDuty ? "On Duty" : "Off Duty"}
                    </p>
                    <p className="text-sm text-gray-500">Since 6:30 AM</p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      isOnDuty ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <i
                      className={`fas fa-circle text-xl ${
                        isOnDuty ? "text-green-600" : "text-gray-600"
                      }`}
                    ></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Current Route
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      #{currentRoute?.routeNumber || "--"}
                    </p>
                    <p className="text-sm text-blue-600">
                      <i className="fas fa-clock mr-1"></i>
                      {currentRoute?.status || "Not assigned"}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-route text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Passengers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentRoute?.passengersOnBoard || 0}/
                      {currentRoute?.capacity || 0}
                    </p>
                    <p className="text-sm text-purple-600">
                      <i className="fas fa-users mr-1"></i>Current load
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-users text-purple-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Today's Attendance
                    </p>
                    <p className={`text-2xl font-bold ${
                      todayAttendance?.status === 'present' ? 'text-green-600' : 
                      todayAttendance?.status === 'absent' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {todayAttendance?.status ? todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1) : 'Not Logged'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {todayAttendance?.boardingTime ? `Boarded: ${todayAttendance.boardingTime}` : 'No time logged'}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    todayAttendance?.status === 'present' ? 'bg-green-100' : 
                    todayAttendance?.status === 'absent' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <i className={`fas fa-clipboard-check text-xl ${
                      todayAttendance?.status === 'present' ? 'text-green-600' : 
                      todayAttendance?.status === 'absent' ? 'text-red-600' : 'text-gray-600'
                    }`}></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Route Info */}
              <div className="lg:col-span-2">
                {currentRoute && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-brand-dark-blue">
                        Current Route
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          currentRoute.status === "on-time"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {currentRoute.status.replace("-", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Route #{currentRoute.routeNumber} -{" "}
                          {currentRoute.routeName}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Bus #{currentRoute.busNumber}
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              Progress:
                            </span>
                            <span className="text-sm font-medium">
                              {currentRoute.currentStop}/
                              {currentRoute.totalStops} stops
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-brand-medium-blue h-2 rounded-full"
                              style={{
                                width: `${
                                  (currentRoute.currentStop /
                                    currentRoute.totalStops) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-3">
                          Next Stop
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium text-gray-900">
                            {currentRoute.nextStop}
                          </p>
                          <p className="text-sm text-gray-600">
                            ETA: {currentRoute.nextStopETA}
                          </p>
                          <div className="mt-3 flex space-x-2">
                            <button className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm hover:bg-opacity-90">
                              <i className="fas fa-map-marker-alt mr-1"></i>
                              Navigate
                            </button>
                            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">
                              <i className="fas fa-phone mr-1"></i>Call Dispatch
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Route Map */}
                    <LiveTrackingMap
                      busId="1042"
                      userRole="driver"
                      height="300px"
                    />
                  </div>
                )}

                {/* Today's Schedule */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">
                    Today's Schedule
                  </h2>
                  <div className="space-y-4">
                    {todaySchedule.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 mr-4">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              item.status === "completed"
                                ? "bg-green-500"
                                : item.status === "current"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {item.type}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {item.route}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {item.time}
                              </p>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getScheduleStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                {/* Vehicle Status */}
                {vehicleStatus && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-brand-dark-blue mb-6">
                      Vehicle Status
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Bus Information
                        </h3>
                        <p className="text-gray-900">
                          #{vehicleStatus.busNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {vehicleStatus.model}
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">
                            Fuel Level
                          </span>
                          <span className="text-sm font-medium">
                            {vehicleStatus.fuelLevel}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              vehicleStatus.fuelLevel > 50
                                ? "bg-green-500"
                                : vehicleStatus.fuelLevel > 25
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${vehicleStatus.fuelLevel}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Mileage
                        </h3>
                        <p className="text-gray-900">
                          {vehicleStatus.mileage.toLocaleString()} miles
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Maintenance
                        </h3>
                        <p className="text-sm text-gray-600">
                          Last: {vehicleStatus.lastMaintenance}
                        </p>
                        <p className="text-sm text-gray-600">
                          Next: {vehicleStatus.nextMaintenance}
                        </p>
                      </div>

                      <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors duration-200">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Report Issue
                      </button>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">
                      Messages
                    </h2>
                    <Link
                      to="/driver/messages"
                      className="text-sm text-brand-medium-blue hover:text-brand-dark-blue"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {messages.slice(0, 3).map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg border ${
                          !message.read
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {message.from}
                          </span>
                          <span className="text-xs text-gray-500">
                            {message.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {message.message}
                        </p>
                        {!message.read && (
                          <div className="mt-2">
                            <button className="text-xs text-brand-medium-blue hover:text-brand-dark-blue">
                              Mark as read
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                      <i className="fas fa-play text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">
                        Start Pre-Trip Inspection
                      </span>
                    </button>
                    <button 
                      onClick={handleLogAttendance}
                      disabled={todayAttendance}
                      className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                        todayAttendance 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <i className="fas fa-clipboard-check text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">
                        {todayAttendance ? 'Attendance Logged' : 'Log Attendance'}
                      </span>
                    </button>
                    <button className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                      <i className="fas fa-gas-pump text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">Record Fuel</span>
                    </button>
                    <button className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                      <i className="fas fa-phone text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">
                        Contact Dispatch
                      </span>
                    </button>
                    <Link
                      to="/driver/timesheet"
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <i className="fas fa-clock text-brand-medium-blue mr-3"></i>
                      <span className="text-sm font-medium">
                        View Timesheet
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Log Attendance
              </h3>
              
              <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={attendanceData.date}
                    onChange={(e) => setAttendanceData({...attendanceData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={attendanceData.status}
                    onChange={(e) => setAttendanceData({...attendanceData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Logging...' : 'Log Attendance'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAttendanceModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Messages */}
      {error && <Toast message={error} type="error" />}
      {success && <Toast message={success} type="success" />}
    </div>
  );
};

export default DriverDashboard;
