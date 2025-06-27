import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, changePassword } from '../redux/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', phone: '', role: '', profileImage: '' });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

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
        role: user.role || '',
        profileImage: user.profileImage || '',
      });
      setImagePreview(user.profileImage || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    let dataToSend = { ...profileData };
    if (profileImageFile) {
      // If you have an API for image upload, handle it here. For now, just send the file.
      dataToSend.profileImage = profileImageFile;
    }
    const res = await dispatch(updateProfile(dataToSend));
    if (!res.error) {
      setEditMode(false);
      setSuccessMsg('Profile updated successfully!');
    } else {
      setErrorMsg(res.payload || 'Failed to update profile');
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordSuccess('');
    setPasswordLoading(true);
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordMsg('New passwords do not match');
      setPasswordLoading(false);
      return;
    }
    const res = await dispatch(changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }));
    if (!res.error) {
      setPasswordSuccess('Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      setPasswordMsg(res.payload || 'Failed to change password');
    }
    setPasswordLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 pt-20">
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <img
            src={imagePreview || '/default-avatar.png'}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-brand-medium-blue shadow"
          />
          {editMode && (
            <label className="absolute bottom-0 right-0 bg-brand-dark-blue text-white p-2 rounded-full cursor-pointer hover:bg-brand-medium-blue transition-colors border-2 border-white shadow-lg">
              <i className="fas fa-camera"></i>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
        <h2 className="text-2xl font-bold mt-4 mb-1 flex items-center gap-2">
          {profileData.firstName} {profileData.lastName}
          {profileData.role && (
            <span className="text-xs bg-brand-medium-blue text-white px-2 py-1 rounded ml-2 capitalize">
              <i className="fas fa-user-shield mr-1"></i>{profileData.role}
            </span>
          )}
        </h2>
        <p className="text-gray-500">{profileData.email}</p>
      </div>
      {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">{successMsg}</div>}
      {errorMsg && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{errorMsg}</div>}
      <form onSubmit={handleSave} aria-label="Profile form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block font-medium mb-1">
              <i className="fas fa-user mr-1 text-brand-medium-blue"></i>First Name
            </label>
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
          <div>
            <label htmlFor="lastName" className="block font-medium mb-1">
              <i className="fas fa-user mr-1 text-brand-medium-blue"></i>Last Name
            </label>
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
          <div className="md:col-span-2">
            <label htmlFor="email" className="block font-medium mb-1">
              <i className="fas fa-envelope mr-1 text-brand-medium-blue"></i>Email
            </label>
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
          <div className="md:col-span-2">
            <label htmlFor="phone" className="block font-medium mb-1">
              <i className="fas fa-phone mr-1 text-brand-medium-blue"></i>Phone
            </label>
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
        </div>
        <div className="flex gap-2 mb-4 justify-end">
          {!editMode ? (
            <button type="button" onClick={() => setEditMode(true)} className="bg-brand-dark-blue text-white px-4 py-2 rounded shadow hover:bg-brand-medium-blue transition">Edit</button>
          ) : (
            <>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition disabled:opacity-60">
                {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}Save
              </button>
              <button type="button" onClick={() => { setEditMode(false); setImagePreview(user?.profileImage || ''); setProfileImageFile(null); setSuccessMsg(''); setErrorMsg(''); }} className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500 transition">Cancel</button>
            </>
          )}
        </div>
      </form>
      <div className="my-8" />
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-key text-brand-medium-blue"></i>Change Password
        </h3>
        <form onSubmit={handleChangePassword} aria-label="Change password form">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="oldPassword" className="block font-medium mb-1">Old Password</label>
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
            <div>
              <label htmlFor="newPassword" className="block font-medium mb-1">New Password</label>
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
            <div>
              <label htmlFor="confirmNewPassword" className="block font-medium mb-1">Confirm New Password</label>
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
          </div>
          {passwordMsg && <div className="text-sm text-red-600 my-2">{passwordMsg}</div>}
          {passwordSuccess && <div className="text-sm text-green-600 my-2">{passwordSuccess}</div>}
          <button type="submit" disabled={passwordLoading} className="bg-brand-dark-blue text-white px-4 py-2 rounded mt-4 shadow hover:bg-brand-medium-blue transition disabled:opacity-60">
            {passwordLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 