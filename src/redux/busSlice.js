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

export const createBus = createAsyncThunk(
  "buses/createBus",
  async (busData, thunkAPI) => {
    try {
      const res = await api.post("/buses/create", busData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error creating bus");
    }
  }
);

export const updateBus = createAsyncThunk(
  "buses/updateBus",
  async ({ id, busData }, thunkAPI) => {
    try {
      const res = await api.put(`/buses/update/${id}`, busData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error updating bus");
    }
  }
);

export const deleteBus = createAsyncThunk(
  "buses/deleteBus",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/buses/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error deleting bus");
    }
  }
);

const busSlice = createSlice({
  name: "buses",
  initialState: {
    buses: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Buses
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
      })
      // Create Bus
      .addCase(createBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBus.fulfilled, (state, action) => {
        state.loading = false;
        state.buses.push(action.payload);
        state.message = "Bus created successfully!";
      })
      .addCase(createBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Bus
      .addCase(updateBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.buses.findIndex(bus => bus._id === action.payload._id);
        if (index !== -1) {
          state.buses[index] = action.payload;
        }
        state.message = "Bus updated successfully!";
      })
      .addCase(updateBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Bus
      .addCase(deleteBus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBus.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = state.buses.filter(bus => bus._id !== action.payload);
        state.message = "Bus deleted successfully!";
      })
      .addCase(deleteBus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = busSlice.actions;
export default busSlice.reducer; 