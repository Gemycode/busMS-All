import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import trackingReducer from './trackingSlice';
import attendanceReducer from './attendanceSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tracking: trackingReducer,
    attendance: attendanceReducer,
  },
});

export default store;