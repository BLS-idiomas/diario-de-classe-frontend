'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetConfiguracaoService } from '@/services/configuracao/getConfiguracaoService';
import { UpdateConfiguracaoService } from '@/services/configuracao/updateConfiguracaoService';

// GET CONFIGURACAO
export const getConfiguracao = createAsyncThunk(
  'configuracao/get',
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetConfiguracaoService.handle();
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao buscar configuração';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// UPDATE CONFIGURACAO
export const updateConfiguracao = createAsyncThunk(
  'configuracao/update',
  async (data, { rejectWithValue }) => {
    try {
      const res = await UpdateConfiguracaoService.handle(data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar configuração';
      const validationErrors = error.response?.data?.errors || [];
      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
        statusError: error.response?.status,
      });
    }
  }
);

const configuracaoSlice = createSlice({
  name: 'configuracao',
  initialState: {
    data: null,
    status: STATUS.IDLE,
    statusError: null,
    errors: [],
    message: null,
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
    clearData: state => {
      state.data = null;
    },
  },
  extraReducers: builder => {
    builder
      // getConfiguracao
      .addCase(getConfiguracao.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.data = null;
      })
      .addCase(getConfiguracao.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.data = action.payload;
      })
      .addCase(getConfiguracao.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao buscar configuração';
        state.statusError = action.payload?.statusError;
      })
      // updateConfiguracao
      .addCase(updateConfiguracao.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
      })
      .addCase(updateConfiguracao.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.data = action.payload;
      })
      .addCase(updateConfiguracao.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao atualizar configuração';
        state.statusError = action.payload?.statusError;
      });
  },
});

export const clearErrors = configuracaoSlice.actions.clearErrors;
export const clearStatus = configuracaoSlice.actions.clearStatus;
export const clearData = configuracaoSlice.actions.clearData;
export default configuracaoSlice.reducer;
