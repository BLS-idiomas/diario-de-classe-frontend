'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetLivroListService } from '@/services/livro/getLivroListService';
import { GetLivroByIdService } from '@/services/livro/getLivroByIdService';
import { CreateLivroService } from '@/services/livro/createLivroService';
import { UpdateLivroService } from '@/services/livro/updateLivroService';
import { DeleteLivroService } from '@/services/livro/deleteLivroService';
import { CreateConteudoLivroService } from '@/services/livro/createConteudoLivroService';
import { UploadConteudosLivroService } from '@/services/livro/uploadConteudosLivroService';
import { UpdateConteudoLivroService } from '@/services/conteudoLivro/updateConteudoLivroService';
import { DeleteConteudoLivroService } from '@/services/conteudoLivro/deleteConteudoLivroService';
import { thunkErrorPayload } from '@/utils/thunkErrorPayload';

// GET ALL
export const getLivros = createAsyncThunk(
  'livros/getAll',
  async (searchParam = null, { rejectWithValue }) => {
    try {
      const res = await GetLivroListService.handle(searchParam);
      return res.data;
    } catch (error) {
      return rejectWithValue(thunkErrorPayload(error, 'Erro ao buscar livros'));
    }
  }
);

// GET ONE
export const getLivro = createAsyncThunk(
  'livros/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await GetLivroByIdService.handle(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(thunkErrorPayload(error, 'Erro ao buscar livro'));
    }
  }
);

// CREATE
export const createLivro = createAsyncThunk(
  'livros/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await CreateLivroService.handle(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(thunkErrorPayload(error, 'Erro ao criar livro'));
    }
  }
);

// UPDATE
export const updateLivro = createAsyncThunk(
  'livros/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateLivroService.handle(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        thunkErrorPayload(error, 'Erro ao atualizar livro')
      );
    }
  }
);

// DELETE
export const deleteLivro = createAsyncThunk(
  'livros/delete',
  async (id, { rejectWithValue }) => {
    try {
      await DeleteLivroService.handle(id);
      return id;
    } catch (error) {
      return rejectWithValue(thunkErrorPayload(error, 'Erro ao deletar livro'));
    }
  }
);

// CREATE CONTEUDO
export const createConteudo = createAsyncThunk(
  'livros/createConteudo',
  async ({ idLivro, data }, { rejectWithValue }) => {
    try {
      const res = await CreateConteudoLivroService.handle(idLivro, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        thunkErrorPayload(error, 'Erro ao criar conteúdo')
      );
    }
  }
);

// UPDATE CONTEUDO
export const updateConteudo = createAsyncThunk(
  'livros/updateConteudo',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await UpdateConteudoLivroService.handle(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        thunkErrorPayload(error, 'Erro ao atualizar conteúdo')
      );
    }
  }
);

// DELETE CONTEUDO
export const deleteConteudo = createAsyncThunk(
  'livros/deleteConteudo',
  async (id, { rejectWithValue }) => {
    try {
      await DeleteConteudoLivroService.handle(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        thunkErrorPayload(error, 'Erro ao deletar conteúdo')
      );
    }
  }
);

// UPLOAD CONTEUDOS
export const uploadConteudos = createAsyncThunk(
  'livros/uploadConteudos',
  async ({ idLivro, file }, { rejectWithValue }) => {
    try {
      const res = await UploadConteudosLivroService.handle(idLivro, file);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        thunkErrorPayload(error, 'Erro ao importar conteúdos da planilha')
      );
    }
  }
);

const livrosSlice = createSlice({
  name: 'livros',
  initialState: {
    list: [],
    current: null,
    conteudos: [],
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
      state.conteudos = [];
    },
  },
  extraReducers: builder => {
    builder
      // getLivros
      .addCase(getLivros.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.list = [];
        state.message = null;
        state.statusError = null;
        state.action = 'getLivros';
      })
      .addCase(getLivros.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        // O backend responde 204 sem corpo quando não há livros; nesse caso o
        // payload chega vazio e a lista precisa continuar sendo um array.
        state.list = action.payload?.data || [];
        state.count = action.payload?.count || 0;
      })
      .addCase(getLivros.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // getLivro
      .addCase(getLivro.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.current = null;
        state.statusError = null;
        state.action = 'getLivro';
      })
      .addCase(getLivro.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload || null;
        state.conteudos = action.payload?.conteudos || [];
      })
      .addCase(getLivro.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // createLivro
      .addCase(createLivro.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createLivro';
      })
      .addCase(createLivro.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
      })
      .addCase(createLivro.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // updateLivro
      .addCase(updateLivro.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateLivro';
      })
      .addCase(updateLivro.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.current = action.payload;
      })
      .addCase(updateLivro.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // deleteLivro
      .addCase(deleteLivro.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'deleteLivro';
      })
      .addCase(deleteLivro.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.list = state.list.filter(livro => livro.id !== action.payload);
        state.count = state.list.length;
      })
      .addCase(deleteLivro.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // createConteudo
      .addCase(createConteudo.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createConteudo';
      })
      .addCase(createConteudo.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.conteudos = [...state.conteudos, action.payload].sort(
          (a, b) => a.ordem - b.ordem
        );
      })
      .addCase(createConteudo.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // updateConteudo
      .addCase(updateConteudo.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateConteudo';
      })
      .addCase(updateConteudo.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.conteudos = state.conteudos
          .map(conteudo =>
            conteudo.id === action.payload.id ? action.payload : conteudo
          )
          .sort((a, b) => a.ordem - b.ordem);
      })
      .addCase(updateConteudo.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // deleteConteudo
      .addCase(deleteConteudo.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'deleteConteudo';
      })
      .addCase(deleteConteudo.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.conteudos = state.conteudos.filter(
          conteudo => conteudo.id !== action.payload
        );
      })
      .addCase(deleteConteudo.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // uploadConteudos
      .addCase(uploadConteudos.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'uploadConteudos';
      })
      .addCase(uploadConteudos.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.conteudos = action.payload?.data || [];
        // `count` é o total de livros da listagem: gravar aqui a contagem de
        // conteúdos importados deixava o número errado para quem lesse depois.
      })
      .addCase(uploadConteudos.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      });
  },
});

export const { clearErrors, clearStatus, clearCurrent } = livrosSlice.actions;

export default livrosSlice.reducer;
