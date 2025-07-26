"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from './Toast';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const lastNotifId = useRef(null);

  // Polling + Toast for new notifications
  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const notifs = res.data;
        if (!Array.isArray(notifs)) return;
        // Toast logic: إذا فيه إشعار جديد
        if (isMounted && notifs.length > 0) {
          const latestId = notifs[0]._id || notifs[0].id;
          if (lastNotifId.current && latestId !== lastNotifId.current) {
            setToastMsg(notifs[0].title || notifs[0].body || 'New notification');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }
          lastNotifId.current = latestId;
        }
        setNotifications(notifs);
        const unread = notifs.filter(n => n.isRead === false || n.isRead === undefined).length;
        setUnreadCount(unread);
      } catch (err) {
        setNotifications([]);
        setUnreadCount(0);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // كل دقيقة
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  // WebSocket/Realtime notifications (اختياري)
  // يمكنك تفعيل الكود التالي إذا كان الباك اند يدعم WebSocket أو Socket.io
  // useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:5000');
  //   socket.onmessage = (event) => {
  //     const notif = JSON.parse(event.data);
  //     setNotifications(prev => [notif, ...prev]);
  //     setUnreadCount(prev => prev + 1);
  //     setToastMsg(notif.title || notif.body || 'New notification');
  //     setShowToast(true);
  //     setTimeout(() => setShowToast(false), 3000);
  //   };
  //   return () => socket.close();
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mark as read locally (UI only)
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        (n._id === notificationId || n.id === notificationId) ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'arrival':
        return 'fas fa-bus text-green-600';
      case 'booking':
        return 'fas fa-check-circle text-blue-600';
      case 'update':
        return 'fas fa-info-circle text-orange-600';
      case 'maintenance':
        return 'fas fa-tools text-red-600';
      default:
        return 'fas fa-bell text-gray-600';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'arrival':
        return 'bg-green-100';
      case 'booking':
        return 'bg-blue-100';
      case 'update':
        return 'bg-orange-100';
      case 'maintenance':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Handle notification click: mark as read and redirect to map-view with busId/routeId if present
  const handleNotificationClick = (notification) => {
    markAsRead(notification._id || notification.id);
    if (notification.busId) {
      navigate(`/map-view?busId=${notification.busId}`);
    } else if (notification.routeId) {
      navigate(`/map-view?routeId=${notification.routeId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toast for new notification */}
      {showToast && <Toast message={toastMsg} type="info" />}
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="Show notifications"
      >
        <i className={`fas fa-bell text-white text-2xl transition-all duration-200 ${unreadCount > 0 ? 'animate-shake drop-shadow-lg' : ''}`}></i>
        {unreadCount > 0 && (
          <span className={`absolute top-0 right-0 h-5 w-5 ${unreadCount > 0 ? 'bg-red-500' : 'bg-brand-dark-blue'} text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse border border-brand-beige`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-brand-medium-blue hover:text-brand-dark-blue"
                >
                  Mark all read
                </button>
              )}
              <Link
                to="/notifications"
                className="text-sm text-brand-medium-blue hover:text-brand-dark-blue"
              >
                View all
              </Link>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <i className="fas fa-bell-slash text-2xl mb-2"></i>
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification._id || notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        <i className={`${getNotificationIcon(notification.type)} text-sm`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title || notification.body || 'Notification'}
                          </p>
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message || notification.body}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <i className="fas fa-route mr-1"></i>
                          {notification.route || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <Link
                to="/notifications"
                className="text-sm text-brand-medium-blue hover:text-brand-dark-blue font-medium"
              >
                View all {notifications.length} notifications
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(-10deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-shake {
          animation: shake 0.6s;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell; 