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

  it('should call submit on handleSubmit', () => {
    const submit = jest.fn();
    const { result } = renderHook(() => useAulaForm({ id: 1, submit }));
    const fakeEvent = { preventDefault: jest.fn() };
    act(() => {
      result.current.handleSubmit(fakeEvent);
    });
    expect(submit).toHaveBeenCalledWith({
      id: 1,
      dataToSend: result.current.formData,
    });
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });
});
