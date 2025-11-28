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
      return rejectWithValue({ message: errorMessage });
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
      return rejectWithValue({ message: errorMessage });
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
      return rejectWithValue({ message: errorMessage });
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
      return rejectWithValue({ message: errorMessage });
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
      return rejectWithValue({ message: errorMessage });
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
    loading: false,
    status: STATUS.IDLE,
    action: null,
    errors: [],
    message: null,
    count: 0,
  },
  reducers: {
    clearErrors: state => {
      state.errors = [];
      state.message = null;
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
        state.loading = true;
        state.errors = [];
        state.list = [];
        state.message = null;
        state.action = 'getProfessores';
      })
      .addCase(getProfessores.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.loading = false;
        state.list = action.payload.data;
        state.count = action.payload.count;
        state.message = action.payload.message;
      })
      .addCase(getProfessores.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.loading = false;
        state.errors = action.error;
        state.message = action.payload.message;
      })
      // getProfessor
      .addCase(getProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.loading = true;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.action = 'getProfessor';
      })
      .addCase(getProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.loading = false;
        state.errors = action.error;
        state.message = action.payload.message;
      })
      // createProfessor
      .addCase(createProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.loading = true;
        state.errors = [];
        state.message = null;
        state.action = 'createProfessor';
      })
      .addCase(createProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(createProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.loading = false;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao criar professor';
      })
      // updateProfessor
      .addCase(updateProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.loading = true;
        state.errors = [];
        state.message = null;
        state.action = 'updateProfessor';
      })
      .addCase(updateProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(updateProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.loading = false;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao atualizar professor';
      })
      // deleteProfessor
      .addCase(deleteProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.loading = true;
        state.errors = [];
        state.message = null;
        state.action = 'deleteProfessor';
      })
      .addCase(deleteProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.loading = false;
      })
      .addCase(deleteProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.loading = false;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao deletar professor';
      })
      // getAulasProfessor
      .addCase(getAulasProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.loading = true;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.aulas = [];
        state.action = 'getAulasProfessor';
      })
      .addCase(getAulasProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.loading = false;
        state.aulas = action.payload;
      })
      .addCase(getAulasProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.loading = false;
        state.errors = action.error;
        state.message = action.payload.message;
      })
      // getAlunosProfessor
      .addCase(getAlunosProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.loading = true;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.alunos = [];
        state.action = 'getAlunosProfessor';
      })
      .addCase(getAlunosProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.loading = false;
        state.alunos = action.payload;
      })
      .addCase(getAlunosProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.loading = false;
        state.errors = action.error;
        state.message = action.payload.message;
      })
      // updateDisponibilidadeProfessor
      .addCase(updateDisponibilidadeProfessor.pending, state => {
        state.status = STATUS.LOADING;
        state.loading = true;
        state.errors = [];
        state.message = null;
        state.action = 'updateDisponibilidadeProfessor';
      })
      .addCase(updateDisponibilidadeProfessor.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.loading = false;
        state.current.disponibilidades = action.payload;
      })
      .addCase(updateDisponibilidadeProfessor.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.loading = false;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message ||
          'Erro ao atualizar disponibilidade do professor';
      });
  },
});

export const clearErrors = professoresSlice.actions.clearErrors;
export const clearStatus = professoresSlice.actions.clearStatus;
export const clearCurrent = professoresSlice.actions.clearCurrent;
export default professoresSlice.reducer;
