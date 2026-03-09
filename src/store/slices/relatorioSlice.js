'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetRelatorioService } from '@/services/relatorio/getReletorioService';
import { GetRelatorioByReportService } from '@/services/relatorio/getRelatorioByReportService';

// GET TODOS RELATÓRIOS
export const getRelatorios = createAsyncThunk(
  'relatorio/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetRelatorioService.handle();
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao buscar relatórios';
      return rejectWithValue({
        message: errorMessage,
        statusError: error?.response?.status,
      });
    }
  }
);

// GET RELATÓRIO POR REPORT (EXPORTA FILE)
export const getRelatorioByReport = createAsyncThunk(
  'relatorio/getByReport',
  async ({ report, params }, { rejectWithValue }) => {
    try {
      const res = await GetRelatorioByReportService.handle(report, params);
      return res.file; // espera que o serviço retorne { file }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao exportar relatório';
      return rejectWithValue({
        message: errorMessage,
        statusError: error?.response?.status,
      });
    }
  }
);

const relatorioSlice = createSlice({
  name: 'relatorio',
  initialState: {
    data: [], // lista de relatórios
    file: null, // arquivo exportado
    status: STATUS.IDLE,
    statusError: null,
    errors: [],
    message: null,
    action: null,
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
    clearFile: state => {
      state.file = null;
    },
  },
  extraReducers: builder => {
    builder
      // getRelatorios
      .addCase(getRelatorios.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.data = null;
        state.action = 'getRelatorios';
      })
      .addCase(getRelatorios.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.data = action.payload;
      })
      .addCase(getRelatorios.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao buscar relatórios';
        state.statusError = action.payload?.statusError;
      })
      // getRelatorioByReport
      .addCase(getRelatorioByReport.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.file = null;
        state.action = 'getRelatorioByReport';
      })
      .addCase(getRelatorioByReport.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.file = action.payload;
      })
      .addCase(getRelatorioByReport.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao exportar relatório';
        state.statusError = action.payload?.statusError;
      });
  },
});

export const clearErrors = relatorioSlice.actions.clearErrors;
export const clearStatus = relatorioSlice.actions.clearStatus;
export const clearData = relatorioSlice.actions.clearData;
export const clearFile = relatorioSlice.actions.clearFile;
export default relatorioSlice.reducer;
