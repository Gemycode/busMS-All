import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import trackingReducer from './trackingSlice';
import attendanceReducer from './attendanceSlice';
import busReducer from './busSlice';
import routeReducer from './routeSlice';
import tripsReducer from './tripsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tracking: trackingReducer,
    attendance: attendanceReducer,
    buses: busReducer,
    routes: routeReducer,
    trips: tripsReducer,
  },
});

export default store;