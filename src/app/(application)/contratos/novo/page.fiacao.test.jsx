import { render, screen, fireEvent } from '@testing-library/react';
import NovoContrato from './page';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useFormater } from '@/hooks/useFormater';
import { useNovoContrato } from '@/hooks/contratos/useNovoContrato';
import { useGenerateAulasByContrato } from '@/hooks/contratos/useGenerateAulasByContrato';
import { useUserAuth } from '@/providers/UserAuthProvider';

// Prova de fiação real: NÃO mocka `@/hooks/contratos/useContratoForm` (o hook
// que calcula `fieldErrors` a partir do submit bloqueado) nem `@/components`
// (o `ContratoForm`/`SearchableSelectField` reais) — só assim se prova que
// `fieldErrors` atravessa este container até a mensagem `role="alert"`
// visível no campo (AC-001-014). Só os colaboradores alheios a essa cadeia
// são mockados.
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/contratos/useNovoContrato');
jest.mock('@/hooks/contratos/useGenerateAulasByContrato');
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/useSweetAlert', () => () => ({
  showForm: jest.fn(async () => ({ isConfirmed: false })),
  showSuccess: jest.fn(),
}));

describe('Novo Contrato — fieldErrors de useContratoForm() chega ao SearchableSelectField real (AC-001-014)', () => {
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

    useNovoContrato.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      submit: jest.fn(),
    });

    useGenerateAulasByContrato.mockReturnValue({
      generateAulasByContrato: jest.fn(),
      isSubmitting: false,
    });
  });

  it('submit com Aluno vazio: o requiredError chega ao campo Aluno, anunciado por role="alert"', () => {
    render(<NovoContrato />);

    fireEvent.submit(screen.getByTestId('contrato-form'));

    const errorEl = screen.getByRole('alert');
    expect(errorEl).toHaveTextContent('Selecione um aluno.');
  });

  it('submit com Professor limpo pelo usuário: o requiredError chega ao campo Professor principal, anunciado por role="alert"', () => {
    render(<NovoContrato />);

    // Único botão de limpar visível de início é o do Professor — o campo
    // nasce preenchido com o currentUser mockado (Aluno nasce vazio).
    fireEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }));

    // Preenche Aluno para isolar o erro em Professor.
    fireEvent.click(screen.getByRole('combobox', { name: /^aluno/i }));
    fireEvent.click(screen.getByText('Aluno 1'));

    fireEvent.submit(screen.getByTestId('contrato-form'));

    const errorEl = screen.getByRole('alert');
    expect(errorEl).toHaveTextContent('Selecione um professor principal.');
  });

  it('controle positivo: com Aluno e Professor preenchidos, o submit não bloqueia e nenhum requiredError aparece', () => {
    const submit = jest.fn();
    useNovoContrato.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      submit,
    });

    render(<NovoContrato />);

    fireEvent.click(screen.getByRole('combobox', { name: /^aluno/i }));
    fireEvent.click(screen.getByText('Aluno 1'));

    fireEvent.submit(screen.getByTestId('contrato-form'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(submit).toHaveBeenCalled();
  });
});
