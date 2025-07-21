import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import axios from 'axios';

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      let imageUrl = '';
      // 1. Upload image to Cloudinary if exists
      if (userData.image) {
        const formData = new FormData();
        formData.append('file', userData.image);
        formData.append('upload_preset', 'buses_ms'); // Replace with your preset
        const cloudinaryRes = await axios.post('https://api.cloudinary.com/v1_1/dysgbwjsr/image/upload', formData);
        imageUrl = cloudinaryRes.data.secure_url;
      }
      // 2. Register user in backend
      const res = await api.post('/users/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        parentId: userData.parentId,
        image: imageUrl,
        phone: userData.phone,
        licenseNumber: userData.licenseNumber,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/login', loginData);
      return res.data.data; // عدلت هنا ليعيد البيانات بشكل صحيح
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Fetch current user profile
export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/me');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Fetch all users (for admin purposes)
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/');
      return res.data.data.users; // عدلت هنا ليعيد فقط مصفوفة المستخدمين
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Update current user profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await api.patch('/users/me', profileData);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwords, { rejectWithValue }) => {
    try {
      const res = await api.patch('/users/change-password', passwords);
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to change password');
    }
  }
);

// Fetch children for logged-in parent
export const fetchChildren = createAsyncThunk(
  'user/fetchChildren',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/me/children');
      return res.data.children;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch children');
    }
  }
);

// Add a child for logged-in parent
export const addChild = createAsyncThunk(
  'user/addChild',
  async (childData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/me/children', childData);
      return res.data.child;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add child');
    }
  }
);

// Update user by admin
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/users/${id}`, userData);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update user');
    }
  }
);

// Delete user by admin
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
    }
  }
);

const initialState = {
  user: (() => {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  })(),
  token: localStorage.getItem('token') || null,
  allUsers: [],
  loading: false,
  error: null,
  // Children management
  children: [],
  childrenLoading: false,
  childrenError: null,
  addChildLoading: false,
  addChildError: null,
  addChildSuccess: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
       loadUserFromStorage: (state) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        state.user = JSON.parse(storedUser);
      } else {
        state.user = null;
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (action.payload.token && action.payload.token !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (action.payload.token && action.payload.token !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChildren.pending, (state) => {
        state.childrenLoading = true;
        state.childrenError = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.childrenLoading = false;
        state.children = action.payload;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.childrenLoading = false;
        state.childrenError = action.payload;
      })
      .addCase(addChild.pending, (state) => {
        state.addChildLoading = true;
        state.addChildError = null;
        state.addChildSuccess = false;
      })
      .addCase(addChild.fulfilled, (state, action) => {
        state.addChildLoading = false;
        state.addChildSuccess = true;
        state.children.push(action.payload);
      })
      .addCase(addChild.rejected, (state, action) => {
        state.addChildLoading = false;
        state.addChildError = action.payload;
        state.addChildSuccess = false;
      });
  },
});

export const { setUser, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer; 