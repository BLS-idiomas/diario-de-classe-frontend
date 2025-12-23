'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetAulaListService } from '@/services/aula/getAulaListService';
import { GetAulaByIdService } from '@/services/aula/getAulaByIdService';
import { CreateAulaService } from '@/services/aula/createAulaService';
import { UpdateAulaService } from '@/services/aula/updateAulaService';
import { DeleteAulaService } from '@/services/aula/deleteAulaService';
import { UpdateAndamentoAulaService } from '@/services/aula/updateAndamentoAulaService';

// GET ALL
export const getAulas = createAsyncThunk(
  'aulas/getAll',
  async (searchParam = null, { rejectWithValue }) => {
    try {
      const res = await GetAulaListService.handle(searchParam);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Erro desconhecido';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// GET ONE
export const getAula = createAsyncThunk(
  'aulas/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetAulaByIdService.handle(id);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Erro desconhecido';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// CREATE
export const createAula = createAsyncThunk(
  'aulas/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await CreateAulaService.handle(data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Erro ao criar aula';
      const validationErrors = error.response?.data?.errors || [];
      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
        statusError: error.response?.status,
      });
    }
  }
);

// UPDATE
export const updateAula = createAsyncThunk(
  'aulas/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateAulaService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar aula';
      const validationErrors = error.response?.data?.errors || [];
      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
        statusError: error.response?.status,
      });
    }
  }
);

// DELETE
export const deleteAula = createAsyncThunk(
  'aulas/delete',
  async (id, { rejectWithValue }) => {
    try {
      await DeleteAulaService.handle(id);
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao deletar aula';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// UPDATE AULA
export const updateAndamentoAula = createAsyncThunk(
  'aulas/updateAndamento',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateAndamentoAulaService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar o status da aula';
      const validationErrors = error.response?.data?.errors || [];
      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
        statusError: error.response?.status,
      });
    }
  }
);

const aulasSlice = createSlice({
  name: 'aulas',
  initialState: {
    list: [],
    current: null,
    status: STATUS.IDLE,
    statusError: null,
    action: null,
    errors: [],
    message: null,
    count: 0,
  },
  reducers: {
    clearErrors: state => {
      state.errors = [];
      state.message = null;
      state.statusError = null;
    },
    clearStatus: state => {
      state.status = STATUS.IDLE;
    },
    clearCurrent: state => {
      state.current = null;
    },
  },
  extraReducers: builder => {
    builder
      // getAulas
      .addCase(getAulas.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.list = [];
        state.message = null;
        state.statusError = null;
        state.action = 'getAulas';
      })
      .addCase(getAulas.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.list = action.payload.data;
        state.count = action.payload.count;
        state.message = action.payload.message;
      })
      .addCase(getAulas.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // getAula
      .addCase(getAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.statusError = null;
        state.action = 'getAula';
      })
      .addCase(getAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
      })
      .addCase(getAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // createAula
      .addCase(createAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createAula';
      })
      .addCase(createAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (!Array.isArray(state.list)) state.list = [];
        state.list.push(action.payload);
        state.count = (state.count || 0) + 1;
      })
      .addCase(createAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao criar aula';
        state.statusError = action.payload.statusError;
      })
      // updateAula
      .addCase(updateAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateAula';
      })
      .addCase(updateAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (Array.isArray(state.list)) {
          state.list = state.list.map(item =>
            item && item.id === action.payload.id ? action.payload : item
          );
        }
      })
      .addCase(updateAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao atualizar aula';
        state.statusError = action.payload.statusError;
      })
      // deleteAula
      .addCase(deleteAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'deleteAula';
      })
      .addCase(deleteAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        const deletedId = action.payload;
        if (Array.isArray(state.list)) {
          state.list = state.list.filter(item => item && item.id !== deletedId);
        }
        if (typeof state.count === 'number' && state.count > 0) {
          state.count = state.count - 1;
        }
        if (state.current && state.current.id === deletedId) {
          state.current = null;
        }
      })
      .addCase(deleteAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao deletar aula';
        state.statusError = action.payload.statusError;
      })
      // updateAndamentoAula
      .addCase(updateAndamentoAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateAndamentoAula';
      })
      .addCase(updateAndamentoAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (Array.isArray(state.list)) {
          state.list = state.list.map(item =>
            item && item.id === action.payload.id ? action.payload : item
          );
        }
      })
      .addCase(updateAndamentoAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao atualizar aula';
        state.statusError = action.payload.statusError;
      });
  },
});

export const clearErrors = aulasSlice.actions.clearErrors;
export const clearStatus = aulasSlice.actions.clearStatus;
export const clearCurrent = aulasSlice.actions.clearCurrent;
export default aulasSlice.reducer;
