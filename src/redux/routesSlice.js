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

const routesSlice = createSlice({
  name: "routes",
  initialState: {
    routes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default routesSlice.reducer; 