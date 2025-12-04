'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import professoresReducer from './slices/professoresSlice';
import alunosReducer from './slices/alunosSlice';

export const store = configureStore({
  reducer: {
    alunos: alunosReducer,
    professores: professoresReducer,
    auth: authReducer,
  },
});
