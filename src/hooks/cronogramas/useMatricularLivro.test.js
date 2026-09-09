import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useToast } from '@/providers/ToastProvider';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useMatricularLivro } from './useMatricularLivro';
import { createCronograma } from '@/store/slices/cronogramasSlice';
import { getLivros } from '@/store/slices/livrosSlice';

jest.mock('@/store/slices/cronogramasSlice', () => ({
  createCronograma: jest.fn(args => ({
    type: 'createCronograma',
    payload: args,
  })),
}));
jest.mock('@/store/slices/livrosSlice', () => ({
  getLivros: jest.fn(() => ({ type: 'getLivros' })),
}));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const contratos = [
  { id: 'contrato-1', status: 'ATIVO', idioma: 'INGLES' },
  { id: 'contrato-2', status: 'CANCELADO', idioma: 'ESPANHOL' },
];

const livros = [{ id: 'livro-1', nome: 'Interchange', idioma: 'INGLES' }];

describe('useMatricularLivro', () => {
  let showForm;
  let showError;
  let success;
  let error;
  let onSuccess;
  let respostas;

  const renderizar = (props = {}) => {
    const store = configureStore({
      reducer: { livros: (state = {}) => state },
    });
    store.dispatch = jest.fn(acao => respostas[acao.type] ?? {});
    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );
    Wrapper.displayName = 'TestWrapper';
    return renderHook(
      () =>
        useMatricularLivro({
          idAluno: 'aluno-1',
          contratos,
          onSuccess,
          ...props,
        }),
      { wrapper: Wrapper }
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    onSuccess = jest.fn();
    respostas = {
      getLivros: { payload: { data: livros } },
      createCronograma: {},
    };
    showForm = jest.fn().mockResolvedValue({
      isConfirmed: true,
      value: {
        idContrato: 'contrato-1',
        idLivro: 'livro-1',
        dataInicio: '2026-03-01',
      },
    });
    showError = jest.fn();
    success = jest.fn();
    error = jest.fn();
    useSweetAlert.mockReturnValue({ showForm, showError });
    useToast.mockReturnValue({ success, error });
  });

  it('busca o catálogo só quando o handler roda, e não no mount', () => {
    renderizar();

    // Antes o perfil de qualquer aluno baixava a lista inteira de livros.
    expect(getLivros).not.toHaveBeenCalled();
  });

  it('busca o catálogo ao abrir o modal', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    expect(getLivros).toHaveBeenCalled();
  });

  it('oferece só contratos ativos ou pendentes', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    const { html } = showForm.mock.calls[0][0];
    expect(html).toContain('contrato-1');
    expect(html).not.toContain('contrato-2');
  });

  it('avisa quando não há contrato disponível', async () => {
    const { result } = renderizar({
      contratos: [{ id: 'c', status: 'CANCELADO' }],
    });

    await act(async () => {
      await result.current.handleMatricular();
    });

    expect(showError).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Nenhum contrato disponível' })
    );
    expect(getLivros).not.toHaveBeenCalled();
  });

  it('avisa quando não há livro cadastrado', async () => {
    respostas.getLivros = { payload: { data: [] } };
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    expect(showError).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Nenhum livro cadastrado' })
    );
    expect(showForm).not.toHaveBeenCalled();
  });

  it('traduz o idioma do contrato em vez de mostrar o enum cru', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    const { html } = showForm.mock.calls[0][0];
    expect(html).toContain('Inglês');
    expect(html).not.toContain('>INGLES —');
  });

  it('escapa o nome do livro, que pode vir de planilha importada', async () => {
    respostas.getLivros = {
      payload: {
        data: [
          {
            id: 'livro-x',
            nome: '<img src=x onerror="alert(1)">',
            idioma: 'INGLES',
          },
        ],
      },
    };
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    const { html } = showForm.mock.calls[0][0];
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img');
  });

  it('abre a data com o dia local, não com o dia em UTC', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    const agora = new Date();
    const esperado = `${agora.getFullYear()}-${String(
      agora.getMonth() + 1
    ).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
    expect(showForm.mock.calls[0][0].html).toContain(`value="${esperado}"`);
  });

  it('despacha createCronograma e chama onSuccess', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    expect(createCronograma).toHaveBeenCalledWith({
      idAluno: 'aluno-1',
      data: {
        idContrato: 'contrato-1',
        idLivro: 'livro-1',
        dataInicio: '2026-03-01',
      },
    });
    expect(success).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it('não matricula quando o modal é cancelado', async () => {
    showForm.mockResolvedValue({ isConfirmed: false });
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    expect(createCronograma).not.toHaveBeenCalled();
  });

  it('mostra a mensagem do backend na recusa', async () => {
    respostas.createCronograma = {
      error: true,
      payload: { message: 'O livro é de ESPANHOL e o contrato é de INGLES' },
    };
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleMatricular();
    });

    expect(error).toHaveBeenCalledWith(
      'O livro é de ESPANHOL e o contrato é de INGLES'
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
