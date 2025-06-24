import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, changePassword } from '../redux/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData)).then((res) => {
      if (!res.error) setEditMode(false);
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordMsg('New passwords do not match');
      return;
    }
    dispatch(changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }))
      .then((res) => {
        if (!res.error) {
          setPasswordMsg('Password changed successfully');
          setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } else {
          setPasswordMsg(res.payload);
        }
      });
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleSave} aria-label="Profile form">
        <div className="mb-4">
          <label htmlFor="firstName" className="block font-medium">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={profileData.firstName}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border rounded px-3 py-2"
            aria-required="true"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block font-medium">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={profileData.lastName}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border rounded px-3 py-2"
            aria-required="true"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
            aria-required="true"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block font-medium">Phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={profileData.phone}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-2 mb-4">
          {!editMode ? (
            <button type="button" onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
          ) : (
            <>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </>
          )}
        </div>
      </form>
      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-2">Change Password</h3>
      <form onSubmit={handleChangePassword} aria-label="Change password form">
        <div className="mb-2">
          <label htmlFor="oldPassword" className="block font-medium">Old Password</label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2"
            aria-required="true"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="newPassword" className="block font-medium">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2"
            aria-required="true"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="confirmNewPassword" className="block font-medium">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={passwords.confirmNewPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2"
            aria-required="true"
          />
        </div>
        {passwordMsg && <div className="text-sm text-red-600 mb-2">{passwordMsg}</div>}
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded mt-2">Change Password</button>
      </form>
    </div>
  );
};

export default Profile; 