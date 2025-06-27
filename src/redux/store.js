import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import routesReducer from "./routesSlice";
import busReducer from "./busSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    routes: routesReducer,
    buses: busReducer,
  },
});

export default store; 