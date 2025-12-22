import { renderHook, act } from '@testing-library/react';
import { useContratoForm } from './useContratoForm';

describe('useContratoForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));
    expect(result.current.formData).toEqual({
      idDoAluno: '',
      dataDeInicio: null,
      dataDeTermino: null,
    });
  });

  it('should initialize with provided id', () => {
    const { result } = renderHook(() =>
      useContratoForm({ id: 123, submit: jest.fn() })
    );
    expect(result.current.formData).toEqual({
      idDoAluno: '',
      dataDeInicio: null,
      dataDeTermino: null,
    });
  });

  it('should update formData on handleChange', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '456' },
      });
    });

    expect(result.current.formData.idDoAluno).toBe('456');
  });

  it('should update multiple fields correctly', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '789' },
      });
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-01-01' },
      });
      result.current.handleChange({
        target: { name: 'dataDeTermino', value: '2024-12-31' },
      });
    });

    expect(result.current.formData).toEqual({
      idDoAluno: '789',
      dataDeInicio: '2024-01-01',
      dataDeTermino: '2024-12-31',
    });
  });

  it('should call submit with correct data when handleSubmit is called', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '100' },
      });
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-06-01' },
      });
    });

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalledWith({
      id: null,
      dataToSend: {
        idDoAluno: '100',
        dataDeInicio: '2024-06-01',
      },
    });
  });

  it('should call submit with id when provided', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ id: 999, submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '200' },
      });
      result.current.handleChange({
        target: { name: 'dataDeTermino', value: '2025-12-31' },
      });
    });

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      id: 999,
      dataToSend: {
        idDoAluno: '200',
        dataDeTermino: '2025-12-31',
      },
    });
  });

  it('should filter out null values from formData on submit', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '300' },
      });
    });

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      id: null,
      dataToSend: {
        idDoAluno: '300',
      },
    });
  });

  it('should not include null values in submitted data', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '400' },
      });
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-03-01' },
      });
    });

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    const submittedData = mockSubmit.mock.calls[0][0].dataToSend;
    expect(submittedData).toEqual({
      idDoAluno: '400',
      dataDeInicio: '2024-03-01',
    });
    expect(submittedData).not.toHaveProperty('dataDeTermino');
  });

  it('should update formData using setFormData', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    const newData = {
      idDoAluno: '500',
      dataDeInicio: '2024-01-15',
      dataDeTermino: '2024-06-15',
    };

    act(() => {
      result.current.setFormData(newData);
    });

    expect(result.current.formData).toEqual(newData);
  });

  it('should partially update formData using setFormData with function', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    act(() => {
      result.current.setFormData({
        idDoAluno: '600',
        dataDeInicio: '2024-02-01',
        dataDeTermino: '2024-08-01',
      });
    });

    act(() => {
      result.current.setFormData(prev => ({
        ...prev,
        idDoAluno: '700',
      }));
    });

    expect(result.current.formData).toEqual({
      idDoAluno: '700',
      dataDeInicio: '2024-02-01',
      dataDeTermino: '2024-08-01',
    });
  });

  it('should handle empty idDoAluno correctly', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ submit: mockSubmit })
    );

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      id: null,
      dataToSend: {
        idDoAluno: '',
      },
    });
  });

  it('should preserve previous values when updating single field', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '800' },
      });
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-04-01' },
      });
    });

    expect(result.current.formData.idDoAluno).toBe('800');
    expect(result.current.formData.dataDeInicio).toBe('2024-04-01');
    expect(result.current.formData.dataDeTermino).toBeNull();
  });

  it('should return all expected properties', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    expect(result.current).toEqual({
      formData: expect.any(Object),
      handleSubmit: expect.any(Function),
      handleChange: expect.any(Function),
      setFormData: expect.any(Function),
    });
  });

  it('should handle all three fields in form submission', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ id: 111, submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '900' },
      });
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-05-01' },
      });
      result.current.handleChange({
        target: { name: 'dataDeTermino', value: '2024-11-01' },
      });
    });

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      id: 111,
      dataToSend: {
        idDoAluno: '900',
        dataDeInicio: '2024-05-01',
        dataDeTermino: '2024-11-01',
      },
    });
  });

  it('should preserve dates when updating idDoAluno', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    act(() => {
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-07-01' },
      });
      result.current.handleChange({
        target: { name: 'dataDeTermino', value: '2024-12-01' },
      });
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '1000' },
      });
    });

    expect(result.current.formData.dataDeInicio).toBe('2024-07-01');
    expect(result.current.formData.dataDeTermino).toBe('2024-12-01');
    expect(result.current.formData.idDoAluno).toBe('1000');
  });

  it('should handle string id correctly', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ id: '222', submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '1100' },
      });
    });

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockSubmit).toHaveBeenCalledWith({
      id: '222',
      dataToSend: {
        idDoAluno: '1100',
      },
    });
  });

  it('should handle date changes independently', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    act(() => {
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-08-15' },
      });
    });

    expect(result.current.formData.dataDeInicio).toBe('2024-08-15');
    expect(result.current.formData.dataDeTermino).toBeNull();

    act(() => {
      result.current.handleChange({
        target: { name: 'dataDeTermino', value: '2024-09-15' },
      });
    });

    expect(result.current.formData.dataDeInicio).toBe('2024-08-15');
    expect(result.current.formData.dataDeTermino).toBe('2024-09-15');
  });

  it('should allow clearing a date field', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    act(() => {
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-10-01' },
      });
    });

    expect(result.current.formData.dataDeInicio).toBe('2024-10-01');

    act(() => {
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '' },
      });
    });

    expect(result.current.formData.dataDeInicio).toBe('');
  });

  it('should submit only non-null values even with empty string', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '1200' },
      });
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '' },
      });
    });

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    const submittedData = mockSubmit.mock.calls[0][0].dataToSend;
    expect(submittedData).toEqual({
      idDoAluno: '1200',
      dataDeInicio: '',
    });
    expect(submittedData).not.toHaveProperty('dataDeTermino');
  });

  it('should handle setFormData with null values', () => {
    const { result } = renderHook(() => useContratoForm({ submit: jest.fn() }));

    const newData = {
      idDoAluno: '1300',
      dataDeInicio: null,
      dataDeTermino: null,
    };

    act(() => {
      result.current.setFormData(newData);
    });

    expect(result.current.formData).toEqual(newData);
    expect(result.current.formData.dataDeInicio).toBeNull();
    expect(result.current.formData.dataDeTermino).toBeNull();
  });

  it('should preventDefault on every submit call', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ submit: mockSubmit })
    );

    const mockEvent1 = { preventDefault: jest.fn() };
    const mockEvent2 = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent1);
    });

    expect(mockEvent1.preventDefault).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '1400' },
      });
    });

    act(() => {
      result.current.handleSubmit(mockEvent2);
    });

    expect(mockEvent2.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledTimes(2);
  });

  it('should handle complete workflow from empty to filled form', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() =>
      useContratoForm({ id: 333, submit: mockSubmit })
    );

    // Initial state
    expect(result.current.formData).toEqual({
      idDoAluno: '',
      dataDeInicio: null,
      dataDeTermino: null,
    });

    // Fill form
    act(() => {
      result.current.handleChange({
        target: { name: 'idDoAluno', value: '1500' },
      });
      result.current.handleChange({
        target: { name: 'dataDeInicio', value: '2024-11-01' },
      });
      result.current.handleChange({
        target: { name: 'dataDeTermino', value: '2024-12-15' },
      });
    });

    // Verify filled state
    expect(result.current.formData).toEqual({
      idDoAluno: '1500',
      dataDeInicio: '2024-11-01',
      dataDeTermino: '2024-12-15',
    });

    // Submit
    const mockEvent = { preventDefault: jest.fn() };
    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    // Verify submission
    expect(mockSubmit).toHaveBeenCalledWith({
      id: 333,
      dataToSend: {
        idDoAluno: '1500',
        dataDeInicio: '2024-11-01',
        dataDeTermino: '2024-12-15',
      },
    });
  });
});
