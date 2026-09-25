import { renderHook, act } from '@testing-library/react';
import useSweetAlert from '@/hooks/useSweetAlert';
import {
  useConfirmarAlteracaoDuracao,
  TEXTO_CONFIRMACAO_DURACAO,
} from './useConfirmarAlteracaoDuracao';

jest.mock('@/hooks/useSweetAlert', () => jest.fn());

describe('useConfirmarAlteracaoDuracao', () => {
  it('duracaoMudou=true exibe o diálogo com o texto fixo (sem html) e chama onConfirmar quando confirmado', async () => {
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: true })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const onConfirmar = jest.fn();

    const { result } = renderHook(() =>
      useConfirmarAlteracaoDuracao({ duracaoMudou: true, onConfirmar })
    );

    await act(async () => {
      await result.current.confirmarEGravar();
    });

    expect(showConfirmMock).toHaveBeenCalledWith({
      title: 'Alterar a duração da aula?',
      text: TEXTO_CONFIRMACAO_DURACAO,
      confirmButtonText: 'Salvar',
    });
    expect(showConfirmMock.mock.calls[0][0]).not.toHaveProperty('html');
    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });

  it('duracaoMudou=true cancelado não chama onConfirmar', async () => {
    // Controle positivo: o mock de fato resolve isConfirmed: false — nunca um mock que
    // sempre resolve true ou que nunca resolve — sem esse controle, um bug que sempre
    // grava passaria despercebido.
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: false })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const onConfirmar = jest.fn();

    const { result } = renderHook(() =>
      useConfirmarAlteracaoDuracao({ duracaoMudou: true, onConfirmar })
    );

    await act(async () => {
      await result.current.confirmarEGravar();
    });

    expect(onConfirmar).not.toHaveBeenCalled();
  });

  it('duracaoMudou=false chama onConfirmar direto, sem exibir o diálogo', async () => {
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: true })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const onConfirmar = jest.fn();

    const { result } = renderHook(() =>
      useConfirmarAlteracaoDuracao({ duracaoMudou: false, onConfirmar })
    );

    await act(async () => {
      await result.current.confirmarEGravar();
    });

    expect(showConfirmMock).not.toHaveBeenCalled();
    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });
});
