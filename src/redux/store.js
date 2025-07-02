import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import trackingReducer from './trackingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tracking: trackingReducer,
  },
});

export default store; 