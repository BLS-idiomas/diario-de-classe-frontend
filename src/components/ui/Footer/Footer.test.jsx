import React from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { mountRaw } from '@/utils/mountRaw';
import { Footer } from './index';
import packageJson from '../../../../package.json';

describe('Footer', () => {
  it('renders current year and text', () => {
    const { getByText, container } = render(<Footer />);
    const ano = new Date().getFullYear();
    expect(getByText(new RegExp(`${ano}`))).toBeInTheDocument();
    expect(container.querySelector('footer')).toHaveClass('bg-secondary');
  });

  it('displays version from package.json', () => {
    const { getByText } = render(<Footer />);
    expect(getByText(`v${packageJson.version}`)).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    const { getByText } = render(<Footer />);
    expect(getByText(/BLS Idiomas/i)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-secondary');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('border-main');
    expect(footer).toHaveClass('py-6');
  });
});

describe('Footer — ano estável até montar (AC-001-005)', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('paridade SSR: renderToString não contém nenhum ano, independente do relógio', () => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2026-12-31T23:59:59.000-03:00'));
    const htmlAntes = renderToString(<Footer />);

    jest.setSystemTime(new Date('2027-01-01T00:00:01.000-03:00'));
    const htmlDepois = renderToString(<Footer />);

    expect(htmlAntes).toBe(htmlDepois);
    expect(htmlAntes).not.toMatch(/202\d/);
  });

  it('preenchimento pós-montagem: ano nasce ausente e passa a refletir o relógio real', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-12-31T23:59:59.000-03:00'));

    // `mountRaw` (ACH-10) — mesmo helper compartilhado das 5 suítes de hook,
    // aqui montando o componente diretamente (sem `Harness`).
    const footer1 = mountRaw(<Footer />);
    expect(footer1.container.textContent).not.toMatch(/202\d/);
    await footer1.flush();
    expect(footer1.container.textContent).toMatch('2026');

    jest.setSystemTime(new Date('2027-01-01T00:00:01.000-03:00'));
    const footer2 = mountRaw(<Footer />);
    expect(footer2.container.textContent).not.toMatch(/202\d/);
    await footer2.flush();
    expect(footer2.container.textContent).toMatch('2027');

    footer1.unmount();
    footer2.unmount();
  });
});
