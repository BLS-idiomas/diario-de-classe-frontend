import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react';
import {
  UnsavedChangesGuardProvider,
  useUnsavedChangesGuard,
} from './UnsavedChangesGuardProvider';
import useSweetAlert from '@/hooks/useSweetAlert';

jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Registra o guard com um valor de `isDirty` fixo, no padrão do consumidor
// real (`page.jsx`: `useEffect` chamando `setGuard(() => isDirty)` a cada
// mudança e `clearGuard()` no cleanup).
function ConsumidorComGuard({ dirty }) {
  const { setGuard, clearGuard } = useUnsavedChangesGuard();
  useEffect(() => {
    setGuard(() => dirty);
    return () => clearGuard();
  }, [dirty, setGuard, clearGuard]);
  return null;
}

// Expõe o valor devolvido por `useUnsavedChangesGuard()` para o teste sem
// reatribuir uma variável externa durante o render (side effect só em
// `useEffect`, nunca no corpo do componente).
function ExpoeGuard({ guardRef, children = null }) {
  const guard = useUnsavedChangesGuard();
  useEffect(() => {
    guardRef.current = guard;
  });
  return children;
}

describe('UnsavedChangesGuardProvider', () => {
  let showConfirmMock;

  beforeEach(() => {
    showConfirmMock = jest.fn();
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
  });

  it('fora do provider, confirmNavigation() resolve true sem exibir diálogo, e setGuard/clearGuard não lançam', () => {
    const guardRef = { current: null };
    render(<ExpoeGuard guardRef={guardRef} />);

    expect(guardRef.current.confirmNavigation()).toBe(true);
    expect(showConfirmMock).not.toHaveBeenCalled();
    expect(() => guardRef.current.setGuard(() => true)).not.toThrow();
    expect(() => guardRef.current.clearGuard()).not.toThrow();
  });

  it('dentro do provider, sem guard registrado, confirmNavigation() resolve true sem exibir diálogo', () => {
    const guardRef = { current: null };
    render(
      <UnsavedChangesGuardProvider>
        <ExpoeGuard guardRef={guardRef} />
      </UnsavedChangesGuardProvider>
    );

    expect(guardRef.current.confirmNavigation()).toBe(true);
    expect(showConfirmMock).not.toHaveBeenCalled();
  });

  it('com guard registrado e isDirty=true, confirmNavigation() exibe o diálogo e resolve true quando confirmado', async () => {
    showConfirmMock.mockResolvedValue({ isConfirmed: true });
    const guardRef = { current: null };
    render(
      <UnsavedChangesGuardProvider>
        <ExpoeGuard guardRef={guardRef}>
          <ConsumidorComGuard dirty={true} />
        </ExpoeGuard>
      </UnsavedChangesGuardProvider>
    );

    const resultado = guardRef.current.confirmNavigation();
    // Com alteração pendente, o resultado é uma Promise (nunca `true`
    // síncrono) — é o sinal para o consumidor interceptar a navegação.
    expect(resultado).not.toBe(true);
    expect(showConfirmMock).toHaveBeenCalledTimes(1);

    await expect(resultado).resolves.toBe(true);
  });

  it('sem sobreposição de texto, confirmNavigation() exibe o diálogo com o texto de navegação (menu lateral, logout)', async () => {
    showConfirmMock.mockResolvedValue({ isConfirmed: true });
    const guardRef = { current: null };
    render(
      <UnsavedChangesGuardProvider>
        <ExpoeGuard guardRef={guardRef}>
          <ConsumidorComGuard dirty={true} />
        </ExpoeGuard>
      </UnsavedChangesGuardProvider>
    );

    await guardRef.current.confirmNavigation();

    expect(showConfirmMock).toHaveBeenCalledWith({
      title: 'Sair sem salvar?',
      text: 'Há alterações não salvas nesta tela. Se você sair agora, elas serão perdidas.',
      confirmButtonText: 'Sair sem salvar',
      cancelButtonText: 'Continuar editando',
    });
  });

  it('com sobreposição de { title, text, confirmButtonText }, confirmNavigation() exibe o diálogo com o texto sobreposto, mantendo cancelButtonText)', async () => {
    showConfirmMock.mockResolvedValue({ isConfirmed: true });
    const guardRef = { current: null };
    render(
      <UnsavedChangesGuardProvider>
        <ExpoeGuard guardRef={guardRef}>
          <ConsumidorComGuard dirty={true} />
        </ExpoeGuard>
      </UnsavedChangesGuardProvider>
    );

    await guardRef.current.confirmNavigation({
      title: 'Descartar alterações?',
      text: 'Há alterações não salvas nesta tela. Se você cancelar, elas serão descartadas.',
      confirmButtonText: 'Descartar alterações',
    });

    expect(showConfirmMock).toHaveBeenCalledWith({
      title: 'Descartar alterações?',
      text: 'Há alterações não salvas nesta tela. Se você cancelar, elas serão descartadas.',
      confirmButtonText: 'Descartar alterações',
      cancelButtonText: 'Continuar editando',
    });
  });

  it('com guard registrado e isDirty=true, confirmNavigation() resolve false quando o administrador cancela', async () => {
    showConfirmMock.mockResolvedValue({ isConfirmed: false });
    const guardRef = { current: null };
    render(
      <UnsavedChangesGuardProvider>
        <ExpoeGuard guardRef={guardRef}>
          <ConsumidorComGuard dirty={true} />
        </ExpoeGuard>
      </UnsavedChangesGuardProvider>
    );

    await expect(guardRef.current.confirmNavigation()).resolves.toBe(false);
  });

  it('quando o diálogo rejeita (falha ao exibir), confirmNavigation() resolve false por padrão — navegação negada', async () => {
    showConfirmMock.mockRejectedValue(new Error('falha ao exibir o diálogo'));
    const guardRef = { current: null };
    render(
      <UnsavedChangesGuardProvider>
        <ExpoeGuard guardRef={guardRef}>
          <ConsumidorComGuard dirty={true} />
        </ExpoeGuard>
      </UnsavedChangesGuardProvider>
    );

    await expect(guardRef.current.confirmNavigation()).resolves.toBe(false);
  });

  it('quando o diálogo rejeita e confirmNavigation é chamado com liberarSeFalhar, resolve true (logout — sessão encerrada vence rascunho)', async () => {
    showConfirmMock.mockRejectedValue(new Error('falha ao exibir o diálogo'));
    const guardRef = { current: null };
    render(
      <UnsavedChangesGuardProvider>
        <ExpoeGuard guardRef={guardRef}>
          <ConsumidorComGuard dirty={true} />
        </ExpoeGuard>
      </UnsavedChangesGuardProvider>
    );

    await expect(
      guardRef.current.confirmNavigation({ liberarSeFalhar: true })
    ).resolves.toBe(true);
  });

  describe('beforeunload', () => {
    it('com isDirty=true, o listener chama preventDefault() e atribui returnValue, cada um provado por um spy independente', () => {
      render(
        <UnsavedChangesGuardProvider>
          <ConsumidorComGuard dirty={true} />
        </UnsavedChangesGuardProvider>
      );

      const evento = new Event('beforeunload', { cancelable: true });
      const preventDefaultSpy = jest.spyOn(evento, 'preventDefault');
      const returnValueSetter = jest.fn();
      Object.defineProperty(evento, 'returnValue', {
        get: () => '',
        set: returnValueSetter,
        configurable: true,
      });

      act(() => {
        window.dispatchEvent(evento);
      });

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(returnValueSetter).toHaveBeenCalledTimes(1);
      expect(evento.defaultPrevented).toBe(true);
    });

    it('sem isDirty, o listener não é registrado — beforeunload segue sem interceptar', () => {
      render(
        <UnsavedChangesGuardProvider>
          <ConsumidorComGuard dirty={false} />
        </UnsavedChangesGuardProvider>
      );

      const evento = new Event('beforeunload', { cancelable: true });
      act(() => {
        window.dispatchEvent(evento);
      });

      expect(evento.defaultPrevented).toBe(false);
    });

    it('é removido quando isDirty volta a false', () => {
      const { rerender } = render(
        <UnsavedChangesGuardProvider>
          <ConsumidorComGuard dirty={true} />
        </UnsavedChangesGuardProvider>
      );

      let evento = new Event('beforeunload', { cancelable: true });
      act(() => {
        window.dispatchEvent(evento);
      });
      expect(evento.defaultPrevented).toBe(true);

      act(() => {
        rerender(
          <UnsavedChangesGuardProvider>
            <ConsumidorComGuard dirty={false} />
          </UnsavedChangesGuardProvider>
        );
      });

      evento = new Event('beforeunload', { cancelable: true });
      act(() => {
        window.dispatchEvent(evento);
      });
      expect(evento.defaultPrevented).toBe(false);
    });

    it('com o provider continuando montado, só a tela com o guard desmontando (clearGuard roda sozinho, sem um setGuard seguinte para corrigir o estado)', () => {
      const { rerender } = render(
        <UnsavedChangesGuardProvider>
          <ConsumidorComGuard dirty={true} />
        </UnsavedChangesGuardProvider>
      );

      let evento = new Event('beforeunload', { cancelable: true });
      act(() => {
        window.dispatchEvent(evento);
      });
      expect(evento.defaultPrevented).toBe(true);

      act(() => {
        rerender(
          <UnsavedChangesGuardProvider>
            <div data-testid="tela-sem-guard" />
          </UnsavedChangesGuardProvider>
        );
      });

      evento = new Event('beforeunload', { cancelable: true });
      act(() => {
        window.dispatchEvent(evento);
      });
      expect(evento.defaultPrevented).toBe(false);
    });

    it('é removido quando o provider inteiro desmonta (unmount)', () => {
      const { unmount } = render(
        <UnsavedChangesGuardProvider>
          <ConsumidorComGuard dirty={true} />
        </UnsavedChangesGuardProvider>
      );

      act(() => {
        unmount();
      });

      const evento = new Event('beforeunload', { cancelable: true });
      act(() => {
        window.dispatchEvent(evento);
      });
      expect(evento.defaultPrevented).toBe(false);
    });
  });
});
