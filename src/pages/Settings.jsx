"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom"
import { fetchProfile, updateProfile, changePassword } from '../redux/userSlice'

const Settings = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const { loading, error } = useSelector((state) => state.user)
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      bookingReminders: true,
      routeUpdates: true,
      maintenanceAlerts: true
    },
    privacy: {
      locationSharing: true,
      profileVisibility: 'public',
      dataCollection: true
    },
    preferences: {
      language: 'en',
      theme: 'light',
      timezone: 'Asia/Riyadh',
      currency: 'SAR'
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      screenReader: false,
      reducedMotion: false
    }
  })

  // Profile state
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    role: '', 
    profileImage: '' 
  })
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [passwords, setPasswords] = useState({ 
    oldPassword: '', 
    newPassword: '', 
    confirmNewPassword: '' 
  })
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Help state
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [helpCategory, setHelpCategory] = useState('all')

  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  const faqs = [
    {
      id: 1,
      question: "How do I book a bus ride?",
      answer: "To book a bus ride, navigate to the Booking page from the main menu. Select your desired route, date, and time. The service is free for all company employees and their families. You'll receive a confirmation email once your booking is confirmed.",
      category: "booking"
    },
    {
      id: 2,
      question: "How can I track my bus in real-time?",
      answer: "You can track your bus in real-time by visiting the Map View page. The map shows the current location of all buses, their routes, and estimated arrival times. You can also enable notifications to get updates about your bus location.",
      category: "tracking"
    },
    {
      id: 3,
      question: "What should I do if my bus is delayed?",
      answer: "If your bus is delayed, you'll receive a notification automatically. You can also check the real-time tracking map for updates. If the delay is significant, you may receive an alternative route suggestion or a replacement bus will be arranged.",
      category: "delays"
    },
    {
      id: 4,
      question: "How do I change my notification preferences?",
      answer: "You can manage your notification preferences in the Settings page. Go to Settings > Notifications to customize which types of notifications you receive and through which channels (email, push, SMS).",
      category: "notifications"
    },
    {
      id: 5,
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking up to 2 hours before the scheduled departure time. Go to your dashboard and find the booking management section. Changes made after this time may not be possible due to operational constraints.",
      category: "booking"
    },
    {
      id: 6,
      question: "What happens if I miss my bus?",
      answer: "If you miss your bus, you can book the next available ride through the booking system. The system will automatically suggest alternative times and routes. In case of emergencies, contact the support team for immediate assistance.",
      category: "emergency"
    },
    {
      id: 7,
      question: "How do I report an issue with the service?",
      answer: "You can report issues through the Contact page or by using the feedback form in your dashboard. For urgent matters, use the emergency contact number provided. All reports are reviewed and addressed promptly.",
      category: "support"
    },
    {
      id: 8,
      question: "Is the bus service available on weekends?",
      answer: "Yes, the bus service operates on weekends but with reduced frequency. Check the schedule in the booking system for weekend timings. Some routes may have different operating hours on weekends.",
      category: "schedule"
    }
  ]

  const helpCategories = [
    { id: 'all', label: 'All Questions', icon: 'fas fa-question-circle' },
    { id: 'booking', label: 'Booking', icon: 'fas fa-calendar-check' },
    { id: 'tracking', label: 'Tracking', icon: 'fas fa-map-marker-alt' },
    { id: 'delays', label: 'Delays', icon: 'fas fa-clock' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'emergency', label: 'Emergency', icon: 'fas fa-exclamation-triangle' },
    { id: 'support', label: 'Support', icon: 'fas fa-headset' },
    { id: 'schedule', label: 'Schedule', icon: 'fas fa-calendar' }
  ]

  const contactInfo = {
    phone: "+966-11-123-4567",
    email: "support@bustrack.com",
    emergency: "+966-11-999-9999",
    hours: "24/7 Support Available"
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = helpCategory === 'all' || faq.category === helpCategory
    return matchesSearch && matchesCategory
  })

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  useEffect(() => {
    // Load user settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Load profile data
    dispatch(fetchProfile())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        profileImage: user.profileImage || '',
      })
      setImagePreview(user.profileImage || '')
    }
  }, [user])

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const saveSettings = async () => {
    setIsLoading(true)
    setSaveStatus('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings))
      
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    let dataToSend = { ...profileData }
    if (profileImageFile) {
      dataToSend.profileImage = profileImageFile
    }
    const res = await dispatch(updateProfile(dataToSend))
    if (!res.error) {
      setEditMode(false)
      setSuccessMsg('Profile updated successfully!')
    } else {
      setErrorMsg(res.payload || 'Failed to update profile')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMsg('')
    setPasswordSuccess('')
    setPasswordLoading(true)
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordMsg('New passwords do not match')
      setPasswordLoading(false)
      return
    }
    const res = await dispatch(changePassword({ 
      oldPassword: passwords.oldPassword, 
      newPassword: passwords.newPassword 
    }))
    if (!res.error) {
      setPasswordSuccess('Password changed successfully')
      setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' })
    } else {
      setPasswordMsg(res.payload || 'Failed to change password')
    }
    setPasswordLoading(false)
  }

  const resetSettings = () => {
    const defaultSettings = {
      notifications: {
        email: true,
        push: true,
        sms: false,
        bookingReminders: true,
        routeUpdates: true,
        maintenanceAlerts: true
      },
      privacy: {
        locationSharing: true,
        profileVisibility: 'public',
        dataCollection: true
      },
      preferences: {
        language: 'en',
        theme: 'light',
        timezone: 'Asia/Riyadh',
        currency: 'SAR'
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        screenReader: false,
        reducedMotion: false
      }
    }
    setSettings(defaultSettings)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'fas fa-shield-alt' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-cog' },
    { id: 'accessibility', label: 'Accessibility', icon: 'fas fa-universal-access' },
    { id: 'help', label: 'Help & Support', icon: 'fas fa-question-circle' }
  ]

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div>
                <h1 className="text-3xl font-bold text-brand-dark-blue mb-2 drop-shadow-sm">Settings</h1>
                <p className="text-brand-dark-blue text-opacity-95 font-medium">Manage your profile, preferences and get help</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-brand-dark-blue text-opacity-90 font-medium">
                  <span className="flex items-center">
                    <i className="fas fa-user-cog mr-2"></i>
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span>Role: {user?.role || 'User'}</span>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
                <button
                  onClick={saveSettings}
                  disabled={isLoading}
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-save mr-2"></i>
                  )}
                  Save Changes
                </button>
                <button
                  onClick={resetSettings}
                  className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-all duration-200 shadow-md"
                >
                  <i className="fas fa-undo mr-2"></i>Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Save Status */}
        {saveStatus && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className={`p-4 rounded-md ${
              saveStatus === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center">
                <i className={`fas ${saveStatus === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                {saveStatus === 'success' ? 'Settings saved successfully!' : 'Error saving settings. Please try again.'}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 items-start">
              {/* Sidebar */}
              <aside className="w-80 flex-shrink-0 sticky top-28 self-start bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Settings Categories</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-brand-medium-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <i className={`${tab.icon} mr-3`}></i>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* Profile Settings */}
                  {activeTab === 'profile' && (
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark-blue mb-6">Profile Information</h3>
                      
                      {/* Profile Header */}
                      <div className="flex flex-col items-center mb-8">
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

                      {/* Profile Form */}
                      <form onSubmit={saveProfile} aria-label="Profile form" className="mb-8">
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
                              onChange={handleProfileChange}
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
                              onChange={handleProfileChange}
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
                              onChange={handleProfileChange}
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
                              onChange={handleProfileChange}
                              disabled={!editMode}
                              className="w-full border rounded px-3 py-2"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 mb-4 justify-end">
                          {!editMode ? (
                            <button type="button" onClick={() => setEditMode(true)} className="bg-brand-dark-blue text-white px-4 py-2 rounded shadow hover:bg-brand-medium-blue transition">Edit Profile</button>
                          ) : (
                            <>
                              <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition disabled:opacity-60">
                                {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}Save Profile
                              </button>
                              <button type="button" onClick={() => { setEditMode(false); setImagePreview(user?.profileImage || ''); setProfileImageFile(null); setSuccessMsg(''); setErrorMsg(''); }} className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500 transition">Cancel</button>
                            </>
                          )}
                        </div>
                      </form>

                      {/* Change Password Section */}
                      <div className="bg-gray-50 rounded-lg shadow p-6">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <i className="fas fa-key text-brand-medium-blue"></i>Change Password
                        </h4>
                        {passwordSuccess && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">{passwordSuccess}</div>}
                        {passwordMsg && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{passwordMsg}</div>}
                        <form onSubmit={handleChangePassword} aria-label="Password change form">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label htmlFor="oldPassword" className="block font-medium mb-1">Current Password</label>
                              <input
                                id="oldPassword"
                                name="oldPassword"
                                type="password"
                                value={passwords.oldPassword}
                                onChange={handlePasswordChange}
                                className="w-full border rounded px-3 py-2"
                                required
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
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label htmlFor="confirmNewPassword" className="block font-medium mb-1">Confirm New Password</label>
                              <input
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                type="password"
                                value={passwords.confirmNewPassword}
                                onChange={handlePasswordChange}
                                className="w-full border rounded px-3 py-2"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" disabled={passwordLoading} className="bg-brand-dark-blue text-white px-4 py-2 rounded shadow hover:bg-brand-medium-blue transition disabled:opacity-60">
                              {passwordLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}Change Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Help & Support */}
                  {activeTab === 'help' && (
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark-blue mb-6">Help & Support</h3>
                      
                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                          <div className="flex items-center mb-4">
                            <i className="fas fa-book text-2xl text-blue-500 mr-3"></i>
                            <h4 className="text-lg font-bold text-gray-800">Quick Booking Guide</h4>
                          </div>
                          <p className="text-gray-600 mb-4">Learn how to book your bus ride in just a few simple steps.</p>
                          <Link
                            to="/booking"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Start Booking <i className="fas fa-arrow-right ml-2"></i>
                          </Link>
                        </div>

                        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                          <div className="flex items-center mb-4">
                            <i className="fas fa-map text-2xl text-green-500 mr-3"></i>
                            <h4 className="text-lg font-bold text-gray-800">Live Tracking</h4>
                          </div>
                          <p className="text-gray-600 mb-4">Track your bus in real-time and get live updates.</p>
                          <Link
                            to="/map-view"
                            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                          >
                            View Map <i className="fas fa-arrow-right ml-2"></i>
                          </Link>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                          <div className="flex items-center mb-4">
                            <i className="fas fa-headset text-2xl text-purple-500 mr-3"></i>
                            <h4 className="text-lg font-bold text-gray-800">Contact Support</h4>
                          </div>
                          <p className="text-gray-600 mb-4">Get in touch with our support team for immediate assistance.</p>
                          <Link
                            to="/contact"
                            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Contact Us <i className="fas fa-arrow-right ml-2"></i>
                          </Link>
                        </div>
                      </div>

                      {/* Search and Categories */}
                      <div className="mb-8">
                        <div className="mb-6">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search for help topics..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium-blue focus:border-transparent"
                            />
                            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {helpCategories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => setHelpCategory(category.id)}
                              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                                helpCategory === category.id
                                  ? "bg-brand-medium-blue text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <i className={`${category.icon} mr-2`}></i>
                              {category.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* FAQ Section */}
                      <div className="mb-8">
                        <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Frequently Asked Questions</h4>
                        
                        {filteredFaqs.length === 0 ? (
                          <div className="text-center py-8">
                            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                            <p className="text-gray-600">No questions found matching your search.</p>
                            <button
                              onClick={() => {
                                setSearchQuery('')
                                setHelpCategory('all')
                              }}
                              className="mt-4 px-4 py-2 bg-brand-medium-blue text-white rounded-md hover:bg-opacity-90"
                            >
                              View All Questions
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredFaqs.map((faq) => (
                              <div key={faq.id} className="border border-gray-200 rounded-lg">
                                <button
                                  onClick={() => toggleFaq(faq.id)}
                                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                >
                                  <span className="font-medium text-gray-800">{faq.question}</span>
                                  <i className={`fas fa-chevron-down transition-transform ${
                                    expandedFaq === faq.id ? 'rotate-180' : ''
                                  }`}></i>
                                </button>
                                {expandedFaq === faq.id && (
                                  <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Contact Information</h4>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <i className="fas fa-phone text-brand-medium-blue mr-3 w-6"></i>
                              <div>
                                <p className="font-medium text-gray-800">General Support</p>
                                <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-brand-medium-blue">
                                  {contactInfo.phone}
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-exclamation-triangle text-red-500 mr-3 w-6"></i>
                              <div>
                                <p className="font-medium text-gray-800">Emergency Hotline</p>
                                <a href={`tel:${contactInfo.emergency}`} className="text-red-600 hover:text-red-700 font-medium">
                                  {contactInfo.emergency}
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-envelope text-brand-medium-blue mr-3 w-6"></i>
                              <div>
                                <p className="font-medium text-gray-800">Email Support</p>
                                <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-brand-medium-blue">
                                  {contactInfo.email}
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-clock text-brand-medium-blue mr-3 w-6"></i>
                              <div>
                                <p className="font-medium text-gray-800">Support Hours</p>
                                <p className="text-gray-600">{contactInfo.hours}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                          <h4 className="text-lg font-bold text-brand-dark-blue mb-4">Quick Troubleshooting</h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h5 className="font-medium text-blue-900 mb-2">Can't access the app?</h5>
                              <p className="text-blue-700 text-sm">Try refreshing the page or clearing your browser cache. If the problem persists, contact support.</p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                              <h5 className="font-medium text-yellow-900 mb-2">Booking not working?</h5>
                              <p className="text-yellow-700 text-sm">Check if you're logged in and your session hasn't expired. Try logging out and back in.</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <h5 className="font-medium text-green-900 mb-2">Notifications not showing?</h5>
                              <p className="text-green-700 text-sm">Check your notification settings in the Settings page and ensure your browser allows notifications.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeTab === 'notifications' && (
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark-blue mb-6">Notification Preferences</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">Notification Channels</h4>
                            <div className="space-y-3">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications.email}
                                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                  className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                                />
                                <span className="text-gray-700">Email Notifications</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications.push}
                                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                                  className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                                />
                                <span className="text-gray-700">Push Notifications</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications.sms}
                                  onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                                  className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                                />
                                <span className="text-gray-700">SMS Notifications</span>
                              </label>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">Notification Types</h4>
                            <div className="space-y-3">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications.bookingReminders}
                                  onChange={(e) => handleSettingChange('notifications', 'bookingReminders', e.target.checked)}
                                  className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                                />
                                <span className="text-gray-700">Booking Reminders</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications.routeUpdates}
                                  onChange={(e) => handleSettingChange('notifications', 'routeUpdates', e.target.checked)}
                                  className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                                />
                                <span className="text-gray-700">Route Updates</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications.maintenanceAlerts}
                                  onChange={(e) => handleSettingChange('notifications', 'maintenanceAlerts', e.target.checked)}
                                  className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                                />
                                <span className="text-gray-700">Maintenance Alerts</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy Settings */}
                  {activeTab === 'privacy' && (
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark-blue mb-6">Privacy & Security</h3>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.privacy.locationSharing}
                              onChange={(e) => handleSettingChange('privacy', 'locationSharing', e.target.checked)}
                              className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                            />
                            <span className="text-gray-700">Share location for real-time tracking</span>
                          </label>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                            <select
                              value={settings.privacy.profileVisibility}
                              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                            >
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                              <option value="friends">Friends Only</option>
                            </select>
                          </div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.privacy.dataCollection}
                              onChange={(e) => handleSettingChange('privacy', 'dataCollection', e.target.checked)}
                              className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                            />
                            <span className="text-gray-700">Allow data collection for service improvement</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Settings */}
                  {activeTab === 'preferences' && (
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark-blue mb-6">General Preferences</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                            <select
                              value={settings.preferences.language}
                              onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                            >
                              <option value="en">English</option>
                              <option value="ar">العربية</option>
                              <option value="es">Español</option>
                              <option value="fr">Français</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                            <select
                              value={settings.preferences.theme}
                              onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="auto">Auto</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                            <select
                              value={settings.preferences.timezone}
                              onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                            >
                              <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                              <option value="Asia/Dubai">Dubai (GMT+4)</option>
                              <option value="Europe/London">London (GMT+0)</option>
                              <option value="America/New_York">New York (GMT-5)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <select
                              value={settings.preferences.currency}
                              onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                            >
                              <option value="SAR">SAR (ريال)</option>
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Accessibility Settings */}
                  {activeTab === 'accessibility' && (
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark-blue mb-6">Accessibility</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                            <select
                              value={settings.accessibility.fontSize}
                              onChange={(e) => handleSettingChange('accessibility', 'fontSize', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                              <option value="extra-large">Extra Large</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.accessibility.highContrast}
                                onChange={(e) => handleSettingChange('accessibility', 'highContrast', e.target.checked)}
                                className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                              />
                              <span className="text-gray-700">High Contrast Mode</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.accessibility.screenReader}
                                onChange={(e) => handleSettingChange('accessibility', 'screenReader', e.target.checked)}
                                className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                              />
                              <span className="text-gray-700">Screen Reader Support</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.accessibility.reducedMotion}
                                onChange={(e) => handleSettingChange('accessibility', 'reducedMotion', e.target.checked)}
                                className="mr-3 h-4 w-4 text-brand-medium-blue focus:ring-brand-medium-blue border-gray-300 rounded"
                              />
                              <span className="text-gray-700">Reduced Motion</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Settings 