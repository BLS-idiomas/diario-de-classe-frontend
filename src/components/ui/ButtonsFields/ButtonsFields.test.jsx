import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonsFields } from './index.jsx';

// Mock next/link for testing
jest.mock('next/link', () => {
  const MockLink = ({ children, ...props }) => <a {...props}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('ButtonsFields', () => {
  it('renders submit and cancel buttons', () => {
    render(
      <ButtonsFields isSubmitting={false} isLoading={false} href="/test" />
    );
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('shows loading text when isLoading', () => {
    render(
      <ButtonsFields isSubmitting={false} isLoading={true} href="/test" />
    );
    expect(
      screen.getByRole('button', { name: /criando/i })
    ).toBeInTheDocument();
  });

  it('disables submit button when isSubmitting', () => {
    render(<ButtonsFields isLoading={true} href="/test" />);
    expect(screen.getByRole('button', { name: /criando/i })).toBeDisabled();
  });

  it('cancel link navigates to href', () => {
    render(
      <ButtonsFields isSubmitting={false} isLoading={false} href="/cancel" />
    );
    const cancelLink = screen.getByRole('link', { name: /cancelar/i });
    expect(cancelLink).toHaveAttribute('href', '/cancel');
  });

  describe('prop onCancel (TASK-002-007)', () => {
    it('presente: clicar em "Cancelar" chama onCancel, sem <Link> navegando', async () => {
      const onCancelMock = jest.fn();
      const user = userEvent.setup();
      render(
        <ButtonsFields
          isLoading={false}
          href="/configuracoes"
          onCancel={onCancelMock}
        />
      );

      expect(
        screen.queryByRole('link', { name: /cancelar/i })
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /cancelar/i }));

      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });

    it('ausente: preserva o <Link href> (consumidor existente, ex. AlunoForm/ContratoForm)', () => {
      render(<ButtonsFields isLoading={false} href="/alunos" />);

      expect(screen.getByRole('link', { name: /cancelar/i })).toHaveAttribute(
        'href',
        '/alunos'
      );
      expect(
        screen.queryByRole('button', { name: /cancelar/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('prop savingLabel (TASK-002-007)', () => {
    it('presente: mostra o texto passado durante isLoading (uso da tela de configuração)', () => {
      render(
        <ButtonsFields
          isLoading={true}
          href="/configuracoes"
          savingLabel="Salvando..."
        />
      );

      expect(
        screen.getByRole('button', { name: /salvando/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /criando/i })
      ).not.toBeInTheDocument();
    });

    it('ausente: mostra "Criando..." durante isLoading (consumidor existente, ex. AlunoForm/ContratoForm)', () => {
      render(<ButtonsFields isLoading={true} href="/alunos" />);

      expect(
        screen.getByRole('button', { name: /criando/i })
      ).toBeInTheDocument();
    });
  });
});
