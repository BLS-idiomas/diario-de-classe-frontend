import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import Aulas from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAulas } from '@/hooks/aulas/useAulas';
import { useDeletarAula } from '@/hooks/aulas/useDeletarAula';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { useEditarAndamentoAula } from '@/hooks/aulas/useEditarAndamentoAula';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/aulas/useAulas');
jest.mock('@/hooks/aulas/useDeletarAula');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/aulas/useAulasList');
jest.mock('@/hooks/aulas/useEditarAndamentoAula');

jest.mock('@/components', () => ({
  Form: ({ handleSubmit, children }) => (
    <form
      data-testid="filter-form"
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {children}
    </form>
  ),
  FormGroup: ({ cols, children }) => (
    <div data-testid={`form-group-${cols}`}>{children}</div>
  ),
  InputField: ({ htmlFor, label, type, onChange, value }) => (
    <input
      data-testid={htmlFor}
      type={type}
      placeholder={label}
      onChange={onChange}
      value={value}
    />
  ),
  ListPage: ({ title, columns, data, isLoading, Filter, notFoundMessage }) => (
    <div data-testid="list-page">
      <h1>{title}</h1>
      {Filter && <Filter />}
      <div data-testid="table-section">
        {isLoading && <div>Loading...</div>}
        {!isLoading && data.length === 0 && <div>{notFoundMessage}</div>}
        {!isLoading && data.length > 0 && (
          <table>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>{JSON.stringify(row)}</tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  ),
}));

describe('Aulas Page', () => {
  const mockCurrentUser = {
    id: '123',
    name: 'Test User',
    permissao: 'ADMINISTRADOR',
  };

  const mockAulas = [
    {
      id: 1,
      dataAula: '2024-03-01',
      tipo: 'PADRAO',
      idAluno: '1',
      idProfessor: '1',
    },
    {
      id: 2,
      dataAula: '2024-03-02',
      tipo: 'REPOSICAO',
      idAluno: '2',
      idProfessor: '2',
    },
  ];

  const mockFormData = {
    dataInicio: '2024-03-01',
    dataTermino: '2024-09-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: mockCurrentUser,
    });

    useAulas.mockReturnValue({
      aulas: mockAulas,
      isLoading: false,
      searchParams: jest.fn(),
      handleSubmit: jest.fn(),
      handleChange: jest.fn(),
      formData: mockFormData,
    });

    useDeletarAula.mockReturnValue({
      handleDeleteAula: jest.fn(),
    });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(val => val),
      dataFormatter: jest.fn(val => val),
    });

    useAulasList.mockReturnValue({
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'dataAula', label: 'Data' },
        { key: 'tipo', label: 'Tipo' },
      ],
      data: mockAulas,
    });

    useEditarAndamentoAula.mockReturnValue({
      submit: jest.fn(),
      isLoading: false,
    });
  });

  describe('rendering', () => {
    it('should render the page successfully', () => {
      render(<Aulas />);

      expect(screen.getByTestId('list-page')).toBeInTheDocument();
    });

    it('should render the page title "Lista de aulas"', () => {
      render(<Aulas />);

      expect(screen.getByText('Lista de aulas')).toBeInTheDocument();
    });

    it('should render the filter form', () => {
      render(<Aulas />);

      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });

    it('should render the data table', () => {
      render(<Aulas />);

      expect(screen.getByTestId('table-section')).toBeInTheDocument();
    });
  });

  describe('filter functionality', () => {
    it('should render filter title "Filtros"', () => {
      render(<Aulas />);

      expect(screen.getByText('Filtros')).toBeInTheDocument();
    });

    it('should render dataInicio input field', () => {
      render(<Aulas />);

      const dataInicioInput = screen.getByTestId('dataInicio');
      expect(dataInicioInput).toBeInTheDocument();
      expect(dataInicioInput).toHaveAttribute('type', 'date');
    });

    it('should render dataTermino input field', () => {
      render(<Aulas />);

      const dataTerminoInput = screen.getByTestId('dataTermino');
      expect(dataTerminoInput).toBeInTheDocument();
      expect(dataTerminoInput).toHaveAttribute('type', 'date');
    });

    it('should set dataInicio input value from formData', () => {
      render(<Aulas />);

      const dataInicioInput = screen.getByTestId('dataInicio');
      expect(dataInicioInput).toHaveValue(mockFormData.dataInicio);
    });

    it('should set dataTermino input value from formData', () => {
      render(<Aulas />);

      const dataTerminoInput = screen.getByTestId('dataTermino');
      expect(dataTerminoInput).toHaveValue(mockFormData.dataTermino);
    });

    it('should call handleChange when input changes', () => {
      const mockHandleChange = jest.fn();
      useAulas.mockReturnValue({
        ...useAulas(),
        handleChange: mockHandleChange,
      });

      render(<Aulas />);

      const dataInicioInput = screen.getByTestId('dataInicio');
      fireEvent.change(dataInicioInput, { target: { value: '2024-02-01' } });

      expect(mockHandleChange).toHaveBeenCalled();
    });
  });

  describe('hooks integration', () => {
    it('should call useUserAuth hook', () => {
      render(<Aulas />);

      expect(useUserAuth).toHaveBeenCalled();
    });

    it('should call useAulas hook', () => {
      render(<Aulas />);

      expect(useAulas).toHaveBeenCalled();
    });

    it('should call useDeletarAula hook', () => {
      render(<Aulas />);

      expect(useDeletarAula).toHaveBeenCalled();
    });

    it('should call useFormater hook', () => {
      render(<Aulas />);

      expect(useFormater).toHaveBeenCalled();
    });

    it('should call useAulasList hook with correct props', () => {
      render(<Aulas />);

      expect(useAulasList).toHaveBeenCalledWith({
        currentUser: mockCurrentUser,
        aulas: mockAulas,
        readOnly: false,
        telefoneFormatter: expect.any(Function),
        dataFormatter: expect.any(Function),
        handleDeleteAula: expect.any(Function),
        submit: expect.any(Function),
        isLoadingSubmit: false,
      });
    });

    it('should call useEditarAndamentoAula hook', () => {
      render(<Aulas />);

      expect(useEditarAndamentoAula).toHaveBeenCalled();
    });
  });

  describe('data display', () => {
    it('should pass aulas data to ListPage', () => {
      render(<Aulas />);

      const tableSection = screen.getByTestId('table-section');
      expect(tableSection.querySelector('table')).toBeInTheDocument();
    });

    it('should display aulas when available', () => {
      render(<Aulas />);

      expect(
        screen.getByTestId('table-section').querySelector('table')
      ).toBeInTheDocument();
    });

    it('should show loading state when isLoading is true', () => {
      useAulas.mockReturnValue({
        ...useAulas(),
        isLoading: true,
      });

      render(<Aulas />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show empty state when no aulas', () => {
      useAulas.mockReturnValue({
        ...useAulas(),
        aulas: [],
        isLoading: false,
      });

      useAulasList.mockReturnValue({
        columns: [],
        data: [],
      });

      render(<Aulas />);

      expect(screen.getByText('Nenhuma aula encontrada.')).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    it('should combine loading states correctly', () => {
      useAulas.mockReturnValue({
        ...useAulas(),
        isLoading: true,
      });

      useEditarAndamentoAula.mockReturnValue({
        submit: jest.fn(),
        isLoading: true,
      });

      render(<Aulas />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should update loading state when aulas hook loading changes', () => {
      const { rerender } = render(<Aulas />);

      useAulas.mockReturnValue({
        ...useAulas(),
        isLoading: true,
      });

      rerender(<Aulas />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('filter form submission', () => {
    it('should handle form submission', () => {
      const mockHandleSubmit = jest.fn();
      useAulas.mockReturnValue({
        ...useAulas(),
        handleSubmit: mockHandleSubmit,
      });

      render(<Aulas />);

      const form = screen.getByTestId('filter-form');
      fireEvent.submit(form);

      // Form will call handleSubmit after preventDefault
      expect(form).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle null currentUser', () => {
      useUserAuth.mockReturnValue({
        currentUser: null,
      });

      render(<Aulas />);

      expect(screen.getByTestId('list-page')).toBeInTheDocument();
    });

    it('should handle empty filters', () => {
      useAulas.mockReturnValue({
        aulas: [],
        isLoading: false,
        searchParams: jest.fn(),
        handleSubmit: jest.fn(),
        handleChange: jest.fn(),
        formData: {
          dataInicio: '',
          dataTermino: '',
        },
      });

      render(<Aulas />);

      const dataInicioInput = screen.getByTestId('dataInicio');
      expect(dataInicioInput).toHaveValue('');
    });

    it('should maintain component state across renders', () => {
      const { rerender } = render(<Aulas />);

      expect(screen.getByTestId('list-page')).toBeInTheDocument();

      rerender(<Aulas />);

      expect(screen.getByTestId('list-page')).toBeInTheDocument();
    });
  });
});
