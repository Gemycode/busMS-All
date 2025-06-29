"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dummy notifications data
  const dummyNotifications = [
    {
      id: 1,
      title: "Bus Arrival",
      message: "Your bus will arrive in 5 minutes",
      type: "arrival",
      time: "2 min ago",
      isRead: false,
      route: "Route A - School Zone"
    },
    {
      id: 2,
      title: "Booking Confirmed",
      message: "Your booking for tomorrow has been confirmed",
      type: "booking",
      time: "10 min ago",
      isRead: false,
      route: "Route B - Residential Area"
    },
    {
      id: 3,
      title: "Route Update",
      message: "Route C schedule has been updated",
      type: "update",
      time: "1 hour ago",
      isRead: true,
      route: "Route C - Express Line"
    },
    {
      id: 4,
      title: "Maintenance Alert",
      message: "Bus maintenance scheduled for Friday",
      type: "maintenance",
      time: "2 hours ago",
      isRead: true,
      route: "All Routes"
    }
  ];

  useEffect(() => {
    setNotifications(dummyNotifications);
    setUnreadCount(dummyNotifications.filter(n => !n.isRead).length);
  }, []);

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

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <i className="fas fa-bell text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        <i className={`${getNotificationIcon(notification.type)} text-sm`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
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
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <i className="fas fa-route mr-1"></i>
                          {notification.route}
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
    </div>
  );
};

export default NotificationBell; 