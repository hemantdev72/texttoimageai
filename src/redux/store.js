import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import imageReducer from './slices/imageSlice';
import creditReducer from './slices/creditSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    image: imageReducer,
    credit: creditReducer,
  },
});