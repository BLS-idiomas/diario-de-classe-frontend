'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import professoresReducer from './slices/professoresSlice';
import alunosReducer from './slices/alunosSlice';
import contratosReducer from './slices/contratosSlice';
import diasAulasReducer from './slices/diasAulasSlice';

export const store = configureStore({
  reducer: {
    alunos: alunosReducer,
    professores: professoresReducer,
    contratos: contratosReducer,
    diasAulas: diasAulasReducer,
    auth: authReducer,
  },
});
