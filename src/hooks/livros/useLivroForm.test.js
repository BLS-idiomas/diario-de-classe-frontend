import { renderHook, act } from '@testing-library/react';
import { useLivroForm } from './useLivroForm';

const evento = (name, value, type = 'text', checked) => ({
  target: { name, value, type, checked },
});

describe('useLivroForm', () => {
  const livros = [
    { idioma: 'INGLES', nivel: 1 },
    { idioma: 'INGLES', nivel: 2 },
    { idioma: 'ESPANHOL', nivel: 5 },
  ];

  describe('defaults na criação', () => {
    it('já vem com inglês selecionado', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livros })
      );

      expect(result.current.formData.idioma).toBe('INGLES');
    });

    it('sugere o próximo nível da trilha do idioma', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livros })
      );

      expect(result.current.formData.nivel).toBe(3);
    });

    it('sugere 1 quando o catálogo está vazio', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livros: [] })
      );

      expect(result.current.formData.nivel).toBe(1);
    });

    it('nasce ativo', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livros })
      );

      expect(result.current.formData.ativo).toBe(true);
    });

    it('ressugere o nível ao trocar o idioma', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livros })
      );

      act(() => result.current.handleChange(evento('idioma', 'ESPANHOL')));

      expect(result.current.formData.nivel).toBe(6);
    });

    it('não sobrescreve o nível que o usuário digitou à mão', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livros })
      );

      act(() => result.current.handleChange(evento('nivel', '9')));
      act(() => result.current.handleChange(evento('idioma', 'ESPANHOL')));

      expect(result.current.formData.nivel).toBe('9');
    });
  });

  describe('edição', () => {
    const livro = {
      nome: 'New Interchange 1',
      idioma: 'ESPANHOL',
      nivel: 4,
      ativo: false,
    };

    it('usa os valores do livro como estado inicial', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livro, livros, id: 'livro-1' })
      );

      expect(result.current.formData).toEqual({
        nome: 'New Interchange 1',
        idioma: 'ESPANHOL',
        nivel: 4,
        ativo: false,
      });
    });

    it('não ressugere o nível ao trocar o idioma', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livro, livros, id: 'livro-1' })
      );

      act(() => result.current.handleChange(evento('idioma', 'INGLES')));

      expect(result.current.formData.nivel).toBe(4);
    });

    it('trata livro sem nível como campo vazio', () => {
      const { result } = renderHook(() =>
        useLivroForm({
          submit: jest.fn(),
          livro: { ...livro, nivel: null },
          livros,
        })
      );

      expect(result.current.formData.nivel).toBe('');
    });
  });

  describe('handleChange', () => {
    it('atualiza campo de texto por name', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livros })
      );

      act(() => result.current.handleChange(evento('nome', 'Livro X')));

      expect(result.current.formData.nome).toBe('Livro X');
    });

    it('usa checked em checkbox', () => {
      const { result } = renderHook(() =>
        useLivroForm({ submit: jest.fn(), livros })
      );

      act(() =>
        result.current.handleChange(evento('ativo', 'on', 'checkbox', false))
      );

      expect(result.current.formData.ativo).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    const submeter = async (hook, preventDefault = jest.fn()) => {
      await act(async () => {
        await hook.current.handleSubmit({ preventDefault });
      });
      return preventDefault;
    };

    it('faz preventDefault e envia o id', async () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useLivroForm({ submit, livros, id: 'livro-1' })
      );

      const preventDefault = await submeter(result);

      expect(preventDefault).toHaveBeenCalled();
      expect(submit).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'livro-1' })
      );
    });

    it('converte o nível para número', async () => {
      const submit = jest.fn();
      const { result } = renderHook(() => useLivroForm({ submit, livros }));

      act(() => result.current.handleChange(evento('nivel', '7')));
      await submeter(result);

      expect(submit.mock.calls[0][0].dataToSend.nivel).toBe(7);
    });

    it('manda null quando o nível é apagado, para permitir limpar o campo', async () => {
      // Regressão: mandava `undefined`, que o JSON descarta; o backend tratava
      // o campo como ausente e o nível antigo permanecia gravado.
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useLivroForm({
          submit,
          livros,
          livro: { nome: 'X', idioma: 'INGLES', nivel: 4, ativo: true },
        })
      );

      act(() => result.current.handleChange(evento('nivel', '')));
      await submeter(result);

      const enviado = submit.mock.calls[0][0].dataToSend;
      expect(enviado.nivel).toBeNull();
      expect('nivel' in enviado).toBe(true);
    });
  });
});
