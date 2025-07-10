import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import trackingReducer from './trackingSlice';
import attendanceReducer from './attendanceSlice';
import busReducer from './busSlice';
import routeReducer from './routeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tracking: trackingReducer,
    attendance: attendanceReducer,
    buses: busReducer,
    routes: routeReducer,
  },
});

export default store;