import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAttendances, 
  fetchAttendanceStats, 
  createAttendance, 
  updateAttendance, 
  deleteAttendance,
  clearError, 
  clearSuccess 
} from '../redux/attendanceSlice';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaChartBar } from 'react-icons/fa';
import Toast from '../components/Toast';

const AttendanceManagement = () => {
  const dispatch = useDispatch();
  const { attendances, stats, loading, error, success } = useSelector(state => state.attendance);
  const { user } = useSelector(state => state.user);

  const [showForm, setShowForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    personType: '',
    status: '',
    personId: ''
  });
  const [formData, setFormData] = useState({
    personId: '',
    personType: 'Student',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    boardingTime: '',
    deboardingTime: ''
  });

  useEffect(() => {
    dispatch(fetchAttendances(filters));
    dispatch(fetchAttendanceStats(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [success, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAttendance) {
      dispatch(updateAttendance({ id: editingAttendance._id, updateData: formData }));
    } else {
      dispatch(createAttendance(formData));
    }
    handleCloseForm();
  };

  const handleEdit = (attendance) => {
    setEditingAttendance(attendance);
    setFormData({
      personId: attendance.personId._id,
      personType: attendance.personType,
      date: new Date(attendance.date).toISOString().split('T')[0],
      status: attendance.status,
      boardingTime: attendance.boardingTime || '',
      deboardingTime: attendance.deboardingTime || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      dispatch(deleteAttendance(id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAttendance(null);
    setFormData({
      personId: '',
      personType: 'Student',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      boardingTime: '',
      deboardingTime: ''
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      personType: '',
      status: '',
      personId: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
          <p className="text-gray-600">Manage and track attendance records for students and employees</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaChartBar className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-blue-600">{stats.students}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FaFilter className="mr-2" />
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Person Type</label>
                <select
                  value={filters.personType}
                  onChange={(e) => handleFilterChange('personType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Student">Student</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <FaPlus className="mr-2" />
                  Add Record
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Attendance Records</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading attendance records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deboarding Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendances.map((attendance) => (
                    <tr key={attendance._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {attendance.personId?.firstName} {attendance.personId?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {attendance.personId?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          attendance.personType === 'Student' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {attendance.personType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(attendance.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          attendance.status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attendance.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attendance.boardingTime || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attendance.deboardingTime || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(attendance)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </button>
                          {(user?.role === 'admin' || user?.role === 'manager') && (
                            <button
                              onClick={() => handleDelete(attendance._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {attendances.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No attendance records found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingAttendance ? 'Edit Attendance' : 'Add Attendance Record'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Person ID
                    </label>
                    <input
                      type="text"
                      value={formData.personId}
                      onChange={(e) => setFormData({...formData, personId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Person Type
                    </label>
                    <select
                      value={formData.personType}
                      onChange={(e) => setFormData({...formData, personType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Student">Student</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Boarding Time
                    </label>
                    <input
                      type="time"
                      value={formData.boardingTime}
                      onChange={(e) => setFormData({...formData, boardingTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deboarding Time
                    </label>
                    <input
                      type="time"
                      value={formData.deboardingTime}
                      onChange={(e) => setFormData({...formData, deboardingTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingAttendance ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseForm}
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
      </div>

      {/* Toast Messages */}
      {error && <Toast message={error} type="error" />}
      {success && <Toast message={success} type="success" />}
    </div>
  );
};

export default AttendanceManagement; 