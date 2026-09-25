import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { act } from '@testing-library/react';

// Só a mensagem "not wrapped in act(...)" é esperada por construção (ver
// JSDoc de `mountRaw`, abaixo) — qualquer outro `console.error` real é
// repassado ao console de verdade, nunca engolido (ACH-11).
const ACT_WARNING = /not wrapped in act/;

/**
 * Helper de teste (não é código de produção — usa `jest.spyOn`, só resolve
 * dentro do runner). Monta `element` via `flushSync` (fora de `act`) para
 * observar o DOM ANTES de qualquer `useEffect` (passivo) assentar.
 * `render`/`renderHook` do RTL embrulham o mount em `act()`, que assenta
 * efeitos passivos sincronamente antes de retornar — tornaria esse estado
 * pré-efeito inobservável por esse caminho. `flushSync` força o commit
 * inicial de forma síncrona e verificável sem também assentar o efeito
 * passivo, que só roda no próximo flush de efeitos (`flush()` abaixo).
 *
 * O mount fora de `act` dispara o aviso "not wrapped in act(...)" do React
 * quando o efeito assenta depois — esperado por construção, suprimido
 * aqui; qualquer outra mensagem de `console.error` chega ao console real.
 *
 * Extraído de 7 cópias quase idênticas (`useAulaForm.test.js`,
 * `useAulas.test.js`, `useContratoForm.test.js`, `useDashboard.test.js`,
 * `useRelatorioForm.test.js`, `page.test.jsx`, `Footer.test.jsx` — ACH-10);
 * o que variava entre elas (o elemento montado, e como o resultado é lido
 * do DOM) fica com quem chama, via `container`.
 *
 * @param {React.ReactElement} element
 * @returns {{
 *   container: HTMLElement,
 *   flush: () => Promise<void>,
 *   unmount: () => void,
 * }}
 */
export function mountRaw(element) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const originalConsoleError = console.error;
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((...args) => {
      if (typeof args[0] === 'string' && ACT_WARNING.test(args[0])) return;
      originalConsoleError(...args);
    });

  const root = createRoot(container);
  flushSync(() => {
    root.render(element);
  });

  return {
    container,
    async flush() {
      await act(async () => {
        await Promise.resolve();
      });
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      consoleErrorSpy.mockRestore();
      document.body.removeChild(container);
    },
  };
}
