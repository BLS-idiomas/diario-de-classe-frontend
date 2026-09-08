import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/providers/ToastProvider';
import { useDownloadCronograma } from './useDownloadCronograma';
import { DownloadCronogramaExcelService } from '@/services/cronograma/downloadCronogramaExcelService';

jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('@/services/cronograma/downloadCronogramaExcelService', () => ({
  DownloadCronogramaExcelService: { handle: jest.fn() },
}));

describe('useDownloadCronograma', () => {
  let error;
  let criarURL;
  let revogarURL;
  let clicado;

  beforeEach(() => {
    jest.clearAllMocks();
    error = jest.fn();
    useToast.mockReturnValue({ error });

    criarURL = jest.fn(() => 'blob:fake');
    revogarURL = jest.fn();
    global.URL.createObjectURL = criarURL;
    global.URL.revokeObjectURL = revogarURL;

    clicado = false;
    const criarElementoOriginal = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation(tag => {
      const el = criarElementoOriginal(tag);
      if (tag === 'a') {
        el.click = () => {
          clicado = true;
        };
      }
      return el;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('não faz nada sem aluno', async () => {
    const { result } = renderHook(() => useDownloadCronograma(null));

    await act(async () => {
      await result.current.handleDownload();
    });

    expect(DownloadCronogramaExcelService.handle).not.toHaveBeenCalled();
  });

  it('baixa o arquivo com o nome informado', async () => {
    DownloadCronogramaExcelService.handle.mockResolvedValue({
      status: 200,
      data: new Blob(['x']),
    });
    const { result } = renderHook(() => useDownloadCronograma('aluno-1'));

    await act(async () => {
      await result.current.handleDownload('Cronograma - João');
    });

    expect(DownloadCronogramaExcelService.handle).toHaveBeenCalledWith(
      'aluno-1'
    );
    expect(clicado).toBe(true);
  });

  it('revoga a URL do blob depois do clique', async () => {
    // Sem revogar, cada download deixaria um blob preso na memória da aba.
    DownloadCronogramaExcelService.handle.mockResolvedValue({
      status: 200,
      data: new Blob(['x']),
    });
    const { result } = renderHook(() => useDownloadCronograma('aluno-1'));

    await act(async () => {
      await result.current.handleDownload();
    });

    expect(criarURL).toHaveBeenCalled();
    expect(revogarURL).toHaveBeenCalledWith('blob:fake');
  });

  it('avisa quando o aluno não tem cronograma (204 sem corpo)', async () => {
    DownloadCronogramaExcelService.handle.mockResolvedValue({
      status: 204,
      data: null,
    });
    const { result } = renderHook(() => useDownloadCronograma('aluno-1'));

    await act(async () => {
      await result.current.handleDownload();
    });

    expect(error).toHaveBeenCalledWith('Este aluno ainda não tem cronograma.');
    expect(criarURL).not.toHaveBeenCalled();
  });

  it('avisa erro quando a requisição falha', async () => {
    DownloadCronogramaExcelService.handle.mockRejectedValue(
      new Error('falhou')
    );
    const { result } = renderHook(() => useDownloadCronograma('aluno-1'));

    await act(async () => {
      await result.current.handleDownload();
    });

    expect(error).toHaveBeenCalledWith(
      'Erro ao baixar a planilha do cronograma.'
    );
  });

  it('desliga isDownloading no fim, mesmo com erro', async () => {
    DownloadCronogramaExcelService.handle.mockRejectedValue(
      new Error('falhou')
    );
    const { result } = renderHook(() => useDownloadCronograma('aluno-1'));

    await act(async () => {
      await result.current.handleDownload();
    });

    expect(result.current.isDownloading).toBe(false);
  });
});
