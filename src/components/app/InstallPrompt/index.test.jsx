import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstallPrompt } from './index';
import { useInstallPrompt } from '@/hooks/pwa/useInstallPrompt';

jest.mock('@/hooks/pwa/useInstallPrompt', () => ({
  useInstallPrompt: jest.fn(),
}));

describe('InstallPrompt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('AC-001-003: estado "esperando" exibe indicador de instalação em andamento', () => {
    useInstallPrompt.mockReturnValue({
      estado: 'esperando',
      estaVisivel: true,
      promptInstall: jest.fn(),
      dispensarConvite: jest.fn(),
    });

    render(<InstallPrompt />);

    expect(screen.getByRole('status')).toHaveTextContent(
      /instalando o aplicativo/i
    );
  });

  it('AC-001-004: desfecho "sucesso" (estado volta a idle e evento é consumido) não deixa o banner de resultado preso na tela', () => {
    useInstallPrompt.mockReturnValue({
      estado: 'idle',
      estaVisivel: false,
      promptInstall: jest.fn(),
      dispensarConvite: jest.fn(),
    });

    render(<InstallPrompt />);

    // a confirmação de sucesso sai por toast (useInstallPrompt/useToast), não
    // por um estado renderizado aqui — sem `estaVisivel` e com `estado`
    // "idle", o componente não deve renderizar nada.
    expect(screen.queryByTestId('install-prompt')).not.toBeInTheDocument();
  });

  it('AC-001-005: desfecho "recusado" (estado volta a idle e evento é consumido) não deixa o banner de resultado preso na tela', () => {
    useInstallPrompt.mockReturnValue({
      estado: 'idle',
      estaVisivel: false,
      promptInstall: jest.fn(),
      dispensarConvite: jest.fn(),
    });

    render(<InstallPrompt />);

    expect(screen.queryByTestId('install-prompt')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('estado "idle" com estaVisivel=true renderiza os botões "Instalar" e "Agora não"', () => {
    useInstallPrompt.mockReturnValue({
      estado: 'idle',
      estaVisivel: true,
      promptInstall: jest.fn(),
      dispensarConvite: jest.fn(),
    });

    render(<InstallPrompt />);

    expect(
      screen.getByRole('button', { name: 'Instalar' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /agora não/i })
    ).toBeInTheDocument();
  });

  it('AC-001-003: clique em "Instalar" chama promptInstall() uma vez', async () => {
    const promptInstall = jest.fn();
    useInstallPrompt.mockReturnValue({
      estado: 'idle',
      estaVisivel: true,
      promptInstall,
      dispensarConvite: jest.fn(),
    });
    const user = userEvent.setup();

    render(<InstallPrompt />);
    await user.click(screen.getByRole('button', { name: 'Instalar' }));

    expect(promptInstall).toHaveBeenCalledTimes(1);
  });

  it('AC-001-017: clique em "Agora não" chama dispensarConvite() uma vez', async () => {
    const dispensarConvite = jest.fn();
    useInstallPrompt.mockReturnValue({
      estado: 'idle',
      estaVisivel: true,
      promptInstall: jest.fn(),
      dispensarConvite,
    });
    const user = userEvent.setup();

    render(<InstallPrompt />);
    await user.click(screen.getByRole('button', { name: /agora não/i }));

    expect(dispensarConvite).toHaveBeenCalledTimes(1);
  });
});
