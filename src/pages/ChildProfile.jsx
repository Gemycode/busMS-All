import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../redux/api';
import Toast from '../components/Toast';

const ChildProfile = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', grade: '' });
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [attLoading, setAttLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchChild() {
      setLoading(true);
      try {
        // Fetch all children, then find the one with the matching id
        const res = await api.get('/users/me/children');
        const children = res.data.data?.children || res.data.children || [];
        const child = children.find(c => c._id === childId);
        if (!child) throw new Error('Child not found');
        setChild(child);
        setForm({
          firstName: child.firstName || '',
          lastName: child.lastName || '',
          email: child.email || '',
          grade: child.grade || ''
        });
      } catch (err) {
        setToast({ show: true, type: 'error', message: 'Error fetching child data' });
      } finally {
        setLoading(false);
      }
    }
    async function fetchAttendance() {
      try {
        const res = await api.get(`/attendances?personId=${childId}&personType=student`);
        setAttendance(res.data || []);
      } catch (err) {
        setAttendance([]);
      }
    }
    async function fetchBookings() {
      try {
        const res = await api.get(`/bookings/student/${childId}`);
        setBookings(res.data || []);
      } catch (err) {
        setBookings([]);
      }
    }
    fetchChild();
    fetchAttendance();
    fetchBookings();
  }, [childId]);

  const [selectedTrip, setSelectedTrip] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // PATCH for updating a parent's child
      await api.patch(`/users/me/children/${childId}`, form);
      setToast({ show: true, type: 'success', message: 'Child data updated successfully' });
      setEditMode(false);
    } catch (err) {
      setToast({ show: true, type: 'error', message: 'Error updating child data' });
    }
  };

  const markAttendance = async (status) => {
    setAttLoading(true);
    try {
      const payload = {
        personId: childId,
        personType: 'student',
        date: new Date(),
        status
      };
      if (selectedTrip) payload.tripId = selectedTrip;
      await api.post('/attendances', payload);
      setToast({ show: true, type: 'success', message: `Attendance marked as ${status}` });
      // Refresh attendance history
      const res = await api.get(`/attendances?personId=${childId}&personType=student`);
      setAttendance(res.data || []);
    } catch (err) {
      let msg = 'Error marking attendance';
      if (err?.response?.data?.message) msg = err.response.data.message;
      setToast({ show: true, type: 'error', message: msg });
    } finally {
      setAttLoading(false);
    }
  };

  // Helpers for badge colors
  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8 mb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Child Profile</h1>
                <p className="text-white/80">Manage child data and attendance record</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200">
                  <i className="fas fa-arrow-left mr-2"></i>Back
                </button>
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
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="text-center mb-6">
                      <div className="h-24 w-24 rounded-full bg-brand-beige mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-brand-dark-blue">
                        {form.firstName[0] || ''}{form.lastName[0] || ''}
                      </div>
                      <h2 className="text-xl font-bold text-brand-dark-blue">{form.firstName} {form.lastName}</h2>
                      <p className="text-gray-600">{form.email}</p>
                    </div>
                    <form onSubmit={handleSave} className="grid gap-4" aria-label="Child profile form">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block font-medium">First Name</label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full border rounded px-3 py-2"
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block font-medium">Last Name</label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={form.lastName}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full border rounded px-3 py-2"
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block font-medium">Email</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled
                            className="w-full border rounded px-3 py-2 bg-gray-100"
                            aria-required="true"
                          />
                        </div>
                        <div>
                          <label htmlFor="grade" className="block font-medium">Grade</label>
                          <input
                            id="grade"
                            name="grade"
                            type="text"
                            value={form.grade}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2 justify-center">
                        {!editMode ? (
                          <button type="button" onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
                        ) : (
                          <>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                            <button type="button" onClick={() => { setEditMode(false); setForm({ ...form, firstName: child.firstName, lastName: child.lastName, grade: child.grade }); }} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                          </>
                        )}
                      </div>
                      {toast.show && <div className={`text-center font-bold mt-2 ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{toast.message}</div>}
                    </form>
                  </div>
                </div>
                {/* Right Column - Attendance Actions & History */}
                <div className="lg:col-span-2">
                  {/* Attendance Actions */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-brand-dark-blue">Daily Attendance</h3>
                    </div>
                    <div className="mb-4">
                      <label className="block font-medium mb-1">Select Trip (optional)</label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedTrip}
                        onChange={e => setSelectedTrip(e.target.value)}
                        disabled={attLoading || bookings.length === 0}
                      >
                        <option value="">-- Mark for whole day (no trip) --</option>
                        {bookings.filter(b => b.status !== 'cancelled').map(b => (
                          <option key={b._id} value={b.tripId}>
                            {b.routeId?.name || 'Trip'} | {b.date ? new Date(b.date).toLocaleDateString() : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-4 mb-2">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        onClick={() => markAttendance('present')}
                        disabled={attLoading}
                      >
                        Mark Present
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        onClick={() => markAttendance('absent')}
                        disabled={attLoading}
                      >
                        Mark Absent
                      </button>
                    </div>
                  </div>
                  {/* Attendance History */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-brand-dark-blue">Attendance History</h3>
                      <button
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const res = await api.get(`/attendances?personId=${childId}&personType=student`);
                            setAttendance(res.data || []);
                          } catch (err) {
                            setAttendance([]);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200"
                      >
                        <i className="fas fa-refresh mr-1"></i>Refresh
                      </button>
                    </div>
                    {attendance.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="fas fa-clipboard-list text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-600">No attendance data found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Boarding</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deboarding</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {attendance.map((att) => (
                              <tr key={att._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(att.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(att.status)}`}>{att.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{att.tripId?.routeId?.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{att.tripId?.busId?.BusNumber || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{att.tripId ? 'Trip' : 'Day'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{att.boardingTime || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{att.deboardingTime || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{att.notes || '-'}</td>
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
  );
};

export default ChildProfile; 