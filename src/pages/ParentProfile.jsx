"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import LiveTrackingMap from "../components/LiveTrackingMap" // Import LiveTrackingMap component

const ParentProfile = () => {
  const [children, setChildren] = useState([
    {
      id: "STU-2023-0456",
      name: "Emma Miller",
      grade: "Grade 5",
      school: "Westside Elementary School",
      route: "Route #42 - Westside Express",
      morningPickup: "Stop #8 - Maple & Oak St (7:15 AM)",
      afternoonDropoff: "Stop #8 - Maple & Oak St (4:05 PM)",
      currentStatus: "Safely arrived at school at 8:05 AM",
      attendanceStatus: "present", // present, absent, unknown
      lastAttendanceDate: new Date().toISOString().split('T')[0],
    },
    {
      id: "STU-2023-0457",
      name: "Noah Miller",
      grade: "Grade 3",
      school: "Westside Elementary School",
      route: "Route #42 - Westside Express",
      morningPickup: "Stop #8 - Maple & Oak St (7:15 AM)",
      afternoonDropoff: "Stop #8 - Maple & Oak St (4:05 PM)",
      currentStatus: "Safely arrived at school at 8:05 AM",
      attendanceStatus: "present",
      lastAttendanceDate: new Date().toISOString().split('T')[0],
    }
  ]);

  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      // Get current user's children IDs
      const childrenIds = children.map(child => child.id);
      
      const response = await fetch(`http://localhost:5000/api/attendances?personType=Student&date=${new Date().toISOString().split('T')[0]}`);
      const data = await response.json();
      
      if (response.ok) {
        setAttendanceHistory(data);
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (childId, status) => {
    try {
      const attendanceData = {
        personId: childId, // In real app, this would be the actual student user ID
        personType: "Student",
        date: new Date().toISOString(),
        status: status,
        boardingTime: status === "present" ? new Date().toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        }) : "",
        deboardingTime: ""
      };

      const response = await fetch("http://localhost:5000/api/attendances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        alert(`Attendance marked as ${status} for ${children.find(c => c.id === childId)?.name}`);
        fetchAttendanceHistory();
        
        // Update local state
        setChildren(prev => prev.map(child => 
          child.id === childId 
            ? { ...child, attendanceStatus: status, lastAttendanceDate: new Date().toISOString().split('T')[0] }
            : child
        ));
      } else {
        alert("Error marking attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Network error. Please try again.");
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      default:
        return "Not Marked";
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
                <h1 className="text-3xl font-bold mb-2">Parent Profile</h1>
                <p>Manage your children's transportation and preferences</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/parent/dashboard"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200"
                >
                  <i className="fas fa-arrow-left mr-2"></i>Back to Dashboard
                </Link>
                <Link
                  to="/parent/settings"
                  className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-all duration-200"
                >
                  <i className="fas fa-cog mr-2"></i>Settings
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile & Settings */}
              <div className="lg:col-span-1">
                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="text-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-brand-beige mx-auto mb-4 flex items-center justify-center">
                      <i className="fas fa-user text-brand-dark-blue text-3xl"></i>
                    </div>
                    <h2 className="text-xl font-bold text-brand-dark-blue">Sarah Miller</h2>
                    <p className="text-gray-600">Parent Account</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="text-gray-800">sarah.miller@example.com</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="text-gray-800">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="text-gray-800">123 Maple Street, Westside, CA 90210</p>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Real-time Tracking</h3>
                        <p className="text-xs text-gray-500">Track bus location in real-time</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-tracking"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-tracking"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Delay Notifications</h3>
                        <p className="text-xs text-gray-500">Notify about bus delays</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-delay"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-delay"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Attendance Confirmation</h3>
                        <p className="text-xs text-gray-500">Notify when child boards/exits bus</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-attendance"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-attendance"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Schedule Changes</h3>
                        <p className="text-xs text-gray-500">Notify about route/schedule changes</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-schedule"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-schedule"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Weather Alerts</h3>
                        <p className="text-xs text-gray-500">Notify about severe weather impacts</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-weather"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-weather"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Children & Bus Info */}
              <div className="lg:col-span-2">
                {/* Children Information Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Children Information</h2>
                    <Link
                      to="/add-child"
                      className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Child
                    </Link>
                  </div>

                  {children.map((child) => (
                    <div key={child.id} className="border border-gray-200 rounded-lg p-4 mb-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="h-16 w-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center mr-4">
                            <i className="fas fa-child text-brand-light-blue text-2xl"></i>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-brand-dark-blue">{child.name}</h3>
                            <p className="text-gray-600">{child.grade} - Student ID: {child.id}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/child-details?id=${child.id}`}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">School</h4>
                          <p className="text-gray-800">{child.school}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Bus Route</h4>
                          <p className="text-gray-800">{child.route}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Morning Pickup</h4>
                          <p className="text-gray-800">{child.morningPickup}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Afternoon Dropoff</h4>
                          <p className="text-gray-800">{child.afternoonDropoff}</p>
                        </div>
                      </div>

                      {/* Attendance Section */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium text-gray-700">Today's Attendance</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(child.attendanceStatus)}`}>
                            {getAttendanceStatusText(child.attendanceStatus)}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMarkAttendance(child.id, "present")}
                            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-200"
                          >
                            Mark Present
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(child.id, "absent")}
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                          >
                            Mark Absent
                          </button>
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <i className="fas fa-check text-green-600"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-green-800">Current Status</h4>
                            <p className="text-sm text-gray-600">{child.currentStatus}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Attendance History */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark-blue">Attendance History</h2>
                    <button
                      onClick={fetchAttendanceHistory}
                      className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200"
                    >
                      <i className="fas fa-refresh mr-1"></i> Refresh
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <i className="fas fa-spinner fa-spin text-2xl text-brand-medium-blue mb-4"></i>
                      <p className="text-gray-600">Loading attendance history...</p>
                    </div>
                  ) : attendanceHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Boarding Time
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {attendanceHistory.map((record) => (
                            <tr key={record._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {record.personId?.name || "Unknown Student"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(record.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(record.status)}`}>
                                  {record.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {record.boardingTime || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <i className="fas fa-clipboard-list text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-600">No attendance records found</p>
                    </div>
                  )}
                </div>

                {/* Bus Tracking Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Live Bus Tracking</h2>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <i className="fas fa-bus text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-600">Live Bus Tracking Map</p>
                      <p className="text-sm text-gray-500">Real-time location would be displayed here</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-brand-medium-blue">7:15 AM</p>
                      <p className="text-sm text-gray-600">Next Pickup</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">On Time</p>
                      <p className="text-sm text-gray-600">Status</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">5 min</p>
                      <p className="text-sm text-gray-600">ETA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ParentProfile
