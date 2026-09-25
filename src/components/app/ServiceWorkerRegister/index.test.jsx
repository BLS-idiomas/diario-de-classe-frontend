import { render } from '@testing-library/react';
import { ServiceWorkerRegister } from './index';

describe('ServiceWorkerRegister', () => {
  const nodeEnvOriginal = process.env.NODE_ENV;
  const buildIdOriginal = process.env.NEXT_PUBLIC_BUILD_ID;

  afterEach(() => {
    delete navigator.serviceWorker;
    jest.clearAllMocks();
    process.env.NODE_ENV = nodeEnvOriginal;
    process.env.NEXT_PUBLIC_BUILD_ID = buildIdOriginal;
  });

  it('em produção, registra o service worker no mount com a versão de build na URL', () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_BUILD_ID = 'build-123';
    const register = jest.fn().mockResolvedValue({});
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register },
      configurable: true,
    });

    render(<ServiceWorkerRegister />);

    expect(register).toHaveBeenCalledWith('/sw.js?v=build-123');
  });

  it('controle negativo: sem suporte a serviceWorker, não tenta registrar (e não quebra)', () => {
    process.env.NODE_ENV = 'production';
    delete navigator.serviceWorker;
    expect('serviceWorker' in navigator).toBe(false);

    expect(() => render(<ServiceWorkerRegister />)).not.toThrow();
  });

  it('register() rejeitando não quebra o render nem deixa unhandled rejection', async () => {
    process.env.NODE_ENV = 'production';
    const unhandled = jest.fn();
    process.on('unhandledRejection', unhandled);

    const register = jest.fn().mockRejectedValue(new Error('falhou'));
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register },
      configurable: true,
    });

    expect(() => render(<ServiceWorkerRegister />)).not.toThrow();

    // dá chance da promise rejeitada (e de um eventual unhandledRejection)
    // se propagarem antes de afirmar que nada vazou.
    await new Promise(resolve => setImmediate(resolve));

    expect(register).toHaveBeenCalledTimes(1);
    expect(unhandled).not.toHaveBeenCalled();

    process.off('unhandledRejection', unhandled);
  });

  it('fora de produção, não registra o service worker', () => {
    process.env.NODE_ENV = 'development';
    const register = jest.fn().mockResolvedValue({});
    const getRegistrations = jest.fn().mockResolvedValue([]);
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register, getRegistrations },
      configurable: true,
    });

    render(<ServiceWorkerRegister />);

    expect(register).not.toHaveBeenCalled();
  });

  it('fora de produção, desregistra service workers de sessões anteriores', async () => {
    process.env.NODE_ENV = 'development';
    const registrationAntiga = { unregister: jest.fn() };
    const register = jest.fn().mockResolvedValue({});
    const getRegistrations = jest.fn().mockResolvedValue([registrationAntiga]);
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register, getRegistrations },
      configurable: true,
    });

    render(<ServiceWorkerRegister />);
    await new Promise(resolve => setImmediate(resolve));

    expect(getRegistrations).toHaveBeenCalledTimes(1);
    expect(registrationAntiga.unregister).toHaveBeenCalledTimes(1);
  });

  it('duas versões de build diferentes geram URLs de registro distintas (controle negativo: mesma versão → mesma URL)', () => {
    process.env.NODE_ENV = 'production';
    const register = jest.fn().mockResolvedValue({});
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register },
      configurable: true,
    });

    process.env.NEXT_PUBLIC_BUILD_ID = 'build-aaa';
    const primeiraMontagem = render(<ServiceWorkerRegister />);
    primeiraMontagem.unmount();

    process.env.NEXT_PUBLIC_BUILD_ID = 'build-bbb';
    const segundaMontagem = render(<ServiceWorkerRegister />);
    segundaMontagem.unmount();

    expect(register).toHaveBeenNthCalledWith(1, '/sw.js?v=build-aaa');
    expect(register).toHaveBeenNthCalledWith(2, '/sw.js?v=build-bbb');
    expect(register.mock.calls[0][0]).not.toBe(register.mock.calls[1][0]);

    // controle negativo: mesma versão de build → mesma URL nas duas chamadas
    register.mockClear();
    process.env.NEXT_PUBLIC_BUILD_ID = 'build-ccc';
    render(<ServiceWorkerRegister />).unmount();
    render(<ServiceWorkerRegister />).unmount();

    expect(register.mock.calls[0][0]).toBe(register.mock.calls[1][0]);
  });
});
