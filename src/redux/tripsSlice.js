import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch trips
export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async ({ date, driverId } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (date) {
        // Ensure date is in YYYY-MM-DD format
        const dateObj = new Date(date);
        params.date = dateObj.toISOString().split('T')[0];
      }
      if (driverId) params.driverId = driverId;
      
      console.log('Fetching trips with params:', params);
      const response = await axios.get('/api/trips', { 
        params,
        headers: {
          'Content-Type': 'application/json',
        },
        baseURL: 'http://localhost:5000', // explicitly set base URL
      });
      console.log('Trips API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching trips:', error.response || error);
      return rejectWithValue(error.response?.data || { 
        message: `Failed to fetch trips: ${error.message}`,
        details: error.response?.data
      });
    }
  }
);

// Async thunk to create a new trip
export const createTrip = createAsyncThunk(
  'trips/createTrip',
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/trips', tripData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    trips: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.push(action.payload); // Add the new trip to the state
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tripsSlice.reducer; 