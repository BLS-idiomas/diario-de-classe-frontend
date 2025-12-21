'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import professoresReducer from './slices/professoresSlice';
import alunosReducer from './slices/alunosSlice';
import contratosReducer from './slices/contratosSlice';
import diasAulasReducer from './slices/diasAulasSlice';
import aulasReducer from './slices/aulasSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    alunos: alunosReducer,
    professores: professoresReducer,
    contratos: contratosReducer,
    diasAulas: diasAulasReducer,
    aulas: aulasReducer,
    auth: authReducer,
  },
});
