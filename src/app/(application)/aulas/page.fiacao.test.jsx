import { render, screen, fireEvent } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import Aulas from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useDeletarAula } from '@/hooks/aulas/useDeletarAula';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useEditarAndamentoAula } from '@/hooks/aulas/useEditarAndamentoAula';
import { useProfessores } from '@/hooks/professores/useProfessores';
import {
  FILTER_STORAGE_KEYS,
  FILTER_PANEL_STORAGE_KEYS,
  STATUS,
} from '@/constants';

// Prova de fiação real (AC-001-012/021): NÃO mocka '@/components' (que
// automocaria ListPage/PainelFiltrosColapsavel — a suíte `page.test.jsx` já
// cobre o comportamento superficial com esse automock, mas ele não serve a
// esta prova) nem `@/hooks/aulas/useAulas` (precisamos do cálculo real de
// `appliedCount` e da leitura real de `localStorage`). Só os colaboradores
// alheios ao painel são mockados.
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/store/slices/aulasSlice', () => ({
  getAulas: jest.fn(() => ({ type: 'getAulas' })),
}));
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/aulas/useDeletarAula');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/aulas/useAulasList');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/aulas/useEditarAndamentoAula');
jest.mock('@/hooks/professores/useProfessores');

const mockDispatch = jest.fn();

describe('Aulas — fiação real do painel colapsável (AC-001-012/021)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(cb =>
      cb({ aulas: { list: [], status: 'idle', action: null } })
    );

    useUserAuth.mockReturnValue({ currentUser: { id: 1, nome: 'Professor' } });
    useDeletarAula.mockReturnValue({ handleDeleteAula: jest.fn() });
    useFormater.mockReturnValue({
      telefoneFormatter: v => v,
      dataFormatter: v => v,
    });
    useAulasList.mockReturnValue({ columns: [], data: [] });
    useAlunos.mockReturnValue({ alunos: [] });
    useEditarAndamentoAula.mockReturnValue({
      submit: jest.fn(),
      isLoading: false,
    });
    useProfessores.mockReturnValue({ professores: [] });
  });

  it('localStorage pré-semeado (painel recolhido + 2 filtros não-default): painel já recolhido e contagem "2", sem nenhuma interação', () => {
    localStorage.setItem(
      FILTER_PANEL_STORAGE_KEYS.aulas,
      JSON.stringify('recolhido')
    );
    localStorage.setItem(
      FILTER_STORAGE_KEYS.aulas,
      JSON.stringify({ tipo: 'PADRAO', idAluno: '123' })
    );

    render(<Aulas />);

    expect(screen.getByTestId('painel-filtros-colapsavel')).toHaveAttribute(
      'data-panel-state',
      'recolhido'
    );
    expect(screen.getByTestId('painel-filtros-contagem')).toHaveTextContent(
      '2'
    );
  });

  it('sem preferência salva e sem filtro aplicado: painel aberto e sem indicação de contagem', () => {
    render(<Aulas />);

    expect(screen.getByTestId('painel-filtros-colapsavel')).not.toHaveAttribute(
      'data-panel-state'
    );
    expect(
      screen.queryByTestId('painel-filtros-contagem')
    ).not.toBeInTheDocument();
  });

  it('requisito emergente (achado 7 do gate 11): existe um único heading "Filtros" na árvore renderizada — prova que o filter.jsx não reintroduziu o <h3> que o painel colapsável já é dono', () => {
    render(<Aulas />);

    expect(
      screen.getAllByRole('heading', { name: 'Filtros', level: 3 })
    ).toHaveLength(1);
  });
});

describe('Aulas — isLoading/errorMessage de useAlunos()/useProfessores() chegam ao SearchableSelectField real', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(cb =>
      cb({ aulas: { list: [], status: 'idle', action: null } })
    );

    useUserAuth.mockReturnValue({ currentUser: { id: 1, nome: 'Professor' } });
    useDeletarAula.mockReturnValue({ handleDeleteAula: jest.fn() });
    useFormater.mockReturnValue({
      telefoneFormatter: v => v,
      dataFormatter: v => v,
    });
    useAulasList.mockReturnValue({ columns: [], data: [] });
    useEditarAndamentoAula.mockReturnValue({
      submit: jest.fn(),
      isLoading: false,
    });
  });

  it('useAlunos() com isLoading=true: o combobox real de Aluno mostra o indicador de carregamento ao abrir, não "Nenhum resultado encontrado"', () => {
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: true,
      status: STATUS.LOADING,
      action: 'getAlunos',
    });
    useProfessores.mockReturnValue({ professores: [] });

    render(<Aulas />);
    fireEvent.click(screen.getByRole('combobox', { name: /^aluno$/i }));

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(
      screen.queryByTestId('searchable-select-field-empty')
    ).not.toBeInTheDocument();
  });

  it('useAlunos() com status FAILED da ação getAlunos: o combobox real de Aluno mostra a frase fixa em pt-BR, nunca o `message` cru do slice', () => {
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'getAlunos',
      message: 'Request failed with status code 500',
    });
    useProfessores.mockReturnValue({ professores: [] });

    render(<Aulas />);
    fireEvent.click(screen.getByRole('combobox', { name: /^aluno$/i }));

    expect(
      screen.getByTestId('searchable-select-field-error')
    ).toHaveTextContent(
      'Não foi possível carregar os alunos. Tente novamente.'
    );
    expect(screen.queryByText(/request failed/i)).not.toBeInTheDocument();
  });

  it('useProfessores() com isLoading=true: o combobox real de Professor mostra o indicador de carregamento ao abrir', () => {
    useAlunos.mockReturnValue({ alunos: [] });
    useProfessores.mockReturnValue({
      professores: [],
      isLoading: true,
      status: STATUS.LOADING,
      action: 'getProfessores',
    });

    render(<Aulas />);
    fireEvent.click(screen.getByRole('combobox', { name: /^professor$/i }));

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('useProfessores() com status FAILED da ação getProfessores: o combobox real de Professor mostra a frase fixa em pt-BR, nunca o `message` cru do slice', () => {
    useAlunos.mockReturnValue({ alunos: [] });
    useProfessores.mockReturnValue({
      professores: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'getProfessores',
      message: 'Request failed with status code 500',
    });

    render(<Aulas />);
    fireEvent.click(screen.getByRole('combobox', { name: /^professor$/i }));

    expect(
      screen.getByTestId('searchable-select-field-error')
    ).toHaveTextContent(
      'Não foi possível carregar os professores. Tente novamente.'
    );
    expect(screen.queryByText(/request failed/i)).not.toBeInTheDocument();
  });

  it('useProfessores() com status FAILED de outra ação do slice (ex.: updateProfessor): o combobox real NÃO mostra erro — status é compartilhado entre ações do slice', () => {
    useAlunos.mockReturnValue({ alunos: [] });
    useProfessores.mockReturnValue({
      professores: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'updateProfessor',
    });

    render(<Aulas />);
    fireEvent.click(screen.getByRole('combobox', { name: /^professor$/i }));

    expect(
      screen.queryByTestId('searchable-select-field-error')
    ).not.toBeInTheDocument();
  });

  it('useAlunos() com status FAILED de outra ação do slice (ex.: updateAluno): o combobox real NÃO mostra erro — status é compartilhado entre ações do slice', () => {
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'updateAluno',
    });
    useProfessores.mockReturnValue({ professores: [] });

    render(<Aulas />);
    fireEvent.click(screen.getByRole('combobox', { name: /^aluno$/i }));

    expect(
      screen.queryByTestId('searchable-select-field-error')
    ).not.toBeInTheDocument();
  });
});
