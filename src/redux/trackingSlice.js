import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

// Async thunks for tracking operations
export const fetchLiveTrackingData = createAsyncThunk(
  'tracking/fetchLiveData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for live tracking data
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            buses: [
              {
                id: 1,
                number: "BUS-001",
                route: "Route A - School Zone",
                driver: "Ahmed Al-Rashid",
                lat: 24.7136,
                lng: 46.6753,
                status: "on-time",
                passengers: 28,
                capacity: 72,
                speed: 25,
                heading: 45,
                nextStop: "King Fahd School",
                eta: "07:15 AM",
                isMoving: true,
                lastUpdate: new Date().toISOString(),
                fuelLevel: 85,
                temperature: 28,
                engineStatus: "normal",
                routeProgress: 65,
                estimatedArrival: "07:15 AM"
              },
              {
                id: 2,
                number: "BUS-002",
                route: "Route B - Residential Area",
                driver: "Fatima Al-Zahra",
                lat: 24.7236,
                lng: 46.6853,
                status: "delayed",
                passengers: 45,
                capacity: 72,
                speed: 15,
                heading: 180,
                nextStop: "Al Riyadh School",
                eta: "07:23 AM",
                isMoving: true,
                lastUpdate: new Date().toISOString(),
                fuelLevel: 72,
                temperature: 30,
                engineStatus: "warning",
                routeProgress: 45,
                estimatedArrival: "07:25 AM"
              },
              {
                id: 3,
                number: "BUS-003",
                route: "Route C - Express Line",
                driver: "Omar Al-Sayed",
                lat: 24.7036,
                lng: 46.6653,
                status: "stopped",
                passengers: 32,
                capacity: 72,
                speed: 0,
                heading: 90,
                nextStop: "International School",
                eta: "07:18 AM",
                isMoving: false,
                lastUpdate: new Date().toISOString(),
                fuelLevel: 95,
                temperature: 26,
                engineStatus: "normal",
                routeProgress: 80,
                estimatedArrival: "07:20 AM"
              }
            ],
            routes: [
              {
                id: 1,
                name: "Route A - School Zone",
                color: "#3B82F6",
                isActive: true,
                path: "M 24.7136,46.6753 Q 24.7236,46.6853 24.7336,46.6953",
                stops: [
                  { name: "Al Olaya District", lat: 24.7136, lng: 46.6753 },
                  { name: "King Fahd School", lat: 24.7236, lng: 46.6853 }
                ]
              },
              {
                id: 2,
                name: "Route B - Residential Area",
                color: "#EF4444",
                isActive: true,
                path: "M 24.7236,46.6853 Q 24.7336,46.6953 24.7436,46.7053",
                stops: [
                  { name: "Al Malaz District", lat: 24.7236, lng: 46.6853 },
                  { name: "Al Riyadh School", lat: 24.7336, lng: 46.6953 }
                ]
              },
              {
                id: 3,
                name: "Route C - Express Line",
                color: "#10B981",
                isActive: true,
                path: "M 24.7036,46.6653 Q 24.7136,46.6753 24.7236,46.6853",
                stops: [
                  { name: "King Fahd District", lat: 24.7036, lng: 46.6653 },
                  { name: "International School", lat: 24.7136, lng: 46.6753 }
                ]
              }
            ],
            stops: [
              {
                id: 1,
                name: "King Fahd School",
                address: "King Fahd Road, Riyadh",
                lat: 24.7236,
                lng: 46.6853,
                type: "school",
                studentCount: 45,
                nextArrival: "07:15 AM",
                status: "active"
              },
              {
                id: 2,
                name: "Al Olaya District",
                address: "Al Olaya Street, Riyadh",
                lat: 24.7136,
                lng: 46.6753,
                type: "pickup",
                studentCount: 8,
                nextArrival: "07:12 AM",
                status: "active"
              },
              {
                id: 3,
                name: "Al Riyadh School",
                address: "Al Malaz District, Riyadh",
                lat: 24.7336,
                lng: 46.6953,
                type: "school",
                studentCount: 12,
                nextArrival: "07:23 AM",
                status: "active"
              }
            ]
          });
        }, 1000);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBusLocation = createAsyncThunk(
  'tracking/updateBusLocation',
  async ({ busId, location }, { rejectWithValue }) => {
    try {
      // Simulate API call to update bus location
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ busId, location, timestamp: new Date().toISOString() });
        }, 500);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendAlert = createAsyncThunk(
  'tracking/sendAlert',
  async (alert, { rejectWithValue }) => {
    try {
      // Simulate API call to send alert
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...alert, id: Date.now(), timestamp: new Date().toISOString() });
        }, 300);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  buses: [],
  routes: [],
  stops: [],
  selectedBus: null,
  trackingHistory: [],
  alerts: [],
  isLoading: false,
  error: null,
  autoRefresh: true,
  refreshInterval: 3000,
  showTraffic: false,
  showWeather: false,
  mapType: 'standard',
  stats: {
    totalBuses: 0,
    onlineBuses: 0,
    onTimeBuses: 0,
    delayedBuses: 0,
    totalPassengers: 0,
    avgSpeed: 0,
    totalDistance: 0
  }
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setSelectedBus: (state, action) => {
      state.selectedBus = action.payload;
    },
    clearSelectedBus: (state) => {
      state.selectedBus = null;
    },
    toggleAutoRefresh: (state) => {
      state.autoRefresh = !state.autoRefresh;
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
    },
    toggleTraffic: (state) => {
      state.showTraffic = !state.showTraffic;
    },
    toggleWeather: (state) => {
      state.showWeather = !state.showWeather;
    },
    setMapType: (state, action) => {
      state.mapType = action.payload;
    },
    addAlert: (state, action) => {
      state.alerts.push(action.payload);
      // Keep only last 10 alerts
      if (state.alerts.length > 10) {
        state.alerts = state.alerts.slice(-10);
      }
    },
    clearAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    updateBusStatus: (state, action) => {
      const { busId, updates } = action.payload;
      const busIndex = state.buses.findIndex(bus => bus.id === busId);
      if (busIndex !== -1) {
        state.buses[busIndex] = { ...state.buses[busIndex], ...updates };
      }
    },
    addTrackingHistory: (state, action) => {
      state.trackingHistory.push(action.payload);
      // Keep only last 50 history entries
      if (state.trackingHistory.length > 50) {
        state.trackingHistory = state.trackingHistory.slice(-50);
      }
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch live tracking data
      .addCase(fetchLiveTrackingData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLiveTrackingData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buses = action.payload.buses;
        state.routes = action.payload.routes;
        state.stops = action.payload.stops;
        
        // Update stats
        const totalBuses = action.payload.buses.length;
        const onlineBuses = action.payload.buses.filter(bus => bus.isMoving).length;
        const onTimeBuses = action.payload.buses.filter(bus => bus.status === 'on-time').length;
        const delayedBuses = action.payload.buses.filter(bus => bus.status === 'delayed').length;
        const totalPassengers = action.payload.buses.reduce((sum, bus) => sum + bus.passengers, 0);
        const avgSpeed = action.payload.buses.reduce((sum, bus) => sum + bus.speed, 0) / totalBuses;
        
        state.stats = {
          totalBuses,
          onlineBuses,
          onTimeBuses,
          delayedBuses,
          totalPassengers,
          avgSpeed: Math.round(avgSpeed),
          totalDistance: state.stats.totalDistance
        };
      })
      .addCase(fetchLiveTrackingData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update bus location
      .addCase(updateBusLocation.fulfilled, (state, action) => {
        const { busId, location } = action.payload;
        const busIndex = state.buses.findIndex(bus => bus.id === busId);
        if (busIndex !== -1) {
          state.buses[busIndex] = { ...state.buses[busIndex], ...location };
        }
      })
      // Send alert
      .addCase(sendAlert.fulfilled, (state, action) => {
        state.alerts.push(action.payload);
        if (state.alerts.length > 10) {
          state.alerts = state.alerts.slice(-10);
        }
      });
  }
});

// Export actions
export const {
  setSelectedBus,
  clearSelectedBus,
  toggleAutoRefresh,
  setRefreshInterval,
  toggleTraffic,
  toggleWeather,
  setMapType,
  addAlert,
  clearAlert,
  updateBusStatus,
  addTrackingHistory,
  updateStats
} = trackingSlice.actions;

// Export selectors
export const selectAllBuses = (state) => state.tracking.buses;
export const selectAllRoutes = (state) => state.tracking.routes;
export const selectAllStops = (state) => state.tracking.stops;
export const selectSelectedBus = (state) => state.tracking.selectedBus;
export const selectTrackingHistory = (state) => state.tracking.trackingHistory;
export const selectAlerts = (state) => state.tracking.alerts;
export const selectIsLoading = (state) => state.tracking.isLoading;
export const selectError = (state) => state.tracking.error;
export const selectAutoRefresh = (state) => state.tracking.autoRefresh;
export const selectRefreshInterval = (state) => state.tracking.refreshInterval;
export const selectShowTraffic = (state) => state.tracking.showTraffic;
export const selectShowWeather = (state) => state.tracking.showWeather;
export const selectMapType = (state) => state.tracking.mapType;
export const selectStats = (state) => state.tracking.stats;

// Selectors for filtered data
export const selectBusesByRoute = (state, routeId) => 
  state.tracking.buses.filter(bus => bus.route.includes(`Route ${routeId}`));

export const selectBusById = (state, busId) => 
  state.tracking.buses.find(bus => bus.id === busId);

export const selectOnlineBuses = (state) => 
  state.tracking.buses.filter(bus => bus.isMoving);

export const selectDelayedBuses = (state) => 
  state.tracking.buses.filter(bus => bus.status === 'delayed');

export const selectActiveAlerts = (state) => 
  state.tracking.alerts.filter(alert => alert.severity === 'warning' || alert.severity === 'error');

export default trackingSlice.reducer; 