import { render, screen, fireEvent } from '@testing-library/react';
import NovoAula from './page';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useFormater } from '@/hooks/useFormater';
import { useNovaAula } from '@/hooks/aulas/useNovaAula';
import { useUserAuth } from '@/providers/UserAuthProvider';

// Prova de fiação real: NÃO mocka `@/hooks/aulas/useAulaForm` (o hook que
// calcula `fieldErrors` a partir do submit bloqueado) nem `@/components` (o
// `AulaForm`/`SearchableSelectField` reais) — só assim se prova que
// `fieldErrors` atravessa este container até a mensagem `role="alert"`
// visível no campo (AC-001-014). Só os colaboradores alheios a essa cadeia
// são mockados.
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/contratos/useContratos');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/aulas/useNovaAula');
jest.mock('@/providers/UserAuthProvider');

describe('Nova Aula — fieldErrors de useAulaForm() chega ao SearchableSelectField real (AC-001-014)', () => {
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

    useNovaAula.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      submit: jest.fn(),
    });
  });

  it('submit com Aluno/Professor/Contrato vazios: cada combobox recebe sua própria mensagem, ligada via aria-describedby (não uma genérica)', () => {
    render(<NovoAula />);

    fireEvent.submit(screen.getByTestId('aula-form'));

    const alunoCombobox = screen.getByRole('combobox', { name: /^aluno/i });
    const professorCombobox = screen.getByRole('combobox', {
      name: /^professor/i,
    });
    const contratoCombobox = screen.getByRole('combobox', {
      name: /^contrato/i,
    });

    expect(alunoCombobox).toHaveAccessibleDescription('Selecione um aluno.');
    expect(professorCombobox).toHaveAccessibleDescription(
      'Selecione um professor.'
    );
    expect(contratoCombobox).toHaveAccessibleDescription(
      'Selecione um contrato.'
    );
  });

  it('submit só com Contrato vazio (Aluno e Professor preenchidos): o requiredError chega só ao campo Contrato, ligado via aria-describedby, e o foco vai para o combobox Contrato', () => {
    render(<NovoAula />);

    fireEvent.click(screen.getByRole('combobox', { name: /^aluno/i }));
    fireEvent.click(screen.getByText('Aluno Um <aluno1@example.com>'));

    fireEvent.click(screen.getByRole('combobox', { name: /^professor/i }));
    fireEvent.click(screen.getByText('Professor Um <professor1@example.com>'));

    fireEvent.submit(screen.getByTestId('aula-form'));

    const alunoCombobox = screen.getByRole('combobox', { name: /^aluno/i });
    const professorCombobox = screen.getByRole('combobox', {
      name: /^professor/i,
    });
    const contratoCombobox = screen.getByRole('combobox', {
      name: /^contrato/i,
    });

    expect(contratoCombobox).toHaveAccessibleDescription(
      'Selecione um contrato.'
    );
    expect(alunoCombobox).not.toHaveAttribute('aria-describedby');
    expect(professorCombobox).not.toHaveAttribute('aria-describedby');
    expect(document.activeElement).toBe(contratoCombobox);
  });

  it('controle positivo: com Aluno, Professor e Contrato preenchidos, o submit não bloqueia e nenhum requiredError aparece', () => {
    const submit = jest.fn();
    useNovaAula.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      submit,
    });

    render(<NovoAula />);

    fireEvent.click(screen.getByRole('combobox', { name: /^aluno/i }));
    fireEvent.click(screen.getByText('Aluno Um <aluno1@example.com>'));

    fireEvent.click(screen.getByRole('combobox', { name: /^professor/i }));
    fireEvent.click(screen.getByText('Professor Um <professor1@example.com>'));

    fireEvent.click(screen.getByRole('combobox', { name: /^contrato/i }));
    fireEvent.click(screen.getByText(/^ATIVO - de/));

    fireEvent.submit(screen.getByTestId('aula-form'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(submit).toHaveBeenCalled();
  });
});
