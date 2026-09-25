import { render, screen, fireEvent, within } from '@testing-library/react';
import EditarContrato from './page';
import { useEditarContrato } from '@/hooks/contratos/useEditarContrato';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useFormater } from '@/hooks/useFormater';
import { useGenerateAulasByContrato } from '@/hooks/contratos/useGenerateAulasByContrato';
import { useUserAuth } from '@/providers/UserAuthProvider';

// Prova de fiação real: NÃO mocka `@/hooks/contratos/useContratoForm` (o hook
// que calcula `fieldErrors` a partir do submit bloqueado) nem `@/components`
// (o `ContratoForm`/`SearchableSelectField` reais) — só assim se prova que
// `fieldErrors` atravessa este container até a mensagem `role="alert"`
// visível no campo (AC-001-014). Só os colaboradores alheios a essa cadeia
// são mockados.
jest.mock('@/hooks/contratos/useEditarContrato');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/contratos/useGenerateAulasByContrato');
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/useSweetAlert', () => () => ({
  showForm: jest.fn(async () => ({ isConfirmed: false })),
  showSuccess: jest.fn(),
}));

// jest.setup.js mocka `next/navigation` sem `useParams`/`notFound` — este
// container precisa dos dois, então reaplica o mock por completo aqui (mesmo
// padrão de `page.test.jsx`).
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
  notFound: jest.fn(),
}));

describe('Editar Contrato — fieldErrors de useContratoForm() chega ao SearchableSelectField real (AC-001-014)', () => {
  const mockContrato = {
    id: 1,
    idAluno: 1,
    dataInicio: '2024-01-01',
    dataTermino: '2024-12-31',
    status: 'ATIVO',
    idioma: 'ENGLISH',
    aulas: [],
    diaAulas: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 10, nome: 'Professor 1' },
      settings: { duracaoAula: 40 },
    });

    useAlunos.mockReturnValue({
      alunos: [{ id: 1, nome: 'Aluno 1' }],
      alunoOptions: [{ value: 1, label: 'Aluno 1' }],
    });

    useProfessores.mockReturnValue({
      professores: [{ id: 10, nome: 'Professor 1' }],
      professorOptions: [{ value: 10, label: 'Professor 1' }],
    });

    useFormater.mockReturnValue({
      dataFormatter: jest.fn(date => date || ''),
      formatForInput: jest.fn(date => date || ''),
    });

    useGenerateAulasByContrato.mockReturnValue({
      generateAulasByContrato: jest.fn(),
      isSubmitting: false,
    });

    useEditarContrato.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      current: mockContrato,
      isNotFound: false,
      submit: jest.fn(),
    });
  });

  it('submit com Professor limpo pelo usuário: o requiredError chega ao campo Professor principal, anunciado por role="alert"', () => {
    render(<EditarContrato />);

    // O efeito de carga do contrato preenche o Aluno a partir de `current`;
    // com `current.aulas: []`, o Professor vem do fallback
    // `formData.professorId` (o `currentUser` mockado), não de `current` —
    // limpa o Professor para isolar o erro nele.
    const professorInput = screen.getByRole('combobox', {
      name: /^professor principal/i,
    });
    const professorClearButton = within(professorInput.parentElement).getByRole(
      'button',
      { name: 'Limpar seleção' }
    );
    fireEvent.click(professorClearButton);

    fireEvent.submit(screen.getByTestId('contrato-form'));

    const errorEl = screen.getByRole('alert');
    expect(errorEl).toHaveTextContent('Selecione um professor principal.');
  });

  it('controle positivo: com os dados do contrato existente já preenchidos, o submit não bloqueia e nenhum requiredError aparece', () => {
    const submit = jest.fn();
    useEditarContrato.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      current: mockContrato,
      isNotFound: false,
      submit,
    });

    render(<EditarContrato />);

    fireEvent.submit(screen.getByTestId('contrato-form'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(submit).toHaveBeenCalled();
  });
});
