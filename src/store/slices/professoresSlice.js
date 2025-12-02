'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetProfessorListService } from '@/services/professor/getProfessorListService';
import { GetProfessorByIdService } from '@/services/professor/getProfessorByIdService';
import { CreateProfessorService } from '@/services/professor/createProfessorService';
import { UpdateProfessorService } from '@/services/professor/updateProfessorService';
import { DeleteProfessorService } from '@/services/professor/deleteProfessorService';
import { GetAulasByProfessorService } from '@/services/professor/getAulasByProfessorService';
import { GetAlunosByProfessorService } from '@/services/professor/getAlunosByProfessorService';
import { UpdateDisponibilidadeProfessorService } from '@/services/professor/updateDisponibilidadeProfessorService';

// GET ALL
export const getProfessores = createAsyncThunk(
  'professores/getAll',
  async (searchParam = null, { rejectWithValue }) => {
    try {
      const res = await GetProfessorListService.handle(searchParam);
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
export const getProfessor = createAsyncThunk(
  'professores/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetProfessorByIdService.handle(id);
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
export const createProfessor = createAsyncThunk(
  'professores/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await CreateProfessorService.handle(data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao criar professor';

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
export const updateProfessor = createAsyncThunk(
  'professores/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateProfessorService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar professor';

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
export const deleteProfessor = createAsyncThunk(
  'professores/delete',
  async (id, { rejectWithValue }) => {
    try {
      await DeleteProfessorService.handle(id);
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao deletar professor';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// GET AULAS
export const getAulasProfessor = createAsyncThunk(
  'professores/getOne/aulas',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetAulasByProfessorService.handle(id);
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

// GET ALUNOS
export const getAlunosProfessor = createAsyncThunk(
  'professores/getOne/alunos',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetAlunosByProfessorService.handle(id);
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

// UPDATE DISPONIBILIDADE
export const updateDisponibilidadeProfessor = createAsyncThunk(
  'professores/update/disponibilidade',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateDisponibilidadeProfessorService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar professor';

      const validationErrors = error.response?.data?.errors || [];

      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
        statusError: error.response?.status,
      });
    }
  }
);

const professoresSlice = createSlice({
  name: 'professores',
  initialState: {
    list: [],
    aulas: [],
    alunos: [],
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
      // getProfessores
      .addCase(getProfessores.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.list = [];
        state.message = null;
        state.statusError = null;
        state.action = 'getProfessores';
      })
      .addCase(getProfessores.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.list = action.payload.data;
        state.count = action.payload.count;
        state.message = action.payload.message;
      })
      .addCase(getProfessores.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // getProfessor
      .addCase(getProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.statusError = null;
        state.action = 'getProfessor';
      })
      .addCase(getProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
      })
      .addCase(getProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // createProfessor
      .addCase(createProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createProfessor';
      })
      .addCase(createProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (!Array.isArray(state.list)) state.list = [];
        state.list.push(action.payload);
        state.count = (state.count || 0) + 1;
      })
      .addCase(createProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao criar professor';
        state.statusError = action.payload.statusError;
      })
      // updateProfessor
      .addCase(updateProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateProfessor';
      })
      .addCase(updateProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (Array.isArray(state.list)) {
          state.list = state.list.map(item =>
            item && item.id === action.payload.id ? action.payload : item
          );
        }
      })
      .addCase(updateProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao atualizar professor';
        state.statusError = action.payload.statusError;
      })
      // deleteProfessor
      .addCase(deleteProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'deleteProfessor';
      })
      .addCase(deleteProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        // Remove o professor da lista e atualiza o contador
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
      .addCase(deleteProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao deletar professor';
        state.statusError = action.payload.statusError;
      })
      // getAulasProfessor
      .addCase(getAulasProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.aulas = [];
        state.statusError = null;
        state.action = 'getAulasProfessor';
      })
      .addCase(getAulasProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.aulas = action.payload;
      })
      .addCase(getAulasProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // getAlunosProfessor
      .addCase(getAlunosProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.alunos = [];
        state.statusError = null;
        state.action = 'getAlunosProfessor';
      })
      .addCase(getAlunosProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.alunos = action.payload;
      })
      .addCase(getAlunosProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // updateDisponibilidadeProfessor
      .addCase(updateDisponibilidadeProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateDisponibilidadeProfessor';
      })
      .addCase(updateDisponibilidadeProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current.disponibilidades = action.payload;
      })
      .addCase(updateDisponibilidadeProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message ||
          'Erro ao atualizar disponibilidade do professor';
        state.statusError = action.payload.statusError;
      });
  },
});

export const clearErrors = professoresSlice.actions.clearErrors;
export const clearStatus = professoresSlice.actions.clearStatus;
export const clearCurrent = professoresSlice.actions.clearCurrent;
export default professoresSlice.reducer;
