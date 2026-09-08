import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useToast } from '@/providers/ToastProvider';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useLancarConteudo } from './useLancarConteudo';
import { updateConteudoAula } from '@/store/slices/cronogramasSlice';

jest.mock('@/store/slices/cronogramasSlice', () => ({
  updateConteudoAula: jest.fn(args => ({
    type: 'updateConteudoAula',
    payload: args,
  })),
}));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const conteudoOptions = [
  { value: 'c-1', ordem: 1, label: '1. Unit 1' },
  { value: 'c-2', ordem: 2, label: '2. Unit 2' },
];

const linha = { idAula: 'aula-1', idConteudo: 'c-1' };

describe('useLancarConteudo', () => {
  let showForm;
  let showError;
  let success;
  let onSuccess;
  let dispatchResultado;

  const renderizar = (props = {}) => {
    const store = configureStore({
      reducer: { cronogramas: (state = {}) => state },
    });
    store.dispatch = jest.fn(() => dispatchResultado);
    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );
    Wrapper.displayName = 'TestWrapper';
    return renderHook(
      () => useLancarConteudo({ conteudoOptions, onSuccess, ...props }),
      { wrapper: Wrapper }
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    onSuccess = jest.fn();
    dispatchResultado = {};
    showForm = jest
      .fn()
      .mockResolvedValue({ isConfirmed: true, value: { idConteudo: 'c-2' } });
    showError = jest.fn();
    success = jest.fn();
    useSweetAlert.mockReturnValue({ showForm, showError });
    useToast.mockReturnValue({ success });
  });

  it('não faz nada sem aula', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleLancarConteudo({});
    });

    expect(showForm).not.toHaveBeenCalled();
  });

  it('oferece a opção de voltar à sequência automática', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleLancarConteudo(linha);
    });

    expect(showForm.mock.calls[0][0].html).toContain(
      '— sequência automática —'
    );
  });

  it('marca como selecionado o conteúdo atual da aula', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleLancarConteudo(linha);
    });

    const { html } = showForm.mock.calls[0][0];
    expect(html).toContain('value="c-1" selected');
  });

  it('escapa o título do conteúdo vindo do servidor', async () => {
    const { result } = renderizar({
      conteudoOptions: [
        { value: 'c-9', ordem: 9, label: '<img src=x onerror="alert(1)">' },
      ],
    });

    await act(async () => {
      await result.current.handleLancarConteudo(linha);
    });

    const { html } = showForm.mock.calls[0][0];
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img');
  });

  it('despacha o lançamento e chama onSuccess', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleLancarConteudo(linha);
    });

    expect(updateConteudoAula).toHaveBeenCalledWith({
      idAula: 'aula-1',
      idConteudo: 'c-2',
    });
    expect(success).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it('manda null quando a opção vazia é escolhida', async () => {
    showForm.mockResolvedValue({
      isConfirmed: true,
      value: { idConteudo: '' },
    });
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleLancarConteudo(linha);
    });

    expect(updateConteudoAula).toHaveBeenCalledWith({
      idAula: 'aula-1',
      idConteudo: null,
    });
  });

  it('não lança quando o modal é cancelado', async () => {
    showForm.mockResolvedValue({ isConfirmed: false });
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleLancarConteudo(linha);
    });

    expect(updateConteudoAula).not.toHaveBeenCalled();
  });

  it('mostra a recusa do backend, como conteúdo já vinculado', async () => {
    dispatchResultado = {
      error: true,
      payload: { message: 'Este conteúdo já está vinculado a outra aula' },
    };
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleLancarConteudo(linha);
    });

    expect(showError).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Este conteúdo já está vinculado a outra aula',
      })
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
