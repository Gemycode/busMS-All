import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import attendanceReducer from './attendanceSlice';
import routesReducer from "./routesSlice";
import busReducer from "./busSlice";
import notificationsReducer from "./notificationsSlice";
import trackingReducer from "./trackingSlice";
import reportsReducer from "./reportsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    attendance: attendanceReducer,
    routes: routesReducer,
    buses: busReducer,
    notifications: notificationsReducer,
    tracking: trackingReducer,
    reports: reportsReducer,
  },
});

export default store; 