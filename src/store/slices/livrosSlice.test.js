import reducer, {
  getLivros,
  getLivro,
  createConteudo,
  updateConteudo,
  deleteConteudo,
  deleteLivro,
} from './livrosSlice';
import { STATUS } from '@/constants';

const estadoInicial = reducer(undefined, { type: '@@INIT' });

const conteudo = (id, ordem) => ({
  id,
  ordem,
  titulo: `Unit ${ordem}`,
  descricao: null,
});

describe('livrosSlice', () => {
  it('começa com listas vazias', () => {
    expect(estadoInicial.list).toEqual([]);
    expect(estadoInicial.conteudos).toEqual([]);
    expect(estadoInicial.current).toBeNull();
    expect(estadoInicial.status).toBe(STATUS.IDLE);
  });

  describe('getLivros', () => {
    it('preenche a lista e a contagem', () => {
      const state = reducer(estadoInicial, {
        type: getLivros.fulfilled.type,
        payload: { count: 1, data: [{ id: 'livro-1', nome: 'Interchange' }] },
      });

      expect(state.status).toBe(STATUS.SUCCESS);
      expect(state.list).toHaveLength(1);
      expect(state.count).toBe(1);
    });

    it('mantém a lista como array no 204 sem corpo', () => {
      const state = reducer(estadoInicial, {
        type: getLivros.fulfilled.type,
        payload: '',
      });

      expect(state.list).toEqual([]);
      expect(state.count).toBe(0);
    });
  });

  describe('getLivro', () => {
    it('extrai os conteúdos que vêm junto do livro', () => {
      const state = reducer(estadoInicial, {
        type: getLivro.fulfilled.type,
        payload: {
          id: 'livro-1',
          nome: 'Interchange',
          conteudos: [conteudo('c-1', 1), conteudo('c-2', 2)],
        },
      });

      expect(state.current.id).toBe('livro-1');
      expect(state.conteudos).toHaveLength(2);
    });

    it('deixa conteúdos vazios quando o livro vem sem eles', () => {
      const state = reducer(estadoInicial, {
        type: getLivro.fulfilled.type,
        payload: { id: 'livro-1', nome: 'Interchange' },
      });

      expect(state.conteudos).toEqual([]);
    });
  });

  describe('createConteudo', () => {
    it('insere o conteúdo novo mantendo a ordem do livro', () => {
      const comConteudos = {
        ...estadoInicial,
        conteudos: [conteudo('c-1', 1), conteudo('c-3', 3)],
      };

      const state = reducer(comConteudos, {
        type: createConteudo.fulfilled.type,
        payload: conteudo('c-2', 2),
      });

      expect(state.conteudos.map(c => c.ordem)).toEqual([1, 2, 3]);
    });
  });

  describe('updateConteudo', () => {
    it('substitui o conteúdo e reordena', () => {
      const comConteudos = {
        ...estadoInicial,
        conteudos: [conteudo('c-1', 1), conteudo('c-2', 2)],
      };

      const state = reducer(comConteudos, {
        type: updateConteudo.fulfilled.type,
        payload: { ...conteudo('c-1', 5), titulo: 'Revisão' },
      });

      expect(state.conteudos.map(c => c.ordem)).toEqual([2, 5]);
      expect(state.conteudos.find(c => c.id === 'c-1').titulo).toBe('Revisão');
    });
  });

  describe('deleteConteudo', () => {
    it('remove o conteúdo pelo id', () => {
      const comConteudos = {
        ...estadoInicial,
        conteudos: [conteudo('c-1', 1), conteudo('c-2', 2)],
      };

      const state = reducer(comConteudos, {
        type: deleteConteudo.fulfilled.type,
        payload: 'c-1',
      });

      expect(state.conteudos.map(c => c.id)).toEqual(['c-2']);
    });
  });

  describe('deleteLivro', () => {
    it('remove o livro da lista e atualiza a contagem', () => {
      const comLista = {
        ...estadoInicial,
        list: [{ id: 'livro-1' }, { id: 'livro-2' }],
        count: 2,
      };

      const state = reducer(comLista, {
        type: deleteLivro.fulfilled.type,
        payload: 'livro-1',
      });

      expect(state.list.map(l => l.id)).toEqual(['livro-2']);
      expect(state.count).toBe(1);
    });
  });
});
