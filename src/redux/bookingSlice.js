import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

// Async thunk to fetch all bookings
// Async thunk to fetch bookings for the logged-in driver
export const fetchBookings = createAsyncThunk('bookings/fetchDriverBookings', async (_, { rejectWithValue }) => {
  try {
    // This endpoint should be protected and return bookings for the logged-in driver
    const response = await api.get('/bookings/driver');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
