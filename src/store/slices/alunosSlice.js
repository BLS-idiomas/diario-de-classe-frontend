'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetAlunoListService } from '@/services/aluno/getAlunoListService';
import { GetAlunoByIdService } from '@/services/aluno/getAlunoByIdService';
import { CreateAlunoService } from '@/services/aluno/createAlunoService';
import { UpdateAlunoService } from '@/services/aluno/updateAlunoService';
import { DeleteAlunoService } from '@/services/aluno/deleteAlunoService';

// GET ALL
export const getAlunos = createAsyncThunk(
  'alunos/getAll',
  async (searchParam = null, { rejectWithValue }) => {
    try {
      const res = await GetAlunoListService.handle(searchParam);
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
export const getAluno = createAsyncThunk(
  'alunos/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetAlunoByIdService.handle(id);
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
export const createAluno = createAsyncThunk(
  'alunos/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await CreateAlunoService.handle(data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Erro ao criar aluno';

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
export const updateAluno = createAsyncThunk(
  'alunos/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateAlunoService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar aluno';

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
export const deleteAluno = createAsyncThunk(
  'alunos/delete',
  async (id, { rejectWithValue }) => {
    try {
      await DeleteAlunoService.handle(id);
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao deletar aluno';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

const alunosSlice = createSlice({
  name: 'alunos',
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
      // getAlunos
      .addCase(getAlunos.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.list = [];
        state.message = null;
        state.statusError = null;
        state.action = 'getAlunos';
      })
      .addCase(getAlunos.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.list = action.payload.data;
        state.count = action.payload.count;
        state.message = action.payload.message;
      })
      .addCase(getAlunos.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // getAluno
      .addCase(getAluno.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.statusError = null;
        state.action = 'getAluno';
      })
      .addCase(getAluno.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
      })
      .addCase(getAluno.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // createAluno
      .addCase(createAluno.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createAluno';
      })
      .addCase(createAluno.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (!Array.isArray(state.list)) state.list = [];
        state.list.push(action.payload);
        state.count = (state.count || 0) + 1;
      })
      .addCase(createAluno.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao criar aluno';
        state.statusError = action.payload.statusError;
      })
      // updateAluno
      .addCase(updateAluno.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateAluno';
      })
      .addCase(updateAluno.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (Array.isArray(state.list)) {
          state.list = state.list.map(item =>
            item && item.id === action.payload.id ? action.payload : item
          );
        }
      })
      .addCase(updateAluno.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao atualizar aluno';
        state.statusError = action.payload.statusError;
      })
      // deleteAluno
      .addCase(deleteAluno.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'deleteAluno';
      })
      .addCase(deleteAluno.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        // Remove o aluno da lista e atualiza o contador
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
      .addCase(deleteAluno.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao deletar aluno';
        state.statusError = action.payload.statusError;
      });
  },
});

export const clearErrors = alunosSlice.actions.clearErrors;
export const clearStatus = alunosSlice.actions.clearStatus;
export const clearCurrent = alunosSlice.actions.clearCurrent;
export default alunosSlice.reducer;
