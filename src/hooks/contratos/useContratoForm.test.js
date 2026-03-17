import { renderHook, act } from '@testing-library/react';
import { useContratoForm } from './useContratoForm';

jest.mock('@/providers/UserAuthProvider', () => ({
  useUserAuth: () => ({
    currentUser: { id: 10, nome: 'Professor 1' },
    settings: { duracaoAula: 40 },
  }),
}));
jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));
jest.mock('@/hooks/useSweetAlert', () => () => ({
  showForm: jest.fn(async () => ({ isConfirmed: false })),
  showSuccess: jest.fn(),
}));

describe('useContratoForm Hook', () => {
  const alunos = [
    { id: 1, nome: 'Aluno 1' },
    { id: 2, nome: 'Aluno 2' },
  ];
  const professores = [
    { id: 10, nome: 'Professor 1' },
    { id: 20, nome: 'Professor 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Data Management', () => {
    it('should initialize formData with default values', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      expect(result.current.formData).toHaveProperty('professorId');
      expect(result.current.formData).toHaveProperty('alunoId');
      expect(result.current.formData).toHaveProperty('diasAulas');
      expect(result.current.formData).toHaveProperty('aulas');
      expect(result.current.formData.aulas).toEqual([]);
    });

    it('should update formData on handleChange', () => {
      const submit = jest.fn();
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

    it('should handle multiple field changes', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );
      act(() => {
        result.current.handleChange({
          target: { name: 'dataInicio', value: '2024-01-01' },
        });
        result.current.handleChange({
          target: { name: 'dataTermino', value: '2024-12-31' },
        });
        result.current.handleChange({
          target: { name: 'idioma', value: 'ENGLISH' },
        });
      });
      expect(result.current.formData.dataInicio).toBe('2024-01-01');
      expect(result.current.formData.dataTermino).toBe('2024-12-31');
      expect(result.current.formData.idioma).toBe('ENGLISH');
    });
  });

  describe('Aluno and Professor Selection', () => {
    it('should set aluno on handleAlunoChange', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );
      act(() => {
        result.current.handleAlunoChange({
          target: { name: 'alunoId', value: '2' },
        });
      });
      expect(result.current.formData.aluno).toEqual(alunos[1]);
      expect(result.current.formData.alunoId).toBe('2');
    });

    it('should set aluno to null when invalid id is provided', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );
      act(() => {
        result.current.handleAlunoChange({
          target: { name: 'alunoId', value: '999' },
        });
      });
      expect(result.current.formData.aluno).toBeNull();
    });

    it('should set professor on handleProfessorChange', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );
      act(() => {
        result.current.handleProfessorChange({
          target: { name: 'professorId', value: '20' },
        });
      });
      expect(result.current.formData.professor).toEqual(professores[1]);
      expect(result.current.formData.professorId).toBe('20');
    });

    it('should set professor to null when invalid id is provided', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );
      act(() => {
        result.current.handleProfessorChange({
          target: { name: 'professorId', value: '999' },
        });
      });
      expect(result.current.formData.professor).toBeNull();
    });
  });

  describe('Dias de Aula Management', () => {
    it('should initialize diasAulas with all days of week inactive', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const diasAulas = result.current.formData.diasAulas;
      expect(diasAulas.length).toBe(7);
      diasAulas.forEach(dia => {
        expect(dia.ativo).toBe(false);
        expect(dia.horaInicial).toBe('');
        expect(dia.horaFinal).toBe('');
        expect(dia.quantidadeAulas).toBe(1);
      });
    });

    it('should toggle dia ativo on handleAtivoChange', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: true },
        });
      });

      const segudaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segudaDia.ativo).toBe(true);

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: false },
        });
      });
      const segudaDiaAfter = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segudaDiaAfter.ativo).toBe(false);
    });

    it('should update horaInicial and calculate horaFinal', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: true },
        });
      });

      act(() => {
        result.current.handleHoraInicialChange({
          target: { name: 'SEGUNDA', value: '10:00' },
        });
      });

      const segudaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segudaDia.horaInicial).toBe('10:00');
      expect(segudaDia.horaFinal).toBe('10:40'); // 40 min = 1 aula default
    });

    it('should calculate correct horaFinal for multiple aulas', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'TERCA', checked: true },
        });
      });

      act(() => {
        result.current.handleQuantidadeAulasChange({
          target: { name: 'TERCA', value: 2 },
        });
      });

      act(() => {
        result.current.handleHoraInicialChange({
          target: { name: 'TERCA', value: '14:00' },
        });
      });

      const tercaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'TERCA'
      );
      expect(tercaDia.horaFinal).toBe('15:20'); // 14:00 + 80 min (2 * 60)
    });

    it('should update quantidade de aulas', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'QUARTA', checked: true },
        });
      });

      act(() => {
        result.current.handleQuantidadeAulasChange({
          target: { name: 'QUARTA', value: 3 },
        });
      });

      const quartaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'QUARTA'
      );
      expect(quartaDia.quantidadeAulas).toBe(3);
    });
  });

  describe('Form Submission', () => {
    it('should call submit on handleSubmit', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'alunoId', value: '1' },
        });
        result.current.handleChange({
          target: { name: 'professorId', value: '10' },
        });
      });

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(submit).toHaveBeenCalled();
    });

    it('should format data correctly on submit for new contrato', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit, isEdit: false })
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'alunoId', value: '1' },
        });
        result.current.handleChange({
          target: { name: 'professorId', value: '10' },
        });
        result.current.handleChange({
          target: { name: 'dataInicio', value: '2024-01-01' },
        });
        result.current.handleChange({
          target: { name: 'dataTermino', value: '2024-12-31' },
        });
        result.current.handleChange({
          target: { name: 'idioma', value: 'ENGLISH' },
        });
        result.current.handleChange({
          target: { name: 'status', value: 'ATIVO' },
        });
      });

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });

      expect(submit).toHaveBeenCalledWith(
        expect.objectContaining({
          idAluno: '1',
          idProfessor: '10',
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
          idioma: 'ENGLISH',
          status: 'ATIVO',
        })
      );
    });

    it('should format data correctly on submit with isEdit flag', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit, isEdit: true })
      );

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          contratoId: 123,
          alunoId: '1',
          professorId: '10',
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
          idioma: 'ENGLISH',
          status: 'ATIVO',
        }));
      });

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });

      expect(submit).toHaveBeenCalledWith(123, expect.any(Object));
    });
  });

  describe('Aulas Management', () => {
    it('should add new aula to formData', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const newAula = {
        id: 1,
        dataAula: '2024-01-15T00:00:00.000Z',
        horaInicial: '10:00',
        horaFinal: '11:00',
        tipo: 'PADRAO',
        observacao: 'Sem observações',
      };

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          aulas: [...prev.aulas, newAula],
        }));
      });

      expect(result.current.formData.aulas).toContain(newAula);
      expect(result.current.formData.aulas.length).toBe(1);
    });

    it('should delete aula from formData', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const aula1 = {
        id: 1,
        dataAula: '2024-01-15T00:00:00.000Z',
        horaInicial: '10:00',
        horaFinal: '11:00',
        tipo: 'PADRAO',
      };
      const aula2 = {
        id: 2,
        dataAula: '2024-01-17T00:00:00.000Z',
        horaInicial: '14:00',
        horaFinal: '15:00',
        tipo: 'PADRAO',
      };

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          aulas: [aula1, aula2],
        }));
      });

      act(() => {
        result.current.handleDeleteAula(1);
      });

      expect(result.current.formData.aulas.length).toBe(1);
      expect(result.current.formData.aulas[0].id).toBe(2);
    });

    it('should not delete aula if id does not exist', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const aula = {
        id: 1,
        dataAula: '2024-01-15T00:00:00.000Z',
        horaInicial: '10:00',
        horaFinal: '11:00',
        tipo: 'PADRAO',
      };

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          aulas: [aula],
        }));
      });

      act(() => {
        result.current.handleDeleteAula(999);
      });

      expect(result.current.formData.aulas.length).toBe(1);
    });
  });

  describe('Initial Dias Aulas Setup', () => {
    it('should call setInitialDiasAulas on mount', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const diasAulas = result.current.formData.diasAulas;
      expect(diasAulas.length).toBe(7);
    });

    it('should populate diasAulas with existing data when provided', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const existingDiasAulas = [
        {
          diaSemana: 'SEGUNDA',
          ativo: true,
          horaInicial: '10:00',
          horaFinal: '11:00',
          quantidadeAulas: 1,
        },
        {
          diaSemana: 'QUARTA',
          ativo: true,
          horaInicial: '14:00',
          horaFinal: '15:00',
          quantidadeAulas: 1,
        },
      ];

      act(() => {
        result.current.setInitialDiasAulas(existingDiasAulas);
      });

      const diasAulas = result.current.formData.diasAulas;
      const segundaDia = diasAulas.find(d => d.diaSemana === 'SEGUNDA');
      const quartaDia = diasAulas.find(d => d.diaSemana === 'QUARTA');

      expect(segundaDia.ativo).toBe(true);
      expect(quartaDia.ativo).toBe(true);
    });
  });

  describe('Hora Final Calculation', () => {
    it('should calculate hora final correctly for 1 hour duration', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: true },
        });
      });

      act(() => {
        result.current.handleQuantidadeAulasChange({
          target: { name: 'SEGUNDA', value: 1 },
        });
      });

      act(() => {
        result.current.handleHoraInicialChange({
          target: { name: 'SEGUNDA', value: '09:30' },
        });
      });

      const segudaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      // 09:30 + 40 min (1 * 40) = 10:10
      expect(segudaDia.horaFinal).toBe('10:10');
    });

    it('should handle hora final at midnight boundary', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SABADO', checked: true },
        });
      });

      act(() => {
        result.current.handleQuantidadeAulasChange({
          target: { name: 'SABADO', value: 3 },
        });
      });

      act(() => {
        result.current.handleHoraInicialChange({
          target: { name: 'SABADO', value: '23:00' },
        });
      });

      const sabadoDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SABADO'
      );
      // 23:00 + 120 min (3 * 40) = 01:00 (midnight boundary)
      expect(sabadoDia.horaFinal).toBe('01:00');
    });
  });
});
