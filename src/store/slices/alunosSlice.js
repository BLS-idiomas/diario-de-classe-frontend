'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetAlunoListService } from '@/services/aluno/getAlunoListService';
import { GetAlunoByIdService } from '@/services/aluno/getAlunoByIdService';
import { CreateAlunoService } from '@/services/aluno/createAlunoService';
import { UpdateAlunoService } from '@/services/aluno/updateAlunoService';
import { DeleteAlunoService } from '@/services/aluno/deleteAlunoService';
import { GetAulasByAlunoService } from '@/services/aluno/getAulasByAlunoService';
import { GetDiasAulasByAlunoService } from '@/services/aluno/getDiasAulasByAlunoService';
import { GetContratoByAlunoService } from '@/services/aluno/getContratoByAlunoService';
import { GetContratosByAlunoService } from '@/services/aluno/getContratosByAlunoService';
import { UploadAlunoListService } from '@/services/aluno/uploadAlunoListService';

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

// GET AULAS
export const getAulasAluno = createAsyncThunk(
  'alunos/getAulas',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetAulasByAlunoService.handle(id);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao buscar aulas do aluno';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// GET DIAS AULAS
export const getDiasAulasAluno = createAsyncThunk(
  'alunos/getDiasAulas',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetDiasAulasByAlunoService.handle(id);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao buscar dias de aulas do aluno';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// GET CONTRATO
export const getContratoAluno = createAsyncThunk(
  'alunos/getContrato',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetContratoByAlunoService.handle(id);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao buscar contrato do aluno';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// GET CONTRATOS
export const getContratosAluno = createAsyncThunk(
  'alunos/getContratos',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetContratosByAlunoService.handle(id);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao buscar contratos do aluno';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// UPLOAD LIST
export const uploadAlunos = createAsyncThunk(
  'alunos/upload',
  async (file, { rejectWithValue }) => {
    try {
      const res = await UploadAlunoListService.handle(file);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao fazer upload de alunos';

      const validationErrors = error.response?.data?.errors || [];

      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
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
    aulas: [],
    diasAulas: [],
    contratos: [],
    contrato: null,
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
      })
      // getAulasAluno
      .addCase(getAulasAluno.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.aulas = [];
        state.statusError = null;
        state.action = 'getAulasAluno';
      })
      .addCase(getAulasAluno.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.aulas = action.payload || [];
      })
      .addCase(getAulasAluno.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload?.message || 'Erro ao buscar aulas';
        state.statusError = action.payload?.statusError;
      })
      // getDiasAulasAluno
      .addCase(getDiasAulasAluno.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.diasAulas = [];
        state.statusError = null;
        state.action = 'getDiasAulasAluno';
      })
      .addCase(getDiasAulasAluno.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.diasAulas = action.payload || [];
      })
      .addCase(getDiasAulasAluno.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message =
          action.payload?.message || 'Erro ao buscar dias de aulas';
        state.statusError = action.payload?.statusError;
      })
      // getContratoAluno
      .addCase(getContratoAluno.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.contrato = null;
        state.statusError = null;
        state.action = 'getContratoAluno';
      })
      .addCase(getContratoAluno.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.contrato = action.payload || null;
      })
      .addCase(getContratoAluno.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload?.message || 'Erro ao buscar contrato';
        state.statusError = action.payload?.statusError;
      })
      //getContratosAluno
      .addCase(getContratosAluno.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.contratos = [];
        state.statusError = null;
        state.action = 'getContratosAluno';
      })
      .addCase(getContratosAluno.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.contratos = action.payload || [];
      })
      .addCase(getContratosAluno.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload?.message || 'Erro ao buscar contratos';
        state.statusError = action.payload?.statusError;
      })
      // uploadAlunos
      .addCase(uploadAlunos.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'uploadAlunos';
      })
      .addCase(uploadAlunos.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.list = action.payload.data;
        state.count = action.payload.count;
        state.message = action.payload.message;
      })
      .addCase(uploadAlunos.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao fazer upload de alunos';
        state.statusError = action.payload.statusError;
      });
  },
});

export const clearErrors = alunosSlice.actions.clearErrors;
export const clearStatus = alunosSlice.actions.clearStatus;
export const clearCurrent = alunosSlice.actions.clearCurrent;
export default alunosSlice.reducer;
