"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import LiveTrackingMap from "../components/LiveTrackingMap" // Import LiveTrackingMap component

const ParentProfile = () => {
  const [children, setChildren] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch children and attendance on mount
  useEffect(() => {
    fetchChildrenAndAttendance();
  }, []);

  const fetchChildrenAndAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch children
      const token = localStorage.getItem("token");
      const childrenRes = await fetch("http://localhost:5000/api/users/me/children", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const childrenData = await childrenRes.json();
      if (!childrenRes.ok) throw new Error(childrenData.message || "Failed to fetch children");
      setChildren(childrenData.children || []);
      // Fetch attendance for all children
      const attendanceRes = await fetch("http://localhost:5000/api/attendances/parent", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attendanceData = await attendanceRes.json();
      if (!attendanceRes.ok) throw new Error(attendanceData.message || "Failed to fetch attendance");
      setAttendanceHistory(attendanceData || []);
    } catch (err) {
      setError(err.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  // Mark attendance for a child
  const handleMarkAttendance = async (childId, status) => {
    try {
      const token = localStorage.getItem("token");
      const attendanceData = {
        personId: childId,
        personType: "student", // FIX: use lowercase to match backend
        date: new Date().toISOString(),
        status,
        boardingTime: status === "present" ? new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }) : "",
        deboardingTime: ""
      };
      const response = await fetch("http://localhost:5000/api/attendances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(attendanceData),
      });
      if (response.ok) {
        fetchChildrenAndAttendance();
      } else {
        const errData = await response.json();
        alert(errData.message || "Error marking attendance");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const getAttendanceStatus = (childId) => {
    // Find today's attendance for this child
    const today = new Date().toISOString().split('T')[0];
    const record = attendanceHistory.find(a => a.personId && a.personId._id === childId && a.date && a.date.split('T')[0] === today);
    return record ? record.status : "not_marked";
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800";
      case "absent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case "present": return "Present";
      case "absent": return "Absent";
      default: return "Not Marked";
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
                <Link to="/parent/dashboard" className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200">
                  <i className="fas fa-arrow-left mr-2"></i>Back to Dashboard
                </Link>
                <Link to="/parent/settings" className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-all duration-200">
                  <i className="fas fa-cog mr-2"></i>Settings
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-8">
                <i className="fas fa-spinner fa-spin text-2xl text-brand-medium-blue mb-4"></i>
                <p className="text-gray-600">Loading data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <i className="fas fa-exclamation-triangle text-2xl text-red-500 mb-4"></i>
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile & Settings */}
                <div className="lg:col-span-1">
                  {/* Profile Information */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="text-center mb-6">
                      <div className="h-24 w-24 rounded-full bg-brand-beige mx-auto mb-4 flex items-center justify-center">
                        <i className="fas fa-user text-brand-dark-blue text-3xl"></i>
                      </div>
                      <h2 className="text-xl font-bold text-brand-dark-blue">Parent Account</h2>
                      <p className="text-gray-600">Parent</p>
                    </div>
                  </div>
                </div>
                {/* Right Column - Children & Attendance */}
                <div className="lg:col-span-2">
                  {/* Children Information Card */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-brand-dark-blue">Children Information</h2>
                    </div>
                    {children.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="fas fa-child text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-600">No children found.</p>
                      </div>
                    ) : (
                      children.map((child) => (
                        <div key={child._id} className="border border-gray-200 rounded-lg p-4 mb-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div className="flex items-center mb-4 md:mb-0">
                              <div className="h-16 w-16 rounded-full bg-brand-light-blue bg-opacity-20 flex items-center justify-center mr-4">
                                <i className="fas fa-child text-brand-light-blue text-2xl"></i>
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-brand-dark-blue">{child.firstName} {child.lastName}</h3>
                                <p className="text-gray-600">Student ID: {child._id}</p>
                              </div>
                            </div>
                          </div>
                          {/* Attendance Section */}
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-medium text-gray-700">Today's Attendance</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(getAttendanceStatus(child._id))}`}>
                                {getAttendanceStatusText(getAttendanceStatus(child._id))}
                              </span>
                            </div>
                            {getAttendanceStatus(child._id) === "not_marked" ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleMarkAttendance(child._id, "present")}
                                  className="px-3 py-1 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-200"
                                >
                                  Mark Present
                                </button>
                                <button
                                  onClick={() => handleMarkAttendance(child._id, "absent")}
                                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                                >
                                  Mark Absent
                                </button>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 mt-2">
                                Attendance already marked for today.
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {/* Attendance History */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-brand-dark-blue">Attendance History</h2>
                      <button
                        onClick={fetchChildrenAndAttendance}
                        className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200"
                      >
                        <i className="fas fa-refresh mr-1"></i> Refresh
                      </button>
                    </div>
                    {attendanceHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="fas fa-clipboard-list text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-600">No attendance records found</p>
                      </div>
                    ) : (
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
                                    {record.personId?.firstName} {record.personId?.lastName}
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
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ParentProfile
