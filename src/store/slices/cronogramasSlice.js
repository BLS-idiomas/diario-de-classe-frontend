'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetCronogramaByAlunoService } from '@/services/cronograma/getCronogramaByAlunoService';
import { CreateCronogramaService } from '@/services/cronograma/createCronogramaService';
import { UpdateConteudoAulaService } from '@/services/aula/updateConteudoAulaService';
import { thunkErrorPayload } from '@/utils/thunkErrorPayload';

// GET PROJEÇÃO (a "planilha" do aluno)
export const getCronograma = createAsyncThunk(
  'cronogramas/getByAluno',
  async (idAluno, { rejectWithValue }) => {
    try {
      const res = await GetCronogramaByAlunoService.handle(idAluno);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        thunkErrorPayload(error, 'Erro ao buscar cronograma')
      );
    }
  }
);

// CREATE (matricular o aluno em um livro)
export const createCronograma = createAsyncThunk(
  'cronogramas/create',
  async ({ idAluno, data }, { rejectWithValue }) => {
    try {
      const res = await CreateCronogramaService.handle(idAluno, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        thunkErrorPayload(error, 'Erro ao criar cronograma')
      );
    }
  }
);

// LANÇAR CONTEÚDO EM UMA AULA
export const updateConteudoAula = createAsyncThunk(
  'cronogramas/updateConteudoAula',
  async ({ idAula, idConteudo }, { rejectWithValue }) => {
    try {
      const res = await UpdateConteudoAulaService.handle(idAula, idConteudo);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        thunkErrorPayload(error, 'Erro ao lançar o conteúdo da aula')
      );
    }
  }
);

const cronogramasSlice = createSlice({
  name: 'cronogramas',
  initialState: {
    cronograma: null,
    linhas: [],
    conteudosNaoAgendados: [],
    resumo: null,
    status: STATUS.IDLE,
    statusError: null,
    action: null,
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
    clearCronograma: state => {
      state.cronograma = null;
      state.linhas = [];
      state.conteudosNaoAgendados = [];
      state.resumo = null;
    },
  },
  extraReducers: builder => {
    builder
      // getCronograma
      .addCase(getCronograma.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'getCronograma';
      })
      .addCase(getCronograma.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        // Aluno sem livro em curso: o backend responde 204 sem corpo. Não é
        // erro, é o estado inicial antes da matrícula.
        state.cronograma = action.payload?.cronograma || null;
        state.linhas = action.payload?.linhas || [];
        state.conteudosNaoAgendados =
          action.payload?.conteudosNaoAgendados || [];
        state.resumo = action.payload?.resumo || null;
      })
      .addCase(getCronograma.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // createCronograma
      .addCase(createCronograma.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'createCronograma';
      })
      .addCase(createCronograma.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.cronograma = action.payload;
      })
      .addCase(createCronograma.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      })
      // updateConteudoAula
      .addCase(updateConteudoAula.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.statusError = null;
        state.action = 'updateConteudoAula';
      })
      .addCase(updateConteudoAula.fulfilled, state => {
        state.status = STATUS.SUCCESS;
        // O resequenciamento no servidor pode ter mexido em várias aulas, não
        // só nesta. Atualizar a linha localmente deixaria a tela divergente do
        // banco, então quem consome recarrega a projeção inteira.
      })
      .addCase(updateConteudoAula.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message;
        state.statusError = action.payload?.statusError;
      });
  },
});

export const { clearErrors, clearStatus, clearCronograma } =
  cronogramasSlice.actions;

export default cronogramasSlice.reducer;
