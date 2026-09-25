import { render, screen, fireEvent } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import Contratos from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useDeletarContrato } from '@/hooks/contratos/useDeletarContrato';
import { useFormater } from '@/hooks/useFormater';
import { useContratosList } from '@/hooks/contratos/useContratosList';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import {
  FILTER_STORAGE_KEYS,
  FILTER_PANEL_STORAGE_KEYS,
  STATUS,
} from '@/constants';

// Prova de fiação real (AC-001-012/021 — cenário irmão de /aulas, código
// próprio deste hook): NÃO mocka '@/components' (que automocaria
// ListPage/PainelFiltrosColapsavel — a suíte `page.test.jsx` já cobre o
// comportamento superficial com esse automock, mas ele não serve a esta
// prova) nem `@/hooks/contratos/useContratos` (precisamos do cálculo real de
// `appliedCount` e da leitura real de `localStorage`). Só os colaboradores
// alheios ao painel são mockados.
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/store/slices/contratosSlice', () => ({
  getContratos: jest.fn(() => ({ type: 'getContratos' })),
}));
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/contratos/useDeletarContrato');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/contratos/useContratosList');
jest.mock('@/hooks/alunos/useAlunos');

const mockDispatch = jest.fn();

describe('Contratos — fiação real do painel colapsável (AC-001-012/021)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(cb =>
      cb({ contratos: { list: [], status: 'idle', action: null } })
    );

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: () => true,
    });
    useDeletarContrato.mockReturnValue({ handleDeleteContrato: jest.fn() });
    useFormater.mockReturnValue({
      telefoneFormatter: v => v,
      dataFormatter: v => v,
    });
    useContratosList.mockReturnValue({ columns: [], data: [] });
    useAlunos.mockReturnValue({ alunos: [] });
  });

  it('localStorage pré-semeado (painel recolhido + 2 filtros não-default): painel já recolhido e contagem "2", sem nenhuma interação', () => {
    localStorage.setItem(
      FILTER_PANEL_STORAGE_KEYS.contratos,
      JSON.stringify('recolhido')
    );
    localStorage.setItem(
      FILTER_STORAGE_KEYS.contratos,
      JSON.stringify({ idioma: 'INGLES', idAluno: '123' })
    );

    render(<Contratos />);

    expect(screen.getByTestId('painel-filtros-colapsavel')).toHaveAttribute(
      'data-panel-state',
      'recolhido'
    );
    expect(screen.getByTestId('painel-filtros-contagem')).toHaveTextContent(
      '2'
    );
  });

  it('sem preferência salva e sem filtro aplicado: painel aberto e sem indicação de contagem', () => {
    render(<Contratos />);

    expect(screen.getByTestId('painel-filtros-colapsavel')).not.toHaveAttribute(
      'data-panel-state'
    );
    expect(
      screen.queryByTestId('painel-filtros-contagem')
    ).not.toBeInTheDocument();
  });

  it('requisito emergente (achado 7 do gate 11): existe um único heading "Filtros" na árvore renderizada — prova que o filter.jsx não reintroduziu o <h3> que o painel colapsável já é dono', () => {
    render(<Contratos />);

    expect(
      screen.getAllByRole('heading', { name: 'Filtros', level: 3 })
    ).toHaveLength(1);
  });
});

describe('Contratos — isLoading/errorMessage de useAlunos() chegam ao SearchableSelectField real', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(cb =>
      cb({ contratos: { list: [], status: 'idle', action: null } })
    );

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: () => true,
    });
    useDeletarContrato.mockReturnValue({ handleDeleteContrato: jest.fn() });
    useFormater.mockReturnValue({
      telefoneFormatter: v => v,
      dataFormatter: v => v,
    });
    useContratosList.mockReturnValue({ columns: [], data: [] });
  });

  it('useAlunos() com isLoading=true: o combobox real mostra o indicador de carregamento ao abrir, não "Nenhum resultado encontrado"', () => {
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: true,
      status: STATUS.LOADING,
      action: 'getAlunos',
    });

    render(<Contratos />);
    fireEvent.click(screen.getByRole('combobox', { name: /aluno/i }));

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(
      screen.queryByTestId('searchable-select-field-empty')
    ).not.toBeInTheDocument();
  });

  it('useAlunos() com status FAILED da ação getAlunos: o combobox real mostra a frase fixa em pt-BR, nunca o `message` cru do slice', () => {
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'getAlunos',
      message: 'Request failed with status code 500',
    });

    render(<Contratos />);
    fireEvent.click(screen.getByRole('combobox', { name: /aluno/i }));

    expect(
      screen.getByTestId('searchable-select-field-error')
    ).toHaveTextContent(
      'Não foi possível carregar os alunos. Tente novamente.'
    );
    expect(screen.queryByText(/request failed/i)).not.toBeInTheDocument();
  });

  it('useAlunos() com status FAILED de outra ação do slice (ex.: updateAluno): o combobox real NÃO mostra erro — status é compartilhado entre ações do slice', () => {
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'updateAluno',
    });

    render(<Contratos />);
    fireEvent.click(screen.getByRole('combobox', { name: /aluno/i }));

    expect(
      screen.queryByTestId('searchable-select-field-error')
    ).not.toBeInTheDocument();
  });
});
