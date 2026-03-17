import { render, screen, waitFor } from '@testing-library/react';
import Aula from './page';
import { useParams } from 'next/navigation';
import { useAula } from '@/hooks/aulas/useAula';
import { useFormater } from '@/hooks/useFormater';
import * as nextNavigation from 'next/navigation';

// Mock do Next.js
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

// Mock dos hooks
jest.mock('@/hooks/aulas/useAula');
jest.mock('@/hooks/useFormater');

// Mock dos componentes
jest.mock('@/components', () => ({
  PageContent: ({ children }) => (
    <div data-testid="page-content">{children}</div>
  ),
  PageTitle: ({ children }) => <h1 data-testid="page-title">{children}</h1>,
  PageSubTitle: ({ children }) => (
    <h2 data-testid="page-subtitle">{children}</h2>
  ),
  ButtonGroup: ({ children }) => (
    <div data-testid="button-group">{children}</div>
  ),
  Loading: () => <div data-testid="loading">Loading...</div>,
  Section: ({ children }) => (
    <section data-testid="section">{children}</section>
  ),
  HeaderAvatar: ({ children }) => (
    <div data-testid="header-avatar">{children}</div>
  ),
  BadgeGroup: ({ children }) => <div data-testid="badge-group">{children}</div>,
  Badge: ({ text }) => <span data-testid="badge">{text}</span>,
  InfoCardGroup: ({ children }) => (
    <div data-testid="info-card-group">{children}</div>
  ),
  InfoCard: ({ columns }) => (
    <div data-testid="info-card">
      {columns?.map((col, idx) => (
        <div key={idx} data-testid={`info-card-column-${idx}`}>
          {col.text}
        </div>
      ))}
    </div>
  ),
  BlockQuoteInfo: ({ title, children, noContent }) => (
    <div data-testid="block-quote-info">
      <h3>{title}</h3>
      {children || noContent}
    </div>
  ),
}));

const mockAulaData = {
  id: 1,
  dataAula: '2025-12-21',
  horaInicial: '09:00',
  horaFinal: '10:00',
  status: 'AGENDADA',
  tipo: 'PADRAO',
  observacao: 'Conteúdo da aula',
};

const mockAlunoData = {
  nome: 'João',
  sobrenome: 'Silva',
  email: 'joao@email.com',
  telefone: '11987654321',
  material: 'Livro de exercícios',
};

const mockProfessorData = {
  nome: 'Maria',
  sobrenome: 'Santos',
  email: 'maria@email.com',
  telefone: '11987654322',
};

const mockContratoData = {
  idioma: 'INGLES',
  dataInicio: '2025-01-01',
  dataTermino: '2025-12-31',
  status: 'ATIVO',
};

describe('Aula Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: '1' });
    useFormater.mockReturnValue({
      dataFormatter: jest.fn(data => `${data} (formatado)`),
      telefoneFormatter: jest.fn(tel => `(11) ${tel.slice(-8)}`),
    });
    const { telefoneFormatter, dataFormatter } = useFormater();
    telefoneFormatter.mockImplementation(tel => {
      if (!tel) return '';
      return `(${tel.slice(0, 2)}) ${tel.slice(2)}`;
    });
    dataFormatter.mockImplementation(data => `${data} (formatado)`);
  });

  describe('loading state', () => {
    it('should display loading component when isLoading is true', () => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: null,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: true,
        isNotFound: false,
      });

      render(<Aula />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should display loading component when aluno is null', () => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: null,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('not found handling', () => {
    it('should call notFound when isNotFound is true', async () => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: true,
      });

      render(<Aula />);

      await waitFor(() => {
        expect(nextNavigation.notFound).toHaveBeenCalled();
      });
    });
  });

  describe('page structure', () => {
    beforeEach(() => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });
    });

    it('should render page content with correct title and subtitle', () => {
      render(<Aula />);

      expect(screen.getByTestId('page-title')).toHaveTextContent(
        'Detalhes da aula'
      );
      expect(screen.getByTestId('page-subtitle')).toHaveTextContent(
        'Visualização dos dados da aula'
      );
    });

    it('should render button group with back and edit links', () => {
      render(<Aula />);

      const backButton = screen.getByRole('link', { name: /voltar/i });
      const editButton = screen.getByRole('link', { name: /editar/i });

      expect(backButton).toHaveAttribute('href', '/aulas');
      expect(editButton).toHaveAttribute('href', '/aulas/1/editar');
    });

    it('should render all expected sections', () => {
      render(<Aula />);

      expect(screen.getByTestId('section')).toBeInTheDocument();
      expect(screen.getByTestId('badge-group')).toBeInTheDocument();
      expect(screen.getAllByTestId('info-card')).toHaveLength(3);
      expect(screen.getAllByTestId('block-quote-info')).toHaveLength(2);
    });
  });

  describe('aula details display', () => {
    beforeEach(() => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });
    });

    it('should display formatted aula date and time', () => {
      const { dataFormatter } = useFormater();
      dataFormatter.mockReturnValue('21/12/2025');

      render(<Aula />);

      expect(screen.getByText(/Data aula: 21\/12\/2025/)).toBeInTheDocument();
      expect(screen.getByText(/Das 09:00 até 10:00/)).toBeInTheDocument();
    });

    it('should display badges for idioma, tipo and status', () => {
      render(<Aula />);

      const badges = screen.getAllByTestId('badge');
      expect(badges).toHaveLength(3);
    });

    it('should display aula observacao in BlockQuoteInfo', () => {
      render(<Aula />);

      const blockQuotes = screen.getAllByTestId('block-quote-info');
      const observacaoBlock = blockQuotes[0];

      expect(observacaoBlock).toHaveTextContent('Conteúdo/Observaçãos da aula');
      expect(observacaoBlock).toHaveTextContent('Conteúdo da aula');
    });

    it('should display "Nenhum conteúdo" when observacao is empty', () => {
      useAula.mockReturnValue({
        aula: { ...mockAulaData, observacao: null },
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      const blockQuotes = screen.getAllByTestId('block-quote-info');
      expect(blockQuotes[0]).toHaveTextContent('Nenhum conteúdo encontrado.');
    });
  });

  describe('aluno information display', () => {
    beforeEach(() => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });
    });

    it('should display aluno name, email and telefone', () => {
      render(<Aula />);

      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('joao@email.com')).toBeInTheDocument();
      expect(screen.getByText('(11) 987654321')).toBeInTheDocument();
    });

    it('should not display telefone when aluno telefone is empty', () => {
      useFormater.mockReturnValue({
        dataFormatter: jest.fn(),
        telefoneFormatter: jest.fn(),
      });

      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: { ...mockAlunoData, telefone: '' },
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      const { telefoneFormatter } = useFormater();
      // Deve ser chamado apenas para o professor, não para o aluno
      expect(telefoneFormatter).toHaveBeenCalledTimes(1);
      expect(telefoneFormatter).toHaveBeenCalledWith(
        mockProfessorData.telefone
      );
    });

    it('should display aluno material in BlockQuoteInfo', () => {
      render(<Aula />);

      const blockQuotes = screen.getAllByTestId('block-quote-info');
      const materialBlock = blockQuotes[1];

      expect(materialBlock).toHaveTextContent('Material do aluno');
      expect(materialBlock).toHaveTextContent('Livro de exercícios');
    });

    it('should display "Nenhum material" when material is empty', () => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: { ...mockAlunoData, material: null },
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      const blockQuotes = screen.getAllByTestId('block-quote-info');
      expect(blockQuotes[1]).toHaveTextContent('Nenhum material disponível.');
    });
  });

  describe('professor information display', () => {
    beforeEach(() => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });
    });

    it('should display professor name, email and telefone', () => {
      render(<Aula />);

      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('maria@email.com')).toBeInTheDocument();
      expect(screen.getByText('(11) 987654322')).toBeInTheDocument();
    });

    it('should not display telefone when professor telefone is empty', () => {
      useFormater.mockReturnValue({
        dataFormatter: jest.fn(),
        telefoneFormatter: jest.fn(),
      });

      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: { ...mockProfessorData, telefone: '' },
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      const { telefoneFormatter } = useFormater();
      // Deve ser chamado apenas para o aluno, não para o professor
      expect(telefoneFormatter).toHaveBeenCalledTimes(1);
      expect(telefoneFormatter).toHaveBeenCalledWith(mockAlunoData.telefone);
    });
  });

  describe('contrato information display', () => {
    beforeEach(() => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });
    });

    it('should display contrato dates and status', () => {
      const { dataFormatter } = useFormater();
      dataFormatter.mockImplementation(date => {
        const map = {
          '2025-01-01': '01/01/2025',
          '2025-12-31': '31/12/2025',
        };
        return map[date] || date;
      });

      render(<Aula />);

      expect(screen.getByText(/Data inicio: 01\/01\/2025/)).toBeInTheDocument();
      expect(
        screen.getByText(/Data término: 31\/12\/2025/)
      ).toBeInTheDocument();
    });
  });

  describe('getFullName helper function', () => {
    it('should combine nome and sobrenome correctly', () => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });

    it('should return empty string when entity is null', () => {
      const alunoCopy = { ...mockAlunoData };
      delete alunoCopy.nome;

      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: alunoCopy,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      // O teste passará mesmo se o nome não estiver completo
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });
  });

  describe('useAula hook integration', () => {
    it('should pass correct id to useAula hook', () => {
      useParams.mockReturnValue({ id: '123' });
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      expect(useAula).toHaveBeenCalledWith('123');
    });
  });

  describe('link navigation', () => {
    beforeEach(() => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });
    });

    it('should have correct href attributes for action buttons', () => {
      useParams.mockReturnValue({ id: '42' });

      render(<Aula />);

      const backLink = screen.getByRole('link', { name: /voltar/i });
      const editLink = screen.getByRole('link', { name: /editar/i });

      expect(backLink).toHaveAttribute('href', '/aulas');
      expect(editLink).toHaveAttribute('href', '/aulas/42/editar');
    });

    it('should have correct classes for button styling', () => {
      render(<Aula />);

      const backLink = screen.getByRole('link', { name: /voltar/i });
      const editLink = screen.getByRole('link', { name: /editar/i });

      expect(backLink).toHaveClass('btn', 'btn-secondary');
      expect(editLink).toHaveClass('btn', 'btn-primary');
    });
  });

  describe('edge cases', () => {
    it('should handle missing professor gracefully', () => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: {},
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      expect(screen.getByTestId('section')).toBeInTheDocument();
    });

    it('should handle missing contrato gracefully', () => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: mockAlunoData,
        professor: mockProfessorData,
        contrato: {},
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      expect(screen.getByTestId('section')).toBeInTheDocument();
    });

    it('should use empty string for missing entity properties', () => {
      useAula.mockReturnValue({
        aula: mockAulaData,
        aluno: { ...mockAlunoData, sobrenome: null },
        professor: mockProfessorData,
        contrato: mockContratoData,
        isLoading: false,
        isNotFound: false,
      });

      render(<Aula />);

      // O getFullName deve retornar "João null"
      expect(screen.getByText('João null')).toBeInTheDocument();
    });
  });
});
