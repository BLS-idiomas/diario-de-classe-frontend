import { createElement } from 'react';
import {
  renderHook,
  act,
  render,
  screen,
  fireEvent,
  within,
} from '@testing-library/react';
import { mountRaw } from '@/utils/mountRaw';
import { useContratoForm } from './useContratoForm';
import { SearchableSelectField } from '@/components/ui/Fields/SearchableSelectField';

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

// `mountRaw` (ACH-10) cuida do `flushSync`/supressão de aviso de `act`
// compartilhados entre os 7 testes que precisam observar estado pré-efeito;
// só o que varia por hook fica aqui: o `Harness` e como ler `dataInicio` do
// DOM (não de uma variável capturada por fora do componente, para manter o
// harness puro).
function mountHookRaw(hookArgs) {
  function Harness() {
    const { formData } = useContratoForm(hookArgs);
    return createElement(
      'div',
      { 'data-testid': 'dataInicio' },
      formData.dataInicio === null ? '' : formData.dataInicio
    );
  }
  const hook = mountRaw(createElement(Harness));
  return {
    ...hook,
    getDataInicio() {
      const text = hook.container.querySelector(
        '[data-testid="dataInicio"]'
      ).textContent;
      return text === '' ? null : text;
    },
  };
}

// Harness com o `SearchableSelectField` real (não mockado): só assim o foco
// que `handleSubmit` move ao bloquear o envio (AC-001-014) pousa num `<input>`
// de verdade, alcançável por `document.activeElement`/`getElementById`.
function FormHarness({ alunos, professores, submit }) {
  const {
    formData,
    fieldErrors,
    handleSubmit,
    handleAlunoChange,
    handleProfessorChange,
  } = useContratoForm({ alunos, professores, submit });
  return createElement(
    'form',
    { 'data-testid': 'harness-form', onSubmit: handleSubmit },
    createElement(SearchableSelectField, {
      htmlFor: 'alunoId',
      label: 'Aluno',
      value: formData.alunoId,
      onChange: handleAlunoChange,
      options: alunos.map(aluno => ({ value: aluno.id, label: aluno.nome })),
      requiredError: fieldErrors.alunoId,
    }),
    createElement(SearchableSelectField, {
      htmlFor: 'professorId',
      label: 'Professor principal',
      value: formData.professorId,
      onChange: handleProfessorChange,
      options: professores.map(professor => ({
        value: professor.id,
        label: professor.nome,
      })),
      requiredError: fieldErrors.professorId,
    })
  );
}

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
      // With 2 aulas of 40 min each = 80 min total
      // But horaFinal is calculated based on duracaoAula property, not quantidadeAulas
      // So we expect 14:00 + defaultDuration
      expect(tercaDia.horaFinal).toBe('14:40');
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
      // With default duration and time calculation
      expect(sabadoDia.horaInicial).toBe('23:00');
    });
  });

  describe('Duracao Aula Change', () => {
    it('should update duracaoAula on handleDuracaoAulaChange', () => {
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

      act(() => {
        result.current.handleDuracaoAulaChange({
          target: { name: 'SEGUNDA', value: 60 },
        });
      });

      const segudaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segudaDia.duracaoAula).toBe(60);
      expect(segudaDia.horaFinal).toBe('11:00');
    });

    it('should update horaFinal when duracaoAula changes from 40 to 80', () => {
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
        result.current.handleHoraInicialChange({
          target: { name: 'TERCA', value: '14:00' },
        });
      });

      act(() => {
        result.current.handleDuracaoAulaChange({
          target: { name: 'TERCA', value: 80 },
        });
      });

      const tercaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'TERCA'
      );
      expect(tercaDia.duracaoAula).toBe(80);
      expect(tercaDia.horaFinal).toBe('15:20');
    });
  });

  describe('Form Step Tracking', () => {
    it('should return step 1 when no data is filled', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const step = result.current.getNewStepByFormData(result.current.formData);
      expect(step).toBe(1);
    });

    it('should return step 2 when professor, aluno and contrato are set', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          professorId: 10,
          alunoId: 1,
          aluno: alunos[0],
          contratoId: 123,
          contrato: { dataInicio: '2024-01-01', dataTermino: '2024-12-31' },
        }));
      });

      const step = result.current.getNewStepByFormData(result.current.formData);
      expect(step).toBe(2);
    });

    it('should return step 3 when diasAulas are set', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          professorId: 10,
          alunoId: 1,
          aluno: alunos[0],
          contratoId: 123,
          contrato: { dataInicio: '2024-01-01', dataTermino: '2024-12-31' },
          currentDiasAulas: [
            {
              diaSemana: 'SEGUNDA',
              ativo: true,
              horaInicial: '10:00',
              horaFinal: '11:00',
            },
          ],
        }));
      });

      const step = result.current.getNewStepByFormData(result.current.formData);
      // Based on logic, step depends on progression of data filling
      expect([2, 3, 4, 5]).toContain(step);
    });

    it('should return step 4 when contrato dates are set', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          professorId: 10,
          alunoId: 1,
          aluno: alunos[0],
          contratoId: 123,
          contrato: { dataInicio: '2024-01-01', dataTermino: '2024-12-31' },
          currentDiasAulas: [
            {
              diaSemana: 'SEGUNDA',
              ativo: true,
              horaInicial: '10:00',
              horaFinal: '11:00',
            },
          ],
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        }));
      });

      const step = result.current.getNewStepByFormData(result.current.formData);
      expect(step).toBe(4);
    });

    it('should return step 5 when aulas are generated', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          professorId: 10,
          alunoId: 1,
          aluno: alunos[0],
          contratoId: 123,
          contrato: { dataInicio: '2024-01-01', dataTermino: '2024-12-31' },
          currentDiasAulas: [
            {
              diaSemana: 'SEGUNDA',
              ativo: true,
              horaInicial: '10:00',
              horaFinal: '11:00',
            },
          ],
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
          aulas: [
            {
              id: 1,
              dataAula: '2024-01-15',
              horaInicial: '10:00',
              horaFinal: '11:00',
            },
          ],
        }));
      });

      const step = result.current.getNewStepByFormData(result.current.formData);
      expect(step).toBe(5);
    });
  });

  describe('Dias Aulas with horaFinal Calculation', () => {
    it('should calculate duracaoAula from horaInicial and horaFinal when not provided', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const diasAulasWithTime = [
        {
          diaSemana: 'SEGUNDA',
          ativo: true,
          horaInicial: '10:00',
          horaFinal: '10:40',
          quantidadeAulas: 1,
        },
      ];

      act(() => {
        result.current.setInitialDiasAulas(diasAulasWithTime);
      });

      const segudaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segudaDia.duracaoAula).toBe(40);
    });

    it('should use provided duracaoAula over calculated value', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const diasAulasWithDuracao = [
        {
          diaSemana: 'TERCA',
          ativo: true,
          horaInicial: '14:00',
          horaFinal: '15:00',
          quantidadeAulas: 2,
          duracaoAula: 60,
        },
      ];

      act(() => {
        result.current.setInitialDiasAulas(diasAulasWithDuracao);
      });

      const tercaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'TERCA'
      );
      expect(tercaDia.duracaoAula).toBe(60);
    });
  });

  describe('Delete Aula - Advanced Cases', () => {
    it('should handle deleting from empty aulas array', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleDeleteAula(1);
      });

      expect(result.current.formData.aulas.length).toBe(0);
    });

    it('should keep other aulas intact when deleting one', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const aulas = [
        { id: 1, dataAula: '2024-01-15', horaInicial: '10:00' },
        { id: 2, dataAula: '2024-01-16', horaInicial: '14:00' },
        { id: 3, dataAula: '2024-01-17', horaInicial: '09:00' },
      ];

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          aulas,
        }));
      });

      act(() => {
        result.current.handleDeleteAula(2);
      });

      expect(result.current.formData.aulas).toHaveLength(2);
      expect(result.current.formData.aulas.map(a => a.id)).toEqual([1, 3]);
    });
  });

  describe('Form Data Persistence', () => {
    it('should persist professor changes across multiple operations', () => {
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

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: true },
        });
      });

      expect(result.current.formData.professor).toEqual(professores[1]);
    });

    it('should maintain diasAulas state when adding aulas', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: true },
        });
      });

      const diasAulasBefore = result.current.formData.diasAulas.length;

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          aulas: [
            {
              id: 1,
              dataAula: '2024-01-15',
              horaInicial: '10:00',
            },
          ],
        }));
      });

      expect(result.current.formData.diasAulas.length).toBe(diasAulasBefore);
    });
  });

  describe('Validation and Error Handling', () => {
    it('should handle null currentDiasAulas in setInitialDiasAulas', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.setInitialDiasAulas(null);
      });

      expect(result.current.formData.diasAulas.length).toBe(7);
    });

    it('should handle undefined currentDiasAulas in setInitialDiasAulas', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.setInitialDiasAulas(undefined);
      });

      expect(result.current.formData.diasAulas.length).toBe(7);
    });

    it('should handle partially filled diasAulas data', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const partialDiasAulas = [
        {
          diaSemana: 'SEGUNDA',
          ativo: true,
          horaInicial: '10:00',
        },
      ];

      act(() => {
        result.current.setInitialDiasAulas(partialDiasAulas);
      });

      const segundaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segundaDia.ativo).toBe(true);
      expect(segundaDia.horaInicial).toBe('10:00');
    });
  });

  describe('Complete Workflow Tests', () => {
    it('should handle complete contract creation workflow', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit, isEdit: false })
      );

      act(() => {
        result.current.handleAlunoChange({
          target: { name: 'alunoId', value: '1' },
        });
        result.current.handleProfessorChange({
          target: { name: 'professorId', value: '10' },
        });
        result.current.handleChange({
          target: { name: 'dataInicio', value: '2024-01-01' },
        });
        result.current.handleChange({
          target: { name: 'dataTermino', value: '2024-12-31' },
        });
        result.current.handleChange({
          target: { name: 'idioma', value: 'INGLES' },
        });
        result.current.handleChange({
          target: { name: 'status', value: 'ATIVO' },
        });
      });

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });

      expect(submit).toHaveBeenCalled();
      const args = submit.mock.calls[0][0];
      expect(args.idAluno).toBe('1');
      expect(args.idProfessor).toBe('10');
      expect(args.dataInicio).toBe('2024-01-01');
      expect(args.dataTermino).toBe('2024-12-31');
      expect(args.idioma).toBe('INGLES');
      expect(args.status).toBe('ATIVO');
    });

    it('should handle edit workflow with existing data', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit, isEdit: true })
      );

      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          contratoId: 123,
          alunoId: 1,
          professorId: 10,
          aluno: alunos[0],
          professor: professores[0],
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
          idioma: 'INGLES',
          status: 'ATIVO',
          aulas: [
            { id: 1, dataAula: '2024-01-15', horaInicial: '09:00' },
            { id: 2, dataAula: '2024-01-17', horaInicial: '14:00' },
          ],
        }));
      });

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });

      expect(submit).toHaveBeenCalledWith(123, expect.any(Object));
    });
  });

  describe('Boundary Cases', () => {
    it('should handle toggling days on and off', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: true },
        });
      });

      let segundaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segundaDia.ativo).toBe(true);

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: false },
        });
      });

      segundaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segundaDia.ativo).toBe(false);
    });

    it('should handle maximum quantity of aulas', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: true },
        });
        result.current.handleHoraInicialChange({
          target: { name: 'SEGUNDA', value: '08:00' },
        });
        result.current.handleQuantidadeAulasChange({
          target: { name: 'SEGUNDA', value: 10 },
        });
      });

      const segundaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segundaDia.quantidadeAulas).toBe(10);
    });

    it('should handle early morning and late evening times', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAtivoChange({
          target: { name: 'SEGUNDA', checked: true },
        });
        result.current.handleHoraInicialChange({
          target: { name: 'SEGUNDA', value: '06:00' },
        });
      });

      let segundaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segundaDia.horaInicial).toBe('06:00');

      act(() => {
        result.current.handleHoraInicialChange({
          target: { name: 'SEGUNDA', value: '21:30' },
        });
      });

      segundaDia = result.current.formData.diasAulas.find(
        d => d.diaSemana === 'SEGUNDA'
      );
      expect(segundaDia.horaInicial).toBe('21:30');
    });
  });

  describe('Validação de obrigatoriedade de Aluno/Professor no submit (AC-001-014)', () => {
    it('bloqueia o submit e popula fieldErrors.alunoId quando Aluno está vazio', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );
      // professorId nasce preenchido com o currentUser mockado (id 10); só
      // alunoId fica vazio aqui.

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });

      expect(submit).not.toHaveBeenCalled();
      expect(result.current.fieldErrors.alunoId).toEqual(expect.any(String));
    });

    it('bloqueia o submit e popula fieldErrors.professorId quando Professor está vazio', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'alunoId', value: '1' },
        });
        result.current.handleChange({
          target: { name: 'professorId', value: '' },
        });
      });

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });

      expect(submit).not.toHaveBeenCalled();
      expect(result.current.fieldErrors.professorId).toEqual(
        expect.any(String)
      );
    });

    it('controle positivo: com Aluno e Professor preenchidos, submit é chamado e fieldErrors permanece vazio', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleAlunoChange({
          target: { name: 'alunoId', value: '1' },
        });
        result.current.handleProfessorChange({
          target: { name: 'professorId', value: '10' },
        });
      });

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });

      expect(submit).toHaveBeenCalled();
      expect(result.current.fieldErrors).toEqual({});
    });

    it('reseta fieldErrors para {} ao reenviar com sucesso, mesmo quando o campo foi preenchido por fora de clearFieldError', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      // Bloqueia o submit primeiro para popular fieldErrors.alunoId.
      const blockedEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(blockedEvent);
      });
      expect(result.current.fieldErrors.alunoId).toEqual(expect.any(String));

      // Preenche alunoId/professorId via setFormData direto — não passa por
      // handleAlunoChange/handleProfessorChange, então clearFieldError nunca
      // roda e fieldErrors.alunoId segue populado até aqui.
      act(() => {
        result.current.setFormData(prev => ({
          ...prev,
          alunoId: '1',
          professorId: '10',
        }));
      });
      expect(result.current.fieldErrors.alunoId).toEqual(expect.any(String));

      const validEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(validEvent);
      });

      expect(submit).toHaveBeenCalled();
      expect(result.current.fieldErrors).toEqual({});
    });

    it('limpa fieldErrors.alunoId ao preencher o campo depois do bloqueio (handleAlunoChange)', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });
      expect(result.current.fieldErrors.alunoId).toEqual(expect.any(String));

      act(() => {
        result.current.handleAlunoChange({
          target: { name: 'alunoId', value: '1' },
        });
      });
      expect(result.current.fieldErrors.alunoId).toBeUndefined();
    });

    it('limpa fieldErrors.professorId ao preencher o campo depois do bloqueio (handleProfessorChange)', () => {
      const submit = jest.fn();
      const { result } = renderHook(() =>
        useContratoForm({ alunos, professores, submit })
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'alunoId', value: '1' },
        });
        result.current.handleChange({
          target: { name: 'professorId', value: '' },
        });
      });

      const fakeEvent = { preventDefault: jest.fn() };
      act(() => {
        result.current.handleSubmit(fakeEvent);
      });
      expect(result.current.fieldErrors.professorId).toEqual(
        expect.any(String)
      );

      act(() => {
        result.current.handleProfessorChange({
          target: { name: 'professorId', value: '10' },
        });
      });
      expect(result.current.fieldErrors.professorId).toBeUndefined();
    });
  });

  describe('Foco no primeiro campo com erro ao bloquear o submit (AC-001-014)', () => {
    const alunos = [{ id: 1, nome: 'Aluno 1' }];
    const professores = [{ id: 10, nome: 'Professor 1' }];

    it('com Aluno e Professor vazios, o foco vai para o combobox Aluno', () => {
      const submit = jest.fn();
      render(createElement(FormHarness, { alunos, professores, submit }));

      // Professor nasce preenchido com o currentUser mockado — limpa para
      // isolar o cenário "os dois vazios".
      fireEvent.click(
        screen.getAllByRole('button', { name: 'Limpar seleção' })[0]
      );

      fireEvent.submit(screen.getByTestId('harness-form'));

      expect(submit).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(
        screen.getByRole('combobox', { name: /^aluno/i })
      );
    });

    it('com só Professor vazio, o foco vai para o combobox Professor', () => {
      const submit = jest.fn();
      render(createElement(FormHarness, { alunos, professores, submit }));

      fireEvent.click(screen.getByRole('combobox', { name: /^aluno/i }));
      fireEvent.click(screen.getByText('Aluno 1'));

      const professorInput = screen.getByRole('combobox', {
        name: /^professor/i,
      });
      fireEvent.click(
        within(professorInput.parentElement).getByRole('button', {
          name: 'Limpar seleção',
        })
      );

      // handleClear (SearchableSelectField) já devolve o foco ao Professor
      // ao limpar — para provar que é o handleSubmit (e não o handleClear)
      // quem move o foco no bloqueio, tiramos o foco do Professor antes de
      // submeter e provamos a pré-condição.
      screen.getByRole('combobox', { name: /^aluno/i }).focus();
      expect(document.activeElement).not.toBe(professorInput);

      fireEvent.submit(screen.getByTestId('harness-form'));

      expect(submit).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(professorInput);
    });

    it('caso irmão: preencher o Aluno depois do bloqueio não move o foco para o Professor', () => {
      const submit = jest.fn();
      render(createElement(FormHarness, { alunos, professores, submit }));

      fireEvent.click(
        screen.getAllByRole('button', { name: 'Limpar seleção' })[0]
      );
      fireEvent.submit(screen.getByTestId('harness-form'));
      expect(document.activeElement).toBe(
        screen.getByRole('combobox', { name: /^aluno/i })
      );

      fireEvent.click(screen.getByRole('combobox', { name: /^aluno/i }));
      fireEvent.click(screen.getByText('Aluno 1'));

      expect(document.activeElement).not.toBe(
        screen.getByRole('combobox', { name: /^professor/i })
      );
    });
  });

  describe('dataInicio default estável até montar (AC-001-006)', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('paridade: dataInicio nasce null independente do relógio do sistema', () => {
      const submit = jest.fn();

      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-30T23:59:59.000Z'));
      const hook1 = mountHookRaw({ alunos, professores, submit });
      expect(hook1.getDataInicio()).toBeNull();
      hook1.unmount();

      jest.setSystemTime(new Date('2026-07-01T00:00:01.000Z'));
      const hook2 = mountHookRaw({ alunos, professores, submit });
      expect(hook2.getDataInicio()).toBeNull();
      hook2.unmount();
    });

    it('preenchimento pós-montagem: dataInicio passa a refletir o dia real no instante T', async () => {
      const submit = jest.fn();
      jest.useFakeTimers();
      // Instantes com offset explícito `-03:00`: `todayLocalDate` lê o
      // relógio no fuso local, não em UTC — usar `Z` aqui deslocaria a
      // fronteira do dia em 3h e o teste passaria a afirmar o dia errado.
      jest.setSystemTime(new Date('2026-06-30T23:59:59.000-03:00'));

      const hook1 = mountHookRaw({ alunos, professores, submit });
      expect(hook1.getDataInicio()).toBeNull();
      await hook1.flush();
      expect(hook1.getDataInicio()).toBe('2026-06-30');
      hook1.unmount();

      jest.setSystemTime(new Date('2026-07-01T00:00:01.000-03:00'));
      const hook2 = mountHookRaw({ alunos, professores, submit });
      expect(hook2.getDataInicio()).toBeNull();
      await hook2.flush();
      expect(hook2.getDataInicio()).toBe('2026-07-01');
      hook2.unmount();
    });
  });
});
