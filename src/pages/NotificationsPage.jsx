"use client"

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, arrival, booking, update, maintenance
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const navigate = useNavigate();

  // Dummy notifications data
  const dummyNotifications = [
    {
      id: 1,
      title: "Bus Arrival",
      message: "Your bus will arrive in 5 minutes at the pickup location",
      type: "arrival",
      time: "2 min ago",
      date: "2024-01-15",
      isRead: false,
      route: "Route A - School Zone",
      priority: "high"
    },
    {
      id: 2,
      title: "Booking Confirmed",
      message: "Your booking for tomorrow has been confirmed successfully",
      type: "booking",
      time: "10 min ago",
      date: "2024-01-15",
      isRead: false,
      route: "Route B - Residential Area",
      priority: "medium"
    },
    {
      id: 3,
      title: "Route Update",
      message: "Route C schedule has been updated due to road construction",
      type: "update",
      time: "1 hour ago",
      date: "2024-01-15",
      isRead: true,
      route: "Route C - Express Line",
      priority: "medium"
    },
    {
      id: 4,
      title: "Maintenance Alert",
      message: "Bus maintenance scheduled for Friday. Alternative routes will be provided",
      type: "maintenance",
      time: "2 hours ago",
      date: "2024-01-15",
      isRead: true,
      route: "All Routes",
      priority: "high"
    },
    {
      id: 5,
      title: "Child Boarded",
      message: "Ahmed has successfully boarded the bus",
      type: "boarding",
      time: "3 hours ago",
      date: "2024-01-15",
      isRead: true,
      route: "Route A - School Zone",
      priority: "low"
    },
    {
      id: 6,
      title: "Weather Alert",
      message: "Heavy rain expected. Buses may be delayed",
      type: "alert",
      time: "4 hours ago",
      date: "2024-01-15",
      isRead: false,
      route: "All Routes",
      priority: "high"
    },
    {
      id: 7,
      title: "Driver Change",
      message: "New driver assigned to Route B starting tomorrow",
      type: "update",
      time: "1 day ago",
      date: "2024-01-14",
      isRead: true,
      route: "Route B - Residential Area",
      priority: "medium"
    },
    {
      id: 8,
      title: "Monthly Report",
      message: "Your monthly bus usage report is ready",
      type: "report",
      time: "2 days ago",
      date: "2024-01-13",
      isRead: true,
      route: "All Routes",
      priority: "low"
    }
  ];

  useEffect(() => {
    setNotifications(dummyNotifications);
    setFilteredNotifications(dummyNotifications);
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Filter by read status
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.isRead);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.route.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, filter, typeFilter, searchTerm]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const markAsUnread = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: false } : n
      )
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const markSelectedAsRead = () => {
    setNotifications(prev => 
      prev.map(n => 
        selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n
      )
    );
    setSelectedNotifications([]);
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
  };

  const toggleSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  const deselectAll = () => {
    setSelectedNotifications([]);
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
      case 'boarding':
        return 'fas fa-user-plus text-purple-600';
      case 'alert':
        return 'fas fa-exclamation-triangle text-red-600';
      case 'report':
        return 'fas fa-chart-bar text-indigo-600';
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
      case 'boarding':
        return 'bg-purple-100';
      case 'alert':
        return 'bg-red-100';
      case 'report':
        return 'bg-indigo-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle notification click: mark as read and redirect to map-view with busId/routeId if present
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.busId) {
      navigate(`/map-view?busId=${notification.busId}`);
    } else if (notification.routeId) {
      navigate(`/map-view?routeId=${notification.routeId}`);
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-arrow-left text-xl"></i>
              </Link>
              <h1 className="text-xl font-bold text-brand-dark-blue">Notifications</h1>
              {unreadCount > 0 && (
                <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={markSelectedAsRead}
                disabled={selectedNotifications.length === 0}
                className="px-3 py-1 bg-brand-medium-blue hover:bg-brand-dark-blue text-white text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Read
              </button>
              <button
                onClick={deleteSelected}
                disabled={selectedNotifications.length === 0}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Notifications
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, message, or route..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                >
                  <option value="all">All ({notifications.length})</option>
                  <option value="unread">Unread ({unreadCount})</option>
                  <option value="read">Read ({notifications.length - unreadCount})</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                >
                  <option value="all">All Types</option>
                  <option value="arrival">Arrival</option>
                  <option value="booking">Booking</option>
                  <option value="update">Update</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="boarding">Boarding</option>
                  <option value="alert">Alert</option>
                  <option value="report">Report</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {filteredNotifications.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={selectedNotifications.length === filteredNotifications.length ? deselectAll : selectAll}
                      className="text-sm text-brand-medium-blue hover:text-brand-dark-blue"
                    >
                      {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
                    </button>
                    {selectedNotifications.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {selectedNotifications.length} selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-md">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <i className="fas fa-bell-slash text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">
                  {searchTerm || filter !== 'all' || typeFilter !== 'all' 
                    ? 'Try adjusting your filters or search terms'
                    : 'You\'re all caught up! No new notifications.'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg shadow-sm mb-2 cursor-pointer transition-colors ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                      <i className={`${getNotificationIcon(notification.type)} text-lg`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              <i className="fas fa-route mr-1"></i>
                              {notification.route}
                            </span>
                            <span>
                              <i className="fas fa-clock mr-1"></i>
                              {notification.time}
                            </span>
                            <span>
                              <i className="fas fa-calendar mr-1"></i>
                              {notification.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.isRead ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsUnread(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Mark as unread"
                        >
                          <i className="fas fa-envelope"></i>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Mark as read"
                        >
                          <i className="fas fa-envelope-open"></i>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-red-400 hover:text-red-600"
                        title="Delete notification"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredNotifications.length > 10 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                  Previous
                </button>
                <span className="px-3 py-1 bg-brand-medium-blue text-white rounded-md">1</span>
                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage; 