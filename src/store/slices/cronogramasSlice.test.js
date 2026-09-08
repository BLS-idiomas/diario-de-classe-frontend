import reducer, { clearCronograma, getCronograma } from './cronogramasSlice';
import { STATUS } from '@/constants';

const estadoInicial = reducer(undefined, { type: '@@INIT' });

describe('cronogramasSlice', () => {
  it('começa sem cronograma e com listas vazias', () => {
    expect(estadoInicial.cronograma).toBeNull();
    expect(estadoInicial.linhas).toEqual([]);
    expect(estadoInicial.conteudosNaoAgendados).toEqual([]);
    expect(estadoInicial.resumo).toBeNull();
    expect(estadoInicial.status).toBe(STATUS.IDLE);
  });

  describe('getCronograma', () => {
    it('preenche a projeção quando o aluno tem livro em curso', () => {
      const payload = {
        cronograma: { id: 'cron-1', livro: { nome: 'New Interchange 1' } },
        linhas: [{ idAula: 'aula-1', ordem: 1, titulo: 'Unit 1' }],
        conteudosNaoAgendados: [{ id: 'conteudo-9', ordem: 9 }],
        resumo: { totalConteudos: 9, conteudosVinculados: 1 },
      };

      const state = reducer(estadoInicial, {
        type: getCronograma.fulfilled.type,
        payload,
      });

      expect(state.status).toBe(STATUS.SUCCESS);
      expect(state.cronograma).toEqual(payload.cronograma);
      expect(state.linhas).toHaveLength(1);
      expect(state.conteudosNaoAgendados).toHaveLength(1);
      expect(state.resumo.totalConteudos).toBe(9);
    });

    it('trata o 204 sem corpo como aluno ainda não matriculado, e não como erro', () => {
      // O backend responde 204 quando não há livro em curso; o axios entrega
      // string vazia em res.data.
      const state = reducer(estadoInicial, {
        type: getCronograma.fulfilled.type,
        payload: '',
      });

      expect(state.status).toBe(STATUS.SUCCESS);
      expect(state.cronograma).toBeNull();
      expect(state.linhas).toEqual([]);
      expect(state.conteudosNaoAgendados).toEqual([]);
      expect(state.resumo).toBeNull();
    });

    it('guarda a mensagem e o status http quando falha', () => {
      const state = reducer(estadoInicial, {
        type: getCronograma.rejected.type,
        payload: { message: 'Aluno não encontrado', statusError: 404 },
      });

      expect(state.status).toBe(STATUS.FAILED);
      expect(state.message).toBe('Aluno não encontrado');
      expect(state.statusError).toBe(404);
    });

    it('não quebra quando a rejeição vem sem payload', () => {
      const state = reducer(estadoInicial, {
        type: getCronograma.rejected.type,
      });

      expect(state.status).toBe(STATUS.FAILED);
      expect(state.errors).toEqual([]);
    });
  });

  describe('clearCronograma', () => {
    it('limpa a projeção carregada', () => {
      const comDados = reducer(estadoInicial, {
        type: getCronograma.fulfilled.type,
        payload: {
          cronograma: { id: 'cron-1' },
          linhas: [{ idAula: 'aula-1' }],
          conteudosNaoAgendados: [{ id: 'c-1' }],
          resumo: { totalConteudos: 1 },
        },
      });

      const state = reducer(comDados, clearCronograma());

      expect(state.cronograma).toBeNull();
      expect(state.linhas).toEqual([]);
      expect(state.conteudosNaoAgendados).toEqual([]);
      expect(state.resumo).toBeNull();
    });
  });
});
