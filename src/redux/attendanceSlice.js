import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

// جلب إحصائيات الحضور
// Removed duplicate fetchAttendanceStats declaration to avoid redeclaration error.
export const fetchAttendanceStats = createAsyncThunk(
  "attendance/fetchStats",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const formattedFilters = { ...filters };
      if (formattedFilters.date) {
        const dateObj = new Date(formattedFilters.date);
        formattedFilters.date = dateObj.toISOString().split('T')[0];
      }

      const queryParams = new URLSearchParams(formattedFilters).toString();
      const response = await api.get(`/attendances/stats?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);


// Async thunk for creating attendance record
export const createAttendance = createAsyncThunk(
  'attendance/createAttendance',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const res = await api.post('/attendances', attendanceData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create attendance');
    }
  }
);

// Async thunk for fetching all attendances
export const fetchAttendances = createAsyncThunk(
  'attendance/fetchAttendances',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const res = await api.get(`/attendances?${queryParams}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch attendances');
    }
  }
);
// جلب إحصائيات الحضور

// Async thunk for fetching attendance statistics
// export const fetchAttendanceStats = createAsyncThunk(
//   'attendance/fetchAttendanceStats',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const queryParams = new URLSearchParams();
//       Object.keys(filters).forEach(key => {
//         if (filters[key]) queryParams.append(key, filters[key]);
//       });

//       const res = await api.get(`/attendances/stats?${queryParams}`);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || 'Failed to fetch attendance stats');
//     }
//   }
// );

// Async thunk for fetching user's attendance history
export const fetchUserAttendance = createAsyncThunk(
  'attendance/fetchUserAttendance',
  async ({ userId, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const res = await api.get(`/attendances/user/${userId}?${queryParams}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user attendance');
    }
  }
);

// Async thunk for updating attendance record
export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/attendances/${id}`, updateData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update attendance');
    }
  }
);

// Async thunk for deleting attendance record
export const deleteAttendance = createAsyncThunk(
  'attendance/deleteAttendance',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/attendances/${id}`);
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete attendance');
    }
  }
);

const initialState = {
  attendances: [],
  userAttendances: [],
  stats: {
    totalRecords: 0,
    presentCount: 0,
    absentCount: 0,
    studentCount: 0,
    attendanceRate: 0,
  },
  loading: false,
  error: null,
  success: null
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearAttendances: (state) => {
      state.attendances = [];
    },
    clearUserAttendances: (state) => {
      state.userAttendances = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create attendance
      // fetchAttendanceStats
      // .addCase(fetchAttendanceStats.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
      //   state.stats = action.payload;
      //   state.loading = false;
      // })
      // .addCase(fetchAttendanceStats.rejected, (state, action) => {
      //   state.error = action.payload;
      //   state.loading = false;
      // })

      .addCase(createAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.attendances.unshift(action.payload.attendance);
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch attendances
      .addCase(fetchAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload;
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch attendance stats
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user attendance
      .addCase(fetchUserAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.userAttendances = action.payload;
      })
      .addCase(fetchUserAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const index = state.attendances.findIndex(a => a._id === action.payload.attendance._id);
        if (index !== -1) {
          state.attendances[index] = action.payload.attendance;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete attendance
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.attendances = state.attendances.filter(a => a._id !== action.payload.id);
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearAttendances, clearUserAttendances } = attendanceSlice.actions;
export default attendanceSlice.reducer; 