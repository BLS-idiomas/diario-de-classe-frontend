'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import professoresReducer from './slices/professoresSlice';

export const store = configureStore({
  reducer: {
    professores: professoresReducer,
    auth: authReducer,
  },
});
