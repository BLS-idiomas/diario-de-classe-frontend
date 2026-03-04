import { renderHook, act } from '@testing-library/react';
import { useAulaForm } from './useAulaForm';

describe('useAulaForm', () => {
  it('should update formData on handleChange', () => {
    const submit = jest.fn();
    const { result } = renderHook(() => useAulaForm({ id: null, submit }));
    act(() => {
      result.current.handleChange({
        target: { name: 'idAluno', value: '123' },
      });
    });
    expect(result.current.formData.idAluno).toBe('123');
  });

  it('should update formData for multiple fields', () => {
    const submit = jest.fn();
    const { result } = renderHook(() => useAulaForm({ id: null, submit }));
    act(() => {
      result.current.handleChange({ target: { name: 'idAluno', value: '1' } });
      result.current.handleChange({
        target: { name: 'idProfessor', value: '2' },
      });
      result.current.handleChange({
        target: { name: 'tipo', value: 'REPOSICAO' },
      });
    });
    expect(result.current.formData.idAluno).toBe('1');
    expect(result.current.formData.idProfessor).toBe('2');
    expect(result.current.formData.tipo).toBe('REPOSICAO');
  });

  it('should call submit on handleSubmit and format dataAula as ISO', () => {
    const submit = jest.fn();
    const { result } = renderHook(() => useAulaForm({ id: 1, submit }));
    const fakeEvent = { preventDefault: jest.fn() };
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    act(() => {
      result.current.handleChange({
        target: { name: 'dataAula', value: todayStr },
      });
      result.current.handleSubmit(fakeEvent);
    });
    expect(submit).toHaveBeenCalledWith({
      id: 1,
      dataToSend: expect.objectContaining({
        dataAula: expect.stringMatching(new RegExp(`^${todayStr}T00:00:00`)),
      }),
    });
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it('should allow setFormData to update the whole form', () => {
    const submit = jest.fn();
    const { result } = renderHook(() => useAulaForm({ id: null, submit }));
    act(() => {
      result.current.setFormData({
        idAluno: '10',
        idProfessor: '20',
        idContrato: '30',
        dataAula: '2024-03-04',
        horaInicial: '10:00',
        horaFinal: '11:00',
        tipo: 'PADRAO',
        status: 'AGENDADA',
        observacao: 'Teste',
      });
    });
    expect(result.current.formData.idAluno).toBe('10');
    expect(result.current.formData.horaInicial).toBe('10:00');
    expect(result.current.formData.observacao).toBe('Teste');
  });
});
