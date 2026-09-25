import { render, screen } from '@testing-library/react';
import { TransitionShell } from './index';

// Instala um matchMedia mockado para `(prefers-reduced-motion: reduce)` com o
// valor de `matches` pedido. Controle positivo: a asserção
// `window.matchMedia(...).matches` LÊ o mock — sem ele, o polyfill de
// `jest.setup.js` sempre devolve `matches: false`, e o caso `reduce` (abaixo)
// reprovaria. Fixture discriminante (o que o par de testes prova sobre
// produção): `animate-app-shell-in` permanece no DOM tanto com
// `matches: false` quanto com `matches: true` — a supressão de movimento vive
// em CSS (`prefers-reduced-motion` na folha de estilo), nunca num branch de
// JS que leria este mock (DEC-003-002).
function mockPrefersReducedMotion(matches) {
  const matchMediaMock = jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  window.matchMedia = matchMediaMock;
  return matchMediaMock;
}

describe('TransitionShell', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('mantém animate-app-shell-in com prefers-reduced-motion: no-preference (matches: false)', () => {
    mockPrefersReducedMotion(false);

    render(
      <TransitionShell>
        <span>conteúdo</span>
      </TransitionShell>
    );

    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(
      false
    );

    const shell = screen.getByTestId('transition-shell');
    expect(shell).toHaveClass('animate-app-shell-in');
    expect(shell).toHaveTextContent('conteúdo');
  });

  it('mantém animate-app-shell-in com prefers-reduced-motion: reduce (matches: true) — a supressão vive em CSS, nunca em um branch de JS (DEC-003-002)', () => {
    mockPrefersReducedMotion(true);

    render(
      <TransitionShell>
        <span>conteúdo</span>
      </TransitionShell>
    );

    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(
      true
    );

    const shell = screen.getByTestId('transition-shell');
    expect(shell).toHaveClass('animate-app-shell-in');
    expect(shell).toHaveTextContent('conteúdo');
  });

  it('preserva o className recebido via prop junto de animate-app-shell-in no mesmo nó', () => {
    render(
      <TransitionShell className="min-h-screen bg-secondary">
        <span>conteúdo</span>
      </TransitionShell>
    );

    const shell = screen.getByTestId('transition-shell');
    expect(shell).toHaveClass('animate-app-shell-in');
    expect(shell).toHaveClass('min-h-screen');
    expect(shell).toHaveClass('bg-secondary');
  });
});
