import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, changePassword } from '../redux/userSlice';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

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

  useEffect(() => {
    // Redirect to settings page where profile functionality is now located
    navigate('/settings', { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfileMsg('');
    dispatch(updateProfile(profileData)).then((res) => {
      if (!res.error) {
        setEditMode(false);
        setProfileMsg('تم تحديث البيانات بنجاح');
      } else {
        setProfileMsg(res.payload);
      }
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg('');
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordMsg('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    dispatch(changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }))
      .then((res) => {
        if (!res.error) {
          setPasswordMsg('تم تغيير كلمة المرور بنجاح');
          setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } else {
          setPasswordMsg(res.payload);
        }
      });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto grid gap-8 p-4">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-brand-beige flex items-center justify-center text-3xl text-brand-dark-blue font-bold">
              {user?.firstName?.[0] || ''}{user?.lastName?.[0] || ''}
            </div>
            <div>
              <div className="text-xl font-bold text-brand-dark-blue">{user?.firstName} {user?.lastName}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
          </div>
          <form onSubmit={handleSave} className="grid gap-4" aria-label="Profile form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block font-medium">الاسم الأول</label>
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
                <label htmlFor="lastName" className="block font-medium">اسم العائلة</label>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block font-medium">البريد الإلكتروني</label>
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
              <div>
                <label htmlFor="phone" className="block font-medium">رقم الهاتف</label>
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
            <div className="flex gap-2 mt-2">
              {!editMode ? (
                <button type="button" onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">تعديل</button>
              ) : (
                <>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">حفظ</button>
                  <button type="button" onClick={() => { setEditMode(false); setProfileData({ ...profileData, firstName: user.firstName, lastName: user.lastName, phone: user.phone }); }} className="bg-gray-400 text-white px-4 py-2 rounded">إلغاء</button>
                </>
              )}
            </div>
            {profileMsg && <div className="text-green-600 font-bold text-center mt-2">{profileMsg}</div>}
            {loading && <div className="text-blue-600 text-center">جاري التحميل...</div>}
            {error && <div className="text-red-600 text-center">{error}</div>}
          </form>
        </div>
        {/* Password Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <h3 className="text-xl font-semibold mb-2 text-brand-dark-blue">تغيير كلمة المرور</h3>
          <form onSubmit={handleChangePassword} className="grid gap-4" aria-label="Change password form">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="oldPassword" className="block font-medium">كلمة المرور الحالية</label>
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
                <label htmlFor="newPassword" className="block font-medium">كلمة المرور الجديدة</label>
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
                <label htmlFor="confirmNewPassword" className="block font-medium">تأكيد كلمة المرور الجديدة</label>
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
            {passwordMsg && <div className={`text-center font-bold mt-2 ${passwordMsg.includes('نجاح') ? 'text-green-600' : 'text-red-600'}`}>{passwordMsg}</div>}
            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded mt-2">تغيير كلمة المرور</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 