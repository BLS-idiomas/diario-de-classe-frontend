import { render, screen } from '@testing-library/react';
import { HeaderAvatar } from '.';
import { Avatar } from '@/components/ui';

// Mock do componente Avatar
jest.mock('@/components/ui', () => ({
  Avatar: jest.fn(({ text }) => (
    <div data-testid="avatar-mock" aria-label={`Avatar for ${text}`} />
  )),
}));

describe('HeaderAvatar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper para buscar nome sem duplicação (busca apenas no elemento com classe específica)
  const getNameElement = name => {
    return screen.getByText(name, { selector: '.text-xl.font-semibold' });
  };

  it('should render entity name and email', () => {
    const entity = {
      nome: 'João',
      sobrenome: 'Silva',
      email: 'joao.silva@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    expect(getNameElement('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao.silva@example.com')).toBeInTheDocument();
  });

  it('should pass full name to Avatar component', () => {
    const entity = {
      nome: 'Maria',
      sobrenome: 'Santos',
      email: 'maria@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    expect(Avatar).toHaveBeenCalledWith(
      {
        text: 'Maria Santos',
      },
      undefined
    );
  });

  it('should render Avatar with correct text prop', () => {
    const entity = {
      nome: 'Pedro',
      sobrenome: 'Costa',
      email: 'pedro@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    const avatar = screen.getByTestId('avatar-mock');
    expect(avatar).toHaveAttribute('aria-label', 'Avatar for Pedro Costa');
  });

  it('should display full name in semibold text', () => {
    const entity = {
      nome: 'Ana',
      sobrenome: 'Oliveira',
      email: 'ana@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    const nameElement = getNameElement('Ana Oliveira');
    expect(nameElement).toHaveClass('text-xl');
    expect(nameElement).toHaveClass('font-semibold');
  });

  it('should display email in gray text', () => {
    const entity = {
      nome: 'Carlos',
      sobrenome: 'Lima',
      email: 'carlos.lima@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    const emailElement = screen.getByText('carlos.lima@example.com');
    expect(emailElement).toHaveClass('text-sm');
    expect(emailElement).toHaveClass('text-gray-600');
  });

  it('should render with proper layout structure', () => {
    const entity = {
      nome: 'Laura',
      sobrenome: 'Ferreira',
      email: 'laura@example.com',
    };

    const { container } = render(<HeaderAvatar entity={entity} />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('items-center');
    expect(wrapper).toHaveClass('gap-4');
    expect(wrapper).toHaveClass('mb-3');
  });

  it('should handle entity with empty strings', () => {
    const entity = {
      nome: '',
      sobrenome: '',
      email: '',
    };

    render(<HeaderAvatar entity={entity} />);

    // Verifica que o Avatar foi chamado com string vazia
    expect(Avatar).toHaveBeenCalledWith({ text: ' ' }, undefined);

    // Verifica que os elementos existem mesmo vazios
    const avatar = screen.getByTestId('avatar-mock');
    expect(avatar).toBeInTheDocument();
  });

  it('should concatenate nome and sobrenome with space', () => {
    const entity = {
      nome: 'Roberto',
      sobrenome: 'Alves',
      email: 'roberto@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    // Busca apenas no div com classe específica para evitar duplicação
    const nameElement = screen.getByText('Roberto Alves', {
      selector: '.text-xl.font-semibold',
    });
    expect(nameElement).toBeInTheDocument();

    expect(Avatar).toHaveBeenCalledWith(
      {
        text: 'Roberto Alves',
      },
      undefined
    );
  });

  it('should render multiple times with different entities', () => {
    const entity1 = {
      nome: 'Fernanda',
      sobrenome: 'Souza',
      email: 'fernanda@example.com',
    };

    const { rerender } = render(<HeaderAvatar entity={entity1} />);

    expect(getNameElement('Fernanda Souza')).toBeInTheDocument();
    expect(screen.getByText('fernanda@example.com')).toBeInTheDocument();

    const entity2 = {
      nome: 'Gabriel',
      sobrenome: 'Martins',
      email: 'gabriel@example.com',
    };

    rerender(<HeaderAvatar entity={entity2} />);

    expect(getNameElement('Gabriel Martins')).toBeInTheDocument();
    expect(screen.getByText('gabriel@example.com')).toBeInTheDocument();
    expect(screen.queryByText('Fernanda Souza')).not.toBeInTheDocument();
  });

  it('should call Avatar component once per render', () => {
    const entity = {
      nome: 'Thiago',
      sobrenome: 'Nunes',
      email: 'thiago@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    expect(Avatar).toHaveBeenCalledTimes(1);
  });

  it('should handle entity with special characters in name', () => {
    const entity = {
      nome: 'José',
      sobrenome: 'Gonçalves',
      email: 'jose.goncalves@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    expect(getNameElement('José Gonçalves')).toBeInTheDocument();
    expect(screen.getByText('jose.goncalves@example.com')).toBeInTheDocument();
  });

  it('should handle entity with special characters in email', () => {
    const entity = {
      nome: 'Beatriz',
      sobrenome: 'Costa',
      email: 'beatriz+test@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    expect(getNameElement('Beatriz Costa')).toBeInTheDocument();
    expect(screen.getByText('beatriz+test@example.com')).toBeInTheDocument();
  });

  it('should render correctly with long names', () => {
    const entity = {
      nome: 'Ana Carolina Beatriz',
      sobrenome: 'dos Santos Silva Oliveira',
      email: 'ana.carolina@example.com',
    };

    render(<HeaderAvatar entity={entity} />);

    expect(
      getNameElement('Ana Carolina Beatriz dos Santos Silva Oliveira')
    ).toBeInTheDocument();
  });

  it('should maintain proper spacing between avatar and content', () => {
    const entity = {
      nome: 'Rafael',
      sobrenome: 'Pereira',
      email: 'rafael@example.com',
    };

    const { container } = render(<HeaderAvatar entity={entity} />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('gap-4'); // Verifica o espaçamento
  });

  describe('entity prop structure', () => {
    it('should access entity.nome property', () => {
      const entity = {
        nome: 'Teste',
        sobrenome: 'Nome',
        email: 'teste@example.com',
      };

      render(<HeaderAvatar entity={entity} />);

      expect(getNameElement('Teste Nome')).toBeInTheDocument();
    });

    it('should access entity.sobrenome property', () => {
      const entity = {
        nome: 'Teste',
        sobrenome: 'Sobrenome',
        email: 'teste@example.com',
      };

      render(<HeaderAvatar entity={entity} />);

      expect(getNameElement('Teste Sobrenome')).toBeInTheDocument();
    });

    it('should access entity.email property', () => {
      const entity = {
        nome: 'Teste',
        sobrenome: 'Email',
        email: 'teste.email@example.com',
      };

      render(<HeaderAvatar entity={entity} />);

      expect(screen.getByText('teste.email@example.com')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply correct container classes', () => {
      const entity = {
        nome: 'Mariana',
        sobrenome: 'Silva',
        email: 'mariana@example.com',
      };

      const { container } = render(<HeaderAvatar entity={entity} />);

      const wrapper = container.firstChild;
      expect(wrapper.className).toContain('flex');
      expect(wrapper.className).toContain('items-center');
      expect(wrapper.className).toContain('gap-4');
      expect(wrapper.className).toContain('mb-3');
    });

    it('should apply correct name styling', () => {
      const entity = {
        nome: 'Lucas',
        sobrenome: 'Rodrigues',
        email: 'lucas@example.com',
      };

      render(<HeaderAvatar entity={entity} />);

      const nameElement = getNameElement('Lucas Rodrigues');
      expect(nameElement.className).toContain('text-xl');
      expect(nameElement.className).toContain('font-semibold');
    });

    it('should apply correct email styling', () => {
      const entity = {
        nome: 'Camila',
        sobrenome: 'Almeida',
        email: 'camila@example.com',
      };

      render(<HeaderAvatar entity={entity} />);

      const emailElement = screen.getByText('camila@example.com');
      expect(emailElement.className).toContain('text-sm');
      expect(emailElement.className).toContain('text-gray-600');
    });
  });
});
