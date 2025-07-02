import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

// Async thunks
export const fetchActiveBuses = createAsyncThunk(
  'tracking/fetchActiveBuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/trackingRoutes/active-buses');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch active buses');
    }
  }
);

export const fetchBusLocation = createAsyncThunk(
  'tracking/fetchBusLocation',
  async (busId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trackingRoutes/bus/${busId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch bus location');
    }
  }
);

export const fetchTrackingHistory = createAsyncThunk(
  'tracking/fetchTrackingHistory',
  async ({ busId, startDate, endDate, limit }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (limit) params.append('limit', limit);
      
      const response = await api.get(`/trackingRoutes/bus/${busId}/history?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tracking history');
    }
  }
);

const initialState = {
  buses: [],
  selectedBus: null,
  trackingHistory: [],
  isLoading: false,
  error: null,
  lastUpdate: null,
  socketConnected: false,
  realTimeUpdates: []
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    setLastUpdate: (state, action) => {
      state.lastUpdate = action.payload;
    },
    updateBusLocation: (state, action) => {
      const { busId, location } = action.payload;
      const busIndex = state.buses.findIndex(bus => bus.bus.id === busId);
      
      if (busIndex !== -1) {
        state.buses[busIndex].location = location;
      }
      
      // Add to real-time updates
      state.realTimeUpdates.unshift({
        busId,
        location,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 50 updates
      if (state.realTimeUpdates.length > 50) {
        state.realTimeUpdates = state.realTimeUpdates.slice(0, 50);
      }
      
      state.lastUpdate = new Date().toISOString();
    },
    setSelectedBus: (state, action) => {
      state.selectedBus = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRealTimeUpdates: (state) => {
      state.realTimeUpdates = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchActiveBuses
      .addCase(fetchActiveBuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveBuses.fulfilled, (state, action) => {
        state.isLoading = false;
        // إذا لم تكن هناك بيانات حقيقية، استخدم بيانات تجريبية
        if (action.payload.buses && action.payload.buses.length > 0) {
          state.buses = action.payload.buses;
        } else {
          // بيانات تجريبية للباصات
          state.buses = [
            {
              bus: {
                id: "DEMO001",
                number: "كورنيش النيل",
                route_id: 1,
                capacity: 50
              },
              location: {
                latitude: 24.088269,
                longitude: 32.906964,
                speed: 35,
                heading: 45,
                status: "active",
                timestamp: new Date().toISOString(),
                battery_level: 90,
                signal_strength: 95,
                next_station: "شارع كورنيش النيل"
              }
            },
            {
              bus: {
                id: "DEMO002",
                number: "شارع المستشفى",
                route_id: 2,
                capacity: 50
              },
              location: {
                latitude: 24.089272,
                longitude: 32.908548,
                speed: 28,
                heading: 60,
                status: "active",
                timestamp: new Date().toISOString(),
                battery_level: 85,
                signal_strength: 90,
                next_station: "شارع المحطة"
              }
            },
            {
              bus: {
                id: "DEMO003",
                number: "طريق الأستاد",
                route_id: 3,
                capacity: 50
              },
              location: {
                latitude: 24.095245,
                longitude: 32.899451,
                speed: 42,
                heading: 90,
                status: "active",
                timestamp: new Date().toISOString(),
                battery_level: 80,
                signal_strength: 88,
                next_station: "طريق الأستاد"
              }
            }
          ];
        }
      })
      .addCase(fetchActiveBuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // إضافة بيانات تجريبية في حالة الفشل
        state.buses = [
          {
            bus: {
              id: "DEMO001",
              number: "كورنيش النيل",
              route_id: 1,
              capacity: 50
            },
            location: {
              latitude: 24.088269,
              longitude: 32.906964,
              speed: 35,
              heading: 45,
              status: "active",
              timestamp: new Date().toISOString(),
              battery_level: 90,
              signal_strength: 95,
              next_station: "شارع كورنيش النيل"
            }
          },
          {
            bus: {
              id: "DEMO002",
              number: "شارع المستشفى",
              route_id: 2,
              capacity: 50
            },
            location: {
              latitude: 24.089272,
              longitude: 32.908548,
              speed: 28,
              heading: 60,
              status: "active",
              timestamp: new Date().toISOString(),
              battery_level: 85,
              signal_strength: 90,
              next_station: "شارع المحطة"
            }
          },
          {
            bus: {
              id: "DEMO003",
              number: "طريق الأستاد",
              route_id: 3,
              capacity: 50
            },
            location: {
              latitude: 24.095245,
              longitude: 32.899451,
              speed: 42,
              heading: 90,
              status: "active",
              timestamp: new Date().toISOString(),
              battery_level: 80,
              signal_strength: 88,
              next_station: "طريق الأستاد"
            }
          }
        ];
      })
      // fetchBusLocation
      .addCase(fetchBusLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the specific bus location
        const busIndex = state.buses.findIndex(bus => bus.bus.id === action.payload.lastLocation.bus_id);
        if (busIndex !== -1) {
          state.buses[busIndex].location = action.payload.lastLocation;
        }
      })
      .addCase(fetchBusLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchTrackingHistory
      .addCase(fetchTrackingHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrackingHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trackingHistory = action.payload.history;
      })
      .addCase(fetchTrackingHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSocketConnected,
  setLastUpdate,
  updateBusLocation,
  setSelectedBus,
  clearError,
  clearRealTimeUpdates
} = trackingSlice.actions;

export default trackingSlice.reducer;