'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetContratoListService } from '@/services/contrato/getContratoListService';
import { GetContratoByIdService } from '@/services/contrato/getContratoByIdService';
import { CreateContratoService } from '@/services/contrato/createContratoService';
import { UpdateContratoService } from '@/services/contrato/updateContratoService';
import { DeleteContratoService } from '@/services/contrato/deleteContratoService';
import { CreateManyAulasService } from '@/services/contrato/createManyAulasService';
import { CreateManyDiasAulasService } from '@/services/contrato/createManyDiasAulasService';
import { GenerateAulasService } from '@/services/contrato/generateAulasService';
import { GetAulasByContratoService } from '@/services/contrato/getAulasByContratoService';
import { GetDiasAulasByContratoService } from '@/services/contrato/getDiasAulasByContratoService';
import { ValidateContratoService } from '@/services/contrato/validateContratoService';

// GET ALL
export const getContratos = createAsyncThunk(
  'contratos/getAll',
  async (searchParam = null, { rejectWithValue }) => {
    try {
      const res = await GetContratoListService.handle(searchParam);
      return res.data;
    } catch (error) {
      // Capturar a mensagem de erro da resposta da API
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
export const getContrato = createAsyncThunk(
  'contratos/getOne',
  async ({ id, withRelations = false }, { rejectWithValue }) => {
    try {
      const res = await GetContratoByIdService.handle(id, withRelations);
      return res.data;
    } catch (error) {
      // Capturar a mensagem de erro da resposta da API
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
export const createContrato = createAsyncThunk(
  'contratos/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await CreateContratoService.handle(data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao criar contrato';

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
export const updateContrato = createAsyncThunk(
  'contratos/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateContratoService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar contrato';

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
export const deleteContrato = createAsyncThunk(
  'contratos/delete',
  async (id, { rejectWithValue }) => {
    try {
      await DeleteContratoService.handle(id);
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao deletar contrato';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// CREATE MANY AULAS
export const createManyAulas = createAsyncThunk(
  'contratos/createManyAulas',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await CreateManyAulasService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Erro ao criar aulas';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// CREATE MANY DIAS AULAS
export const createManyDiasAulas = createAsyncThunk(
  'contratos/createManyDiasAulas',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await CreateManyDiasAulasService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao criar dias de aula';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// GENERATE AULAS
export const generateAulas = createAsyncThunk(
  'contratos/generateAulas',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await GenerateAulasService.handle({ data });
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Erro ao gerar aulas';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// GET AULAS BY CONTRATO
export const getAulasByContrato = createAsyncThunk(
  'contratos/getAulasByContrato',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetAulasByContratoService.handle(id);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao buscar aulas';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// GET DIAS AULAS BY CONTRATO
export const getDiasAulasByContrato = createAsyncThunk(
  'contratos/getDiasAulasByContrato',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetDiasAulasByContratoService.handle(id);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao buscar dias de aula';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// VALIDATE CONTRATO
export const validateContrato = createAsyncThunk(
  'contratos/validateContrato',
  async (id, { rejectWithValue }) => {
    try {
      const res = await ValidateContratoService.handle(id);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao validar contrato';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

const contratosSlice = createSlice({
  name: 'contratos',
  initialState: {
    list: [],
    current: null,
    extra: null,
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
    clearExtra: state => {
      state.extra = null;
    },
  },
  extraReducers: builder => {
    builder
      // getContratos
      .addCase(getContratos.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.list = [];
        state.message = null;
        state.statusError = null;
        state.action = 'getContratos';
      })
      .addCase(getContratos.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.list = action.payload.data;
        state.count = action.payload.count;
        state.message = action.payload.message;
      })
      .addCase(getContratos.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // getContrato
      .addCase(getContrato.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.statusError = null;
        state.action = 'getContrato';
      })
      .addCase(getContrato.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
      })
      .addCase(getContrato.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // createContrato
      .addCase(createContrato.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createContrato';
      })
      .addCase(createContrato.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (!Array.isArray(state.list)) state.list = [];
        state.list.push(action.payload);
        state.count = (state.count || 0) + 1;
      })
      .addCase(createContrato.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao criar contrato';
        state.statusError = action.payload.statusError;
      })
      // updateContrato
      .addCase(updateContrato.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateContrato';
      })
      .addCase(updateContrato.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (Array.isArray(state.list)) {
          state.list = state.list.map(item =>
            item && item.id === action.payload.id ? action.payload : item
          );
        }
      })
      .addCase(updateContrato.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao atualizar contrato';
        state.statusError = action.payload.statusError;
      })
      // deleteContrato
      .addCase(deleteContrato.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'deleteContrato';
      })
      .addCase(deleteContrato.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        // Remove o contrato da lista e atualiza o contador
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
      .addCase(deleteContrato.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao deletar contrato';
        state.statusError = action.payload.statusError;
      })
      // createManyAulas
      .addCase(createManyAulas.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.extra = null;
        state.statusError = null;
        state.action = 'createManyAulas';
      })
      .addCase(createManyAulas.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.extra = action.payload;
      })
      .addCase(createManyAulas.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao criar aulas';
        state.statusError = action.payload.statusError;
      })
      // createManyDiasAulas
      .addCase(createManyDiasAulas.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.extra = null;
        state.statusError = null;
        state.action = 'createManyDiasAulas';
      })
      .addCase(createManyDiasAulas.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.extra = action.payload;
      })
      .addCase(createManyDiasAulas.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao criar dias de aula';
        state.statusError = action.payload.statusError;
      })
      // generateAulas
      .addCase(generateAulas.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.extra = null;
        state.statusError = null;
        state.action = 'generateAulas';
      })
      .addCase(generateAulas.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.extra = action.payload;
      })
      .addCase(generateAulas.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao gerar aulas';
        state.statusError = action.payload.statusError;
      })
      // getAulasByContrato
      .addCase(getAulasByContrato.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.extra = null;
        state.statusError = null;
        state.action = 'getAulasByContrato';
      })
      .addCase(getAulasByContrato.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.extra = action.payload;
      })
      .addCase(getAulasByContrato.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao buscar aulas';
        state.statusError = action.payload.statusError;
      })
      // getDiasAulasByContrato
      .addCase(getDiasAulasByContrato.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.extra = null;
        state.statusError = null;
        state.action = 'getDiasAulasByContrato';
      })
      .addCase(getDiasAulasByContrato.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.extra = action.payload;
      })
      .addCase(getDiasAulasByContrato.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao buscar dias de aula';
        state.statusError = action.payload.statusError;
      })
      // validateContrato
      .addCase(validateContrato.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.statusError = null;
        state.action = 'validateContrato';
      })
      .addCase(validateContrato.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
      })
      .addCase(validateContrato.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao validar contrato';
        state.statusError = action.payload.statusError;
      });
  },
});

export const clearErrors = contratosSlice.actions.clearErrors;
export const clearStatus = contratosSlice.actions.clearStatus;
export const clearCurrent = contratosSlice.actions.clearCurrent;
export const clearExtra = contratosSlice.actions.clearExtra;
export default contratosSlice.reducer;
