'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProfessorApi } from '../api/professorApi';
import { GetProfessorListService } from '@/services/professor/getProfessorListService';
import { GetProfessorByIdService } from '@/services/professor/getProfessorByIdService';

const professorApi = new ProfessorApi();

// GET ALL
export const getProfessores = createAsyncThunk(
  'professores/getAll',
  async (searchParam = null) => {
    const res = await GetProfessorListService.handle(searchParam);
    return res.data;
  }
);

// GET ONE
export const getProfessor = createAsyncThunk('professores/getOne', async id => {
  const res = await GetProfessorByIdService.handle(id);
  return res.data;
});

// CREATE
export const createProfessor = createAsyncThunk(
  'professores/create',
  async data => {
    const res = await professorApi.create(data);
    return res.data;
  }
);

// UPDATE
export const updateProfessor = createAsyncThunk(
  'professores/update',
  async ({ id, data }) => {
    const res = await professorApi.update(id, data);
    return res.data;
  }
);

// DELETE
export const deleteProfessor = createAsyncThunk(
  'professores/delete',
  async id => {
    await professorApi.delete(id);
    return id;
  }
);

const professoresSlice = createSlice({
  name: 'professores',
  initialState: {
    list: [],
    current: null,
    loading: false,
    errors: [],
    message: null,
    count: 0,
  },
  extraReducers: builder => {
    builder
      // getProfessores
      .addCase(getProfessores.pending, state => {
        state.loading = true;
        state.errors = [];
        state.list = [];
        state.message = null;
      })
      .addCase(getProfessores.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.count = action.payload.count;
        state.message = action.payload.message;
      })
      .addCase(getProfessores.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
        state.message = action.payload.message;
      })
      // getProfessor
      .addCase(getProfessor.pending, state => {
        state.loading = true;
        state.errors = [];
        state.message = null;
        state.current = null;
      })
      .addCase(getProfessor.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.message) {
          state.current = action.payload;
        } else {
          state.message = action.payload.message;
        }
      })
      .addCase(getProfessor.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
        state.message = action.payload.message;
      })
      // createProfessor
      .addCase(createProfessor.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateProfessor.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p.id === action.payload.id);
        state.list[index] = action.payload;
      })
      .addCase(deleteProfessor.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.id !== action.payload);
      });
  },
});

export default professoresSlice.reducer;
