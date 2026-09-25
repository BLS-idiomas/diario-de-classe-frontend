import { act, renderHook } from '@testing-library/react';
import { useInstallPrompt } from './useInstallPrompt';
import { useToast } from '@/providers/ToastProvider';

jest.mock('@/providers/ToastProvider', () => ({
  useToast: jest.fn(),
}));

const CHAVE_DISPENSADO_EM = 'pwa-install-dismissed-at';
const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Constrói o evento sintético `beforeinstallprompt` com o shape mínimo que o
 * hook consome (`preventDefault`, `prompt`, `userChoice`), do jeito que o
 * navegador real dispara — via `window.dispatchEvent` sobre um `Event` real,
 * nunca um objeto plano passado direto ao listener.
 */
function dispararBeforeInstallPrompt({ userChoice }) {
  const evento = new Event('beforeinstallprompt');
  evento.preventDefault = jest.fn();
  evento.prompt = jest.fn();
  evento.userChoice = userChoice;

  act(() => {
    window.dispatchEvent(evento);
  });

  return evento;
}

describe('useInstallPrompt', () => {
  const matchMediaOriginal = window.matchMedia;
  let mockSuccess;
  let mockError;
  let mockWarning;
  let mockInfo;

  beforeEach(() => {
    window.localStorage.clear();
    window.innerWidth = 375; // contexto móvel por padrão (< 640, isMobileFunction)
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false, // não está em modo standalone por padrão
      media: '',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    // Mock com o contrato completo de `ToastProvider` (success/error/warning/
    // info) — um mock parcial mascararia uma chamada inesperada a um método
    // ausente atrás de um `TypeError` silencioso.
    mockSuccess = jest.fn();
    mockError = jest.fn();
    mockWarning = jest.fn();
    mockInfo = jest.fn();
    useToast.mockReturnValue({
      success: mockSuccess,
      error: mockError,
      warning: mockWarning,
      info: mockInfo,
    });
  });

  afterEach(() => {
    window.matchMedia = matchMediaOriginal;
    jest.clearAllMocks();
  });

  it('AC-001-002: evento beforeinstallprompt dispara → hook expõe o convite como disponível', () => {
    const { result } = renderHook(() => useInstallPrompt());

    expect(result.current.estaVisivel).toBe(false);

    dispararBeforeInstallPrompt({ userChoice: new Promise(() => {}) });

    expect(result.current.estaVisivel).toBe(true);
    expect(result.current.estado).toBe('idle');
  });

  it('AC-001-003: promptInstall() chamado → estado "esperando" até a promise resolver', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    let resolverUserChoice;
    const userChoice = new Promise(resolve => {
      resolverUserChoice = resolve;
    });

    const evento = dispararBeforeInstallPrompt({ userChoice });

    act(() => {
      result.current.promptInstall();
    });

    expect(evento.prompt).toHaveBeenCalledTimes(1);
    expect(result.current.estado).toBe('esperando');

    // resolve dentro do próprio teste (envolvida em `act`) para não deixar
    // um `setState` pendente vazar como update fora de `act` no teste
    // seguinte.
    await act(async () => {
      resolverUserChoice({ outcome: 'accepted' });
      await userChoice;
    });
  });

  it('AC-001-004: userChoice resolve accepted → toast de sucesso, banner recolhido (volta a idle, deixa de estar visível)', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    let resolverUserChoice;
    const userChoice = new Promise(resolve => {
      resolverUserChoice = resolve;
    });

    dispararBeforeInstallPrompt({ userChoice });

    act(() => {
      result.current.promptInstall();
    });

    await act(async () => {
      resolverUserChoice({ outcome: 'accepted' });
      await userChoice;
    });

    expect(mockSuccess).toHaveBeenCalledWith(
      'Aplicativo instalado com sucesso! Abra pelo ícone na tela inicial.'
    );
    expect(mockInfo).not.toHaveBeenCalled();
    expect(result.current.estado).toBe('idle');
    expect(result.current.estaVisivel).toBe(false);
  });

  it('AC-001-005: userChoice resolve dismissed → toast informativo, banner recolhido, sem lançar erro', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    let resolverUserChoice;
    const userChoice = new Promise(resolve => {
      resolverUserChoice = resolve;
    });

    dispararBeforeInstallPrompt({ userChoice });

    act(() => {
      result.current.promptInstall();
    });

    await act(async () => {
      resolverUserChoice({ outcome: 'dismissed' });
      await userChoice;
    });

    expect(mockInfo).toHaveBeenCalledWith(
      'Tudo bem, você pode instalar depois pelo menu do navegador.'
    );
    expect(mockSuccess).not.toHaveBeenCalled();
    // Controle negativo: a recusa do prompt nativo é tratada só pelo `info`
    // (M1 — trocar `info` por `error` no handler de recusa não pode passar
    // despercebido atrás de um `.catch` que mascare a exceção).
    expect(mockError).not.toHaveBeenCalled();
    expect(result.current.estado).toBe('idle');
    expect(result.current.estaVisivel).toBe(false);

    // A recusa do prompt nativo (`dismissed`) não é a mesma coisa que
    // "Agora não" (`dispensarConvite`): não deve gravar dispensa de 30 dias.
    expect(window.localStorage.getItem(CHAVE_DISPENSADO_EM)).toBeNull();

    // Prova real de "permitindo nova tentativa depois" (M2): um novo evento
    // `beforeinstallprompt` volta a expor o convite.
    dispararBeforeInstallPrompt({ userChoice: new Promise(() => {}) });
    expect(result.current.estaVisivel).toBe(true);

    // Controle positivo: prova que o mock de `error` realmente registra
    // chamadas — sem isso, `not.toHaveBeenCalled()` acima seria vácuo.
    mockError('sinal-controle-positivo');
    expect(mockError).toHaveBeenCalledWith('sinal-controle-positivo');
  });

  it('userChoice rejeita (catch) → toast informativo, banner recolhido, sem lançar erro', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    let rejeitarUserChoice;
    const userChoice = new Promise((_, reject) => {
      rejeitarUserChoice = reject;
    });
    // evita unhandled rejection: o hook consome via o 2º argumento do
    // `.then()`, mas a promise "crua" também precisa de um handler para o
    // Node não reclamar.
    userChoice.catch(() => {});

    dispararBeforeInstallPrompt({ userChoice });

    act(() => {
      result.current.promptInstall();
    });

    await act(async () => {
      rejeitarUserChoice(new Error('prompt indisponível'));
      await userChoice.catch(() => {});
    });

    expect(mockInfo).toHaveBeenCalledWith(
      'Tudo bem, você pode instalar depois pelo menu do navegador.'
    );
    expect(result.current.estado).toBe('idle');
    expect(result.current.estaVisivel).toBe(false);
    // Controle negativo + positivo, mesma disciplina do teste de recusa.
    expect(mockError).not.toHaveBeenCalled();
    mockError('sinal-controle-positivo');
    expect(mockError).toHaveBeenCalledWith('sinal-controle-positivo');
  });

  it('AC-001-017: dispensado há <30 dias não expõe o convite; controle positivo, há >30 dias volta a expor', () => {
    window.localStorage.setItem(
      CHAVE_DISPENSADO_EM,
      String(Date.now() - (TRINTA_DIAS_MS - 1000))
    );
    const { result: recente } = renderHook(() => useInstallPrompt());
    dispararBeforeInstallPrompt({ userChoice: new Promise(() => {}) });
    expect(recente.current.estaVisivel).toBe(false);

    window.localStorage.setItem(
      CHAVE_DISPENSADO_EM,
      String(Date.now() - (TRINTA_DIAS_MS + 1000))
    );
    const { result: antigo } = renderHook(() => useInstallPrompt());
    dispararBeforeInstallPrompt({ userChoice: new Promise(() => {}) });
    expect(antigo.current.estaVisivel).toBe(true);
  });

  it('AC-001-018 (parte): matchMedia standalone true → hook não expõe o convite', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      media: '',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useInstallPrompt());
    dispararBeforeInstallPrompt({ userChoice: new Promise(() => {}) });

    expect(result.current.estaVisivel).toBe(false);
  });

  it('AC-001-018 (parte, desktop): isMobileFunction com innerWidth >= 640 → hook não expõe o convite', () => {
    window.innerWidth = 1280;

    const { result } = renderHook(() => useInstallPrompt());
    dispararBeforeInstallPrompt({ userChoice: new Promise(() => {}) });

    expect(result.current.estaVisivel).toBe(false);
  });

  it('AC-001-017: dispensarConvite() esconde o convite, grava o timestamp da dispensa em localStorage e uma nova montagem já nasce sem o convite, sem pré-semear o storage', () => {
    const { result } = renderHook(() => useInstallPrompt());
    dispararBeforeInstallPrompt({ userChoice: new Promise(() => {}) });
    expect(result.current.estaVisivel).toBe(true);

    const antes = Date.now();
    act(() => {
      result.current.dispensarConvite();
    });
    const depois = Date.now();

    expect(result.current.estaVisivel).toBe(false);

    const gravado = Number(window.localStorage.getItem(CHAVE_DISPENSADO_EM));
    expect(Number.isFinite(gravado)).toBe(true);
    expect(gravado).toBeGreaterThanOrEqual(antes);
    expect(gravado).toBeLessThanOrEqual(depois);

    const { result: novaMontagem } = renderHook(() => useInstallPrompt());
    dispararBeforeInstallPrompt({ userChoice: new Promise(() => {}) });
    expect(novaMontagem.current.estaVisivel).toBe(false);
  });
});
