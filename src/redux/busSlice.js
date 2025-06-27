import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchBuses = createAsyncThunk(
  "buses/fetchBuses",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/buses/all");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching buses");
    }
  }
);

const busSlice = createSlice({
  name: "buses",
  initialState: {
    buses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuses.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = action.payload;
      })
      .addCase(fetchBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default busSlice.reducer; 