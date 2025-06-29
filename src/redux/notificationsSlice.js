import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({
          data: [
            {
              id: 1,
              title: "Bus Arrival",
              message: "Your bus will arrive in 5 minutes",
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
              message: "Your booking for tomorrow has been confirmed",
              type: "booking",
              time: "10 min ago",
              date: "2024-01-15",
              isRead: false,
              route: "Route B - Residential Area",
              priority: "medium"
            }
          ]
        }), 1000)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async (notification, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        ...notification,
        id: Date.now(),
        time: 'Just now',
        date: new Date().toISOString().split('T')[0],
        isRead: false
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUnreadCount: (state) => {
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedNotification = state.notifications.find(n => n.id === action.payload);
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      })
      
      // Add notification
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
      });
  }
});

export const { clearError, updateUnreadCount } = notificationsSlice.actions;

// Selectors
export const selectAllNotifications = (state) => state.notifications.notifications;
export const selectUnreadNotifications = (state) => 
  state.notifications.notifications.filter(n => !n.isRead);
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.loading;
export const selectNotificationsError = (state) => state.notifications.error;

export default notificationsSlice.reducer; 