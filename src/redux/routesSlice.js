import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchRoutes = createAsyncThunk(
  "routes/fetchRoutes",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/routes/");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching routes");
    }
  }
);

export const createRoute = createAsyncThunk(
  "routes/createRoute",
  async (routeData, thunkAPI) => {
    try {
      const res = await api.post("/routes/", routeData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error creating route");
    }
  }
);

export const updateRoute = createAsyncThunk(
  "routes/updateRoute",
  async ({ id, routeData }, thunkAPI) => {
    try {
      const res = await api.put(`/routes/${id}`, routeData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error updating route");
    }
  }
);

export const deleteRoute = createAsyncThunk(
  "routes/deleteRoute",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/routes/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error deleting route");
    }
  }
);

const routesSlice = createSlice({
  name: "routes",
  initialState: {
    routes: [],
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
      // Fetch Routes
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Route
      .addCase(createRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.routes.push(action.payload);
        state.message = "Route created successfully!";
      })
      .addCase(createRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Route
      .addCase(updateRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.routes.findIndex(route => route._id === action.payload._id);
        if (index !== -1) {
          state.routes[index] = action.payload;
        }
        state.message = "Route updated successfully!";
      })
      .addCase(updateRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Route
      .addCase(deleteRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = state.routes.filter(route => route._id !== action.payload);
        state.message = "Route deleted successfully!";
      })
      .addCase(deleteRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = routesSlice.actions;
export default routesSlice.reducer; 