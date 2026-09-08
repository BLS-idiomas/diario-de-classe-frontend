import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useToast } from '@/providers/ToastProvider';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useUploadConteudos } from './useUploadConteudos';
import { uploadConteudos } from '@/store/slices/livrosSlice';
import { STATUS } from '@/constants';

jest.mock('@/store/slices/livrosSlice', () => ({
  uploadConteudos: jest.fn(args => ({
    type: 'uploadConteudos',
    payload: args,
  })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
}));

jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const renderizar = (estado = {}) => {
  const store = configureStore({
    reducer: {
      livros: (
        state = { status: STATUS.IDLE, message: null, action: null, ...estado }
      ) => state,
    },
  });
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'TestWrapper';
  return renderHook(() => useUploadConteudos('livro-1'), { wrapper: Wrapper });
};

describe('useUploadConteudos', () => {
  let showConfirm;
  let showInput;
  let success;
  let error;

  beforeEach(() => {
    jest.clearAllMocks();
    showConfirm = jest.fn().mockResolvedValue({ isConfirmed: true });
    showInput = jest
      .fn()
      .mockResolvedValue({ isConfirmed: true, value: 'arquivo.xlsx' });
    success = jest.fn();
    error = jest.fn();
    useSweetAlert.mockReturnValue({ showConfirm, showInput });
    useToast.mockReturnValue({ success, error });
  });

  it('confirma antes de abrir o seletor, porque a planilha substitui tudo', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleModalUpload();
    });

    expect(showConfirm).toHaveBeenCalled();
    expect(showInput).toHaveBeenCalled();
  });

  it('aborta sem enviar quando a confirmação é negada', async () => {
    showConfirm.mockResolvedValue({ isConfirmed: false });
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleModalUpload();
    });

    expect(showInput).not.toHaveBeenCalled();
    expect(uploadConteudos).not.toHaveBeenCalled();
  });

  it('envia o arquivo como FormData no campo file', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleModalUpload();
    });

    expect(uploadConteudos).toHaveBeenCalledWith(
      expect.objectContaining({ idLivro: 'livro-1' })
    );
    const { file } = uploadConteudos.mock.calls[0][0];
    expect(file.get('file')).toBe('arquivo.xlsx');
  });

  it('não envia quando o seletor é cancelado', async () => {
    showInput.mockResolvedValue({ isConfirmed: false });
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleModalUpload();
    });

    expect(uploadConteudos).not.toHaveBeenCalled();
  });

  it('avisa sucesso quando a importação conclui', () => {
    renderizar({ status: STATUS.SUCCESS, action: 'uploadConteudos' });

    expect(success).toHaveBeenCalledWith('Conteúdos importados com sucesso!');
  });

  it('mostra a mensagem do backend na falha', () => {
    renderizar({
      status: STATUS.FAILED,
      action: 'uploadConteudos',
      message: 'A planilha é menor e removeria conteúdo com histórico',
    });

    expect(error).toHaveBeenCalledWith(
      'Erro ao importar conteúdos: A planilha é menor e removeria conteúdo com histórico'
    );
  });

  it('ignora status de outra ação', () => {
    renderizar({ status: STATUS.SUCCESS, action: 'getLivros' });

    expect(success).not.toHaveBeenCalled();
  });

  it('marca isUploading durante o envio', () => {
    const { result } = renderizar({
      status: STATUS.LOADING,
      action: 'uploadConteudos',
    });

    expect(result.current.isUploading).toBe(true);
  });
});
