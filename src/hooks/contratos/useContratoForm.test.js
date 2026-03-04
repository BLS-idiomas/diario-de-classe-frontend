import { renderHook, act } from '@testing-library/react';
import { useContratoForm } from './useContratoForm';

jest.mock('@/providers/UserAuthProvider', () => ({
  useUserAuth: () => ({
    currentUser: { id: 10, nome: 'Professor 1' },
    settings: { duracaoAula: 60 },
  }),
}));
jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));
jest.mock('@/hooks/useSweetAlert', () => () => ({
  showForm: jest.fn(async () => ({ isConfirmed: false })),
  showSuccess: jest.fn(),
}));

describe('useContratoForm', () => {
  const alunos = [
    { id: 1, nome: 'Aluno 1' },
    { id: 2, nome: 'Aluno 2' },
  ];
  const professores = [
    { id: 10, nome: 'Professor 1' },
    { id: 20, nome: 'Professor 2' },
  ];
  const submit = jest.fn();

  it('should update formData on handleChange', () => {
    const { result } = renderHook(() =>
      useContratoForm({ alunos, professores, submit })
    );
    act(() => {
      result.current.handleChange({
        target: { name: 'dataInicio', value: '2024-01-01' },
      });
    });
    expect(result.current.formData.dataInicio).toBe('2024-01-01');
  });

  it('should set aluno on handleAlunoChange', () => {
    const { result } = renderHook(() =>
      useContratoForm({ alunos, professores, submit })
    );
    act(() => {
      result.current.handleAlunoChange({
        target: { name: 'alunoId', value: '2' },
      });
    });
    expect(result.current.formData.aluno).toEqual(alunos[1]);
  });

  it('should set professor on handleProfessorChange', () => {
    const { result } = renderHook(() =>
      useContratoForm({ alunos, professores, submit })
    );
    act(() => {
      result.current.handleProfessorChange({
        target: { name: 'professorId', value: '20' },
      });
    });
    expect(result.current.formData.professor).toEqual(professores[1]);
  });

  it('should call submit on handleSubmit', () => {
    const { result } = renderHook(() =>
      useContratoForm({ alunos, professores, submit })
    );
    const fakeEvent = { preventDefault: jest.fn() };
    act(() => {
      result.current.handleSubmit(fakeEvent);
    });
    expect(submit).toHaveBeenCalled();
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });
});
