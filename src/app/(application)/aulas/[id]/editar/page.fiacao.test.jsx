import { render, screen, fireEvent, within } from '@testing-library/react';
import EditarAula from './page';
import { useEditarAula } from '@/hooks/aulas/useEditarAula';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useFormater } from '@/hooks/useFormater';
import { useUserAuth } from '@/providers/UserAuthProvider';

// Prova de fiação real: NÃO mocka `@/hooks/aulas/useAulaForm` (o hook que
// calcula `fieldErrors` a partir do submit bloqueado) nem `@/components` (o
// `AulaForm`/`SearchableSelectField` reais) — só assim se prova que
// `fieldErrors` atravessa este container até a mensagem `role="alert"`
// visível no campo (AC-001-014). Só os colaboradores alheios a essa cadeia
// são mockados.
jest.mock('@/hooks/aulas/useEditarAula');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/contratos/useContratos');
jest.mock('@/hooks/useFormater');
jest.mock('@/providers/UserAuthProvider');

// jest.setup.js mocka `next/navigation` sem `useParams`/`notFound` — este
// container precisa dos dois, então reaplica o mock por completo aqui (mesmo
// padrão de `page.test.jsx`).
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
  notFound: jest.fn(),
}));

describe('Editar Aula — fieldErrors de useAulaForm() chega ao SearchableSelectField real (AC-001-014)', () => {
  const mockAula = {
    id: 1,
    idAluno: 1,
    idProfessor: 10,
    idContrato: 100,
    dataAula: '2024-01-15T10:00:00Z',
    duracaoAula: 40,
    horaInicial: '10:00',
    horaFinal: '10:40',
    tipo: 'PADRAO',
    status: 'AGENDADA',
    observacao: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      isAdmin: () => true,
      currentUser: {
        id: 10,
        nome: 'Professor',
        sobrenome: 'Um',
        email: 'professor1@example.com',
      },
    });

    useAlunos.mockReturnValue({
      alunos: [
        { id: 1, nome: 'Aluno', sobrenome: 'Um', email: 'aluno1@example.com' },
      ],
    });

    useProfessores.mockReturnValue({
      professores: [
        {
          id: 10,
          nome: 'Professor',
          sobrenome: 'Um',
          email: 'professor1@example.com',
        },
      ],
    });

    useContratos.mockReturnValue({
      contratos: [
        {
          id: 100,
          idAluno: 1,
          status: 'ATIVO',
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
      ],
    });

    useFormater.mockReturnValue({
      dataFormatter: jest.fn(date => date || ''),
    });

    useEditarAula.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      current: mockAula,
      statusError: null,
      submit: jest.fn(),
    });
  });

  it('submit com Contrato limpo pelo usuário: o requiredError chega só ao campo Contrato, ligado via aria-describedby (não uma mensagem genérica)', () => {
    render(<EditarAula />);

    const alunoCombobox = screen.getByRole('combobox', { name: /^aluno/i });
    const professorCombobox = screen.getByRole('combobox', {
      name: /^professor/i,
    });
    const contratoInput = screen.getByRole('combobox', {
      name: /^contrato/i,
    });
    const clearButton = within(contratoInput.parentElement).getByRole(
      'button',
      { name: 'Limpar seleção' }
    );
    fireEvent.click(clearButton);

    fireEvent.submit(screen.getByTestId('aula-form'));

    expect(contratoInput).toHaveAccessibleDescription('Selecione um contrato.');
    expect(alunoCombobox).not.toHaveAttribute('aria-describedby');
    expect(professorCombobox).not.toHaveAttribute('aria-describedby');
  });

  it('controle positivo: com os dados da aula existente já preenchidos, o submit não bloqueia e nenhum requiredError aparece', () => {
    const submit = jest.fn();
    useEditarAula.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      current: mockAula,
      statusError: null,
      submit,
    });

    render(<EditarAula />);

    fireEvent.submit(screen.getByTestId('aula-form'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(submit).toHaveBeenCalled();
  });
});
