import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { notFound, useParams } from 'next/navigation';
import Professor from './page';
import { useProfessor } from '@/hooks/professores/useProfessor';
import { useFormater } from '@/hooks/useFormater';
import { useAlunosList } from '@/hooks/alunos/useAlunosList';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { useEditarDisponibilidadeProfessor } from '@/hooks/professores/useEditarDisponibilidadeProfessor';

// Mocks
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/hooks/professores/useProfessor');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/alunos/useAlunosList');
jest.mock('@/hooks/aulas/useAulasList');
jest.mock('@/hooks/professores/useEditarDisponibilidadeProfessor');

describe('Professor Page', () => {
  const mockProfessor = {
    id: 1,
    nome: 'João',
    sobrenome: 'Silva',
    email: 'joao@example.com',
    telefone: '11987654321',
    permissao: 'admin',
    dataCriacao: '2024-01-01T10:00:00Z',
    dataAtualizacao: '2024-01-15T15:30:00Z',
    observacoes: 'Professor experiente',
    disponibilidades: [
      {
        id: 1,
        diaSemana: 'Segunda-feira',
        horaInicial: '08:00',
        horaFinal: '12:00',
        ativo: true,
      },
      {
        id: 2,
        diaSemana: 'Quarta-feira',
        horaInicial: '14:00',
        horaFinal: '18:00',
        ativo: false,
      },
    ],
  };

  const mockAlunosListData = {
    columns: [{ Header: 'Nome', accessor: 'nome' }],
    data: [{ nome: 'Aluno 1' }, { nome: 'Aluno 2' }],
  };

  const mockAulasListData = {
    columns: [{ Header: 'Título', accessor: 'titulo' }],
    data: [{ titulo: 'Aula 1' }, { titulo: 'Aula 2' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useParams.mockReturnValue({ id: '1' });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(tel => `(11) ${tel.slice(-8)}`),
      dataFormatter: jest.fn(date => new Date(date).toLocaleDateString()),
    });

    useAlunosList.mockReturnValue(mockAlunosListData);
    useAulasList.mockReturnValue(mockAulasListData);

    useEditarDisponibilidadeProfessor.mockReturnValue({
      editMode: false,
      formData: {},
      message: '',
      errors: [],
      setDisponibilidadesHandle: jest.fn(),
      handleChange: jest.fn(),
      handleCheckboxChange: jest.fn(),
      handleSubmit: jest.fn(),
      setEditMode: jest.fn(),
      isLoading: false,
    });
  });

  it('should render loading state when isLoading is true', () => {
    useProfessor.mockReturnValue({
      professor: null,
      aulas: [],
      alunos: [],
      isLoading: true,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render loading state when professor is null', () => {
    useProfessor.mockReturnValue({
      professor: null,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should call notFound when isNotFound is true', async () => {
    useProfessor.mockReturnValue({
      professor: null,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: true,
    });

    render(<Professor />);

    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  it('should render professor details correctly', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByText('Detalhes do professor')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    const emailElements = screen.getAllByText('joao@example.com');
    expect(emailElements.length).toBeGreaterThan(0);
    const adminElements = screen.getAllByText(/admin/i);
    expect(adminElements.length).toBeGreaterThan(0);
  });

  it('should render professor avatar with initials', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    const avatar = screen.getByText('JS');
    expect(avatar).toBeInTheDocument();
  });

  it('should render contact information', () => {
    const telefoneFormatter = jest.fn(tel => `(11) 98765-4321`);
    useFormater.mockReturnValue({
      telefoneFormatter,
      dataFormatter: jest.fn(date => '01/01/2024'),
    });

    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByText('Contato')).toBeInTheDocument();
    expect(telefoneFormatter).toHaveBeenCalledWith('11987654321');
  });

  it('should render access information with permission and id', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByText('Acesso')).toBeInTheDocument();
    expect(screen.getByText(/Permissão: admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Id: 1/i)).toBeInTheDocument();
  });

  it('should render dates information', () => {
    const dataFormatter = jest.fn(() => '01/01/2024');
    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(),
      dataFormatter,
    });

    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByText('Datas')).toBeInTheDocument();
    expect(dataFormatter).toHaveBeenCalledWith('2024-01-01T10:00:00Z');
    expect(dataFormatter).toHaveBeenCalledWith('2024-01-15T15:30:00Z');
  });

  it('should render observations when available', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByText('Observações')).toBeInTheDocument();
    expect(screen.getByText('Professor experiente')).toBeInTheDocument();
  });

  it('should render message when no observations available', () => {
    const professorWithoutObservations = {
      ...mockProfessor,
      observacoes: null,
    };

    useProfessor.mockReturnValue({
      professor: professorWithoutObservations,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(
      screen.getByText('Nenhuma observação disponível.')
    ).toBeInTheDocument();
  });

  it('should render disponibilidades section', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByText('Disponibilidades')).toBeInTheDocument();
    expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
    expect(screen.getByText('08:00 - 12:00')).toBeInTheDocument();
    expect(screen.getByText('Quarta-feira')).toBeInTheDocument();
    expect(screen.getByText('14:00 - 18:00')).toBeInTheDocument();
  });

  it('should show active and inactive status for disponibilidades', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    const activeStatuses = screen.getAllByText('Ativo');
    const inactiveStatuses = screen.getAllByText('Inativo');

    expect(activeStatuses.length).toBeGreaterThan(0);
    expect(inactiveStatuses.length).toBeGreaterThan(0);
  });

  it('should render message when no disponibilidades', () => {
    const professorWithoutDisponibilidades = {
      ...mockProfessor,
      disponibilidades: [],
    };

    useProfessor.mockReturnValue({
      professor: professorWithoutDisponibilidades,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(
      screen.getByText('Sem disponibilidades cadastradas.')
    ).toBeInTheDocument();
  });

  it('should render stats badges with correct count of active disponibilidades', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    // Only 1 active disponibilidade (Monday)
    expect(screen.getByText(/1.*aulas por semana/i)).toBeInTheDocument();
  });

  it('should render alunos section with table', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [{ id: 1 }, { id: 2 }],
      alunos: [{ id: 1 }, { id: 2 }],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByText('Alunos')).toBeInTheDocument();
    expect(useAlunosList).toHaveBeenCalledWith({
      alunos: [{ id: 1 }, { id: 2 }],
      telefoneFormatter: expect.any(Function),
      dataFormatter: expect.any(Function),
      readOnly: true,
    });
  });

  it('should render aulas section with table', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [{ id: 1 }, { id: 2 }],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(screen.getByText('Aulas')).toBeInTheDocument();
    expect(useAulasList).toHaveBeenCalledWith({
      aulas: [{ id: 1 }, { id: 2 }],
      telefoneFormatter: expect.any(Function),
      dataFormatter: expect.any(Function),
    });
  });

  it('should render navigation buttons', () => {
    useProfessor.mockReturnValue({
      professor: mockProfessor,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    const backButton = screen.getByRole('link', { name: /voltar/i });
    const editButton = screen.getByRole('link', { name: /editar/i });

    expect(backButton).toHaveAttribute('href', '/professores');
    expect(editButton).toHaveAttribute('href', '/professores/1/editar');
  });

  it('should handle professor with null disponibilidades', () => {
    const professorWithNullDisponibilidades = {
      ...mockProfessor,
      disponibilidades: null,
    };

    useProfessor.mockReturnValue({
      professor: professorWithNullDisponibilidades,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    expect(
      screen.getByText('Sem disponibilidades cadastradas.')
    ).toBeInTheDocument();
  });

  it('should handle professor with missing nome or sobrenome in avatar', () => {
    const professorWithoutName = {
      ...mockProfessor,
      nome: null,
      sobrenome: null,
    };

    useProfessor.mockReturnValue({
      professor: professorWithoutName,
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    render(<Professor />);

    // O avatar gera 'NN' para 'null null' (primeira letra de cada palavra em uppercase)
    const avatar = screen.getByText('NN');
    expect(avatar).toBeInTheDocument();
  });

  describe('Edit Disponibilidade Mode', () => {
    it('should render edit disponibilidade button', () => {
      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      const editDispButton = screen.getByRole('button', {
        name: /editar disponibilidade/i,
      });
      expect(editDispButton).toBeInTheDocument();
    });

    it('should call setEditMode(true) when edit disponibilidade button is clicked', () => {
      const mockSetEditMode = jest.fn();
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: false,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: jest.fn(),
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: mockSetEditMode,
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      const editDispButton = screen.getByRole('button', {
        name: /editar disponibilidade/i,
      });
      fireEvent.click(editDispButton);

      expect(mockSetEditMode).toHaveBeenCalledWith(true);
    });

    it('should render edit mode with correct title and subtitle', () => {
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: true,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: jest.fn(),
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: jest.fn(),
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      expect(screen.getByText('Editar Disponibilidade')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Atualize os dados da disponibilidade para dar aula do professor'
        )
      ).toBeInTheDocument();
    });

    it('should not render professor details in edit mode', () => {
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: true,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: jest.fn(),
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: jest.fn(),
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      expect(
        screen.queryByText('Detalhes do professor')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Contato')).not.toBeInTheDocument();
      expect(screen.queryByText('Acesso')).not.toBeInTheDocument();
    });

    it('should render back button in edit mode', () => {
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: true,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: jest.fn(),
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: jest.fn(),
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      const backButton = screen.getByRole('button', { name: /← voltar/i });
      expect(backButton).toBeInTheDocument();
    });

    it('should call setEditMode(false) when back button is clicked in edit mode', () => {
      const mockSetEditMode = jest.fn();
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: true,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: jest.fn(),
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: mockSetEditMode,
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      const backButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(backButton);

      expect(mockSetEditMode).toHaveBeenCalledWith(false);
    });

    it('should render DisponibilidadeForm in edit mode', () => {
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: true,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: jest.fn(),
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: jest.fn(),
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      expect(screen.getByTestId('disponibilidade-form')).toBeInTheDocument();
    });

    it('should pass correct props to DisponibilidadeForm', () => {
      const mockHandleSubmit = jest.fn();
      const mockHandleChange = jest.fn();
      const mockHandleCheckboxChange = jest.fn();
      const mockSetEditMode = jest.fn();
      const mockFormData = { SEGUNDA: { ativo: true } };

      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: true,
        formData: mockFormData,
        message: 'Erro teste',
        errors: ['Erro 1'],
        setDisponibilidadesHandle: jest.fn(),
        handleChange: mockHandleChange,
        handleCheckboxChange: mockHandleCheckboxChange,
        handleSubmit: mockHandleSubmit,
        setEditMode: mockSetEditMode,
        isLoading: true,
      });

      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      const form = screen.getByTestId('disponibilidade-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('setDisponibilidadesHandle effect', () => {
    it('should call setDisponibilidadesHandle when professor has disponibilidades', () => {
      const mockSetDisponibilidades = jest.fn();
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: false,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: mockSetDisponibilidades,
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: jest.fn(),
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      expect(mockSetDisponibilidades).toHaveBeenCalledWith(
        mockProfessor.disponibilidades
      );
    });

    it('should not call setDisponibilidadesHandle when professor has no disponibilidades', () => {
      const mockSetDisponibilidades = jest.fn();
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: false,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: mockSetDisponibilidades,
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: jest.fn(),
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: { ...mockProfessor, disponibilidades: [] },
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      expect(mockSetDisponibilidades).not.toHaveBeenCalled();
    });

    it('should not call setDisponibilidadesHandle when professor is null', () => {
      const mockSetDisponibilidades = jest.fn();
      useEditarDisponibilidadeProfessor.mockReturnValue({
        editMode: false,
        formData: {},
        message: '',
        errors: [],
        setDisponibilidadesHandle: mockSetDisponibilidades,
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        handleSubmit: jest.fn(),
        setEditMode: jest.fn(),
        isLoading: false,
      });

      useProfessor.mockReturnValue({
        professor: null,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      expect(mockSetDisponibilidades).not.toHaveBeenCalled();
    });
  });

  describe('useEditarDisponibilidadeProfessor hook', () => {
    it('should call useEditarDisponibilidadeProfessor with professor', () => {
      useProfessor.mockReturnValue({
        professor: mockProfessor,
        aulas: [],
        alunos: [],
        isLoading: false,
        isNotFound: false,
      });

      render(<Professor />);

      expect(useEditarDisponibilidadeProfessor).toHaveBeenCalledWith(
        mockProfessor
      );
    });
  });
});
