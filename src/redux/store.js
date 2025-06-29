import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import attendanceReducer from './attendanceSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    attendance: attendanceReducer,
  },
});

export default store; 