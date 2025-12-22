'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetDiaAulaListService } from '@/services/diaAula/getDiaAulaListService';
import { GetDiaAulaByIdService } from '@/services/diaAula/getDiaAulaByIdService';
import { CreateDiaAulaService } from '@/services/diaAula/createDiaAulaService';
import { UpdateDiaAulaService } from '@/services/diaAula/updateDiaAulaService';
import { DeleteDiaAulaService } from '@/services/diaAula/deleteDiaAulaService';
import { CreateGroupDiaAulaService } from '@/services/diaAula/createGroupDiaAulaService';
import { UpdateGroupDiaAulaService } from '@/services/diaAula/updateGroupDiaAulaService';

// GET ALL
export const getDiasAulas = createAsyncThunk(
  'diasAulas/getAll',
  async (searchParam = null, { rejectWithValue }) => {
    try {
      const res = await GetDiaAulaListService.handle(searchParam);
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
export const getDiaAula = createAsyncThunk(
  'diasAulas/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetDiaAulaByIdService.handle(id);
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
export const createDiaAula = createAsyncThunk(
  'diasAulas/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await CreateDiaAulaService.handle(data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao criar dia de aula';

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
export const updateDiaAula = createAsyncThunk(
  'diasAulas/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateDiaAulaService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar dia de aula';

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
export const deleteDiaAula = createAsyncThunk(
  'diasAulas/delete',
  async (id, { rejectWithValue }) => {
    try {
      await DeleteDiaAulaService.handle(id);
      return id;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao deletar dia de aula';
      return rejectWithValue({
        message: errorMessage,
        statusError: error.response?.status,
      });
    }
  }
);

// CREATE GROUP
export const createGroupDiaAula = createAsyncThunk(
  'diasAulas/createGroup',
  async (data, { rejectWithValue }) => {
    try {
      const res = await CreateGroupDiaAulaService.handle(data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao criar dias de aula em grupo';

      const validationErrors = error.response?.data?.errors || [];

      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
        statusError: error.response?.status,
      });
    }
  }
);

// UPDATE GROUP
export const updateGroupDiaAula = createAsyncThunk(
  'diasAulas/updateGroup',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateGroupDiaAulaService.handle(id, data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar dias de aula em grupo';

      const validationErrors = error.response?.data?.errors || [];

      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
        statusError: error.response?.status,
      });
    }
  }
);

const diasAulasSlice = createSlice({
  name: 'diasAulas',
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
      // getDiasAulas
      .addCase(getDiasAulas.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.list = [];
        state.message = null;
        state.statusError = null;
        state.action = 'getDiasAulas';
      })
      .addCase(getDiasAulas.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.list = action.payload.data;
        state.count = action.payload.count;
        state.message = action.payload.message;
      })
      .addCase(getDiasAulas.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // getDiaAula
      .addCase(getDiaAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.statusError = null;
        state.action = 'getDiaAula';
      })
      .addCase(getDiaAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
      })
      .addCase(getDiaAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.error;
        state.message = action.payload.message;
        state.statusError = action.payload.statusError;
      })
      // createDiaAula
      .addCase(createDiaAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createDiaAula';
      })
      .addCase(createDiaAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (!Array.isArray(state.list)) state.list = [];
        state.list.push(action.payload);
        state.count = (state.count || 0) + 1;
      })
      .addCase(createDiaAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao criar dia de aula';
        state.statusError = action.payload.statusError;
      })
      // updateDiaAula
      .addCase(updateDiaAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateDiaAula';
      })
      .addCase(updateDiaAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
        if (Array.isArray(state.list)) {
          state.list = state.list.map(item =>
            item && item.id === action.payload.id ? action.payload : item
          );
        }
      })
      .addCase(updateDiaAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao atualizar dia de aula';
        state.statusError = action.payload.statusError;
      })
      // deleteDiaAula
      .addCase(deleteDiaAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'deleteDiaAula';
      })
      .addCase(deleteDiaAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        // Remove o dia de aula da lista e atualiza o contador
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
      .addCase(deleteDiaAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao deletar dia de aula';
        state.statusError = action.payload.statusError;
      })
      // createGroupDiaAula
      .addCase(createGroupDiaAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createGroupDiaAula';
      })
      .addCase(createGroupDiaAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        // action.payload é um array de dias de aula criados
        if (Array.isArray(action.payload)) {
          if (!Array.isArray(state.list)) state.list = [];
          state.list.push(...action.payload);
          state.count = (state.count || 0) + action.payload.length;
        }
      })
      .addCase(createGroupDiaAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao criar dias de aula em grupo';
        state.statusError = action.payload.statusError;
      })
      // updateGroupDiaAula
      .addCase(updateGroupDiaAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateGroupDiaAula';
      })
      .addCase(updateGroupDiaAula.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        // action.payload é um array de dias de aula atualizados
        if (Array.isArray(action.payload) && Array.isArray(state.list)) {
          // Atualizar cada item na lista
          action.payload.forEach(updatedItem => {
            const index = state.list.findIndex(
              item => item && item.id === updatedItem.id
            );
            if (index !== -1) {
              state.list[index] = updatedItem;
            }
          });
        }
      })
      .addCase(updateGroupDiaAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message =
          action.payload?.message || 'Erro ao atualizar dias de aula em grupo';
        state.statusError = action.payload.statusError;
      });
  },
});

export const clearErrors = diasAulasSlice.actions.clearErrors;
export const clearStatus = diasAulasSlice.actions.clearStatus;
export const clearCurrent = diasAulasSlice.actions.clearCurrent;
export default diasAulasSlice.reducer;
