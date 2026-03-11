import { renderHook, act } from '@testing-library/react';
import { useRelatorioForm } from './useRelatorioForm';

describe('useRelatorioForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSubmit.mockClear();
  });

  it('should initialize with empty filtros when relatorio.filters is null', () => {
    const relatorio = {
      filters: null,
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    expect(result.current.filtros).toEqual({});
  });

  it('should initialize with empty filtros when relatorio.filters is empty array', () => {
    const relatorio = {
      filters: [],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    expect(result.current.filtros).toEqual({});
  });

  it('should set initial dataInicial to current date', () => {
    const now = new Date();
    const expectedDate = now.toISOString().split('T')[0];

    const relatorio = {
      filters: [{ htmlFor: 'dataInicial', label: 'Data Inicial' }],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    expect(result.current.filtros.dataInicial).toBe(expectedDate);
  });

  it('should set initial dataFinal to 6 months from now', () => {
    const now = new Date();
    const expected = new Date();
    expected.setMonth(expected.getMonth() + 6);
    const expectedDate = expected.toISOString().split('T')[0];

    const relatorio = {
      filters: [{ htmlFor: 'dataFinal', label: 'Data Final' }],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    expect(result.current.filtros.dataFinal).toBe(expectedDate);
  });

  it('should initialize other filter fields as empty strings', () => {
    const relatorio = {
      filters: [
        { htmlFor: 'alunoId', label: 'Aluno' },
        { htmlFor: 'professorId', label: 'Professor' },
        { htmlFor: 'status', label: 'Status' },
      ],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    expect(result.current.filtros.alunoId).toBe('');
    expect(result.current.filtros.professorId).toBe('');
    expect(result.current.filtros.status).toBe('');
  });

  it('should initialize with all date types', () => {
    const relatorio = {
      filters: [
        { htmlFor: 'dataInicial', label: 'Data Inicial' },
        { htmlFor: 'dataFinal', label: 'Data Final' },
        { htmlFor: 'alunoId', label: 'Aluno' },
      ],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    expect(result.current.filtros.dataInicial).toBeDefined();
    expect(result.current.filtros.dataFinal).toBeDefined();
    expect(result.current.filtros.alunoId).toBe('');
  });

  it('should handle input change', () => {
    const relatorio = {
      filters: [{ htmlFor: 'alunoId', label: 'Aluno' }],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    act(() => {
      const event = {
        target: { name: 'alunoId', value: '123' },
      };
      result.current.handleChange(event);
    });

    expect(result.current.filtros.alunoId).toBe('123');
  });

  it('should handle multiple input changes', () => {
    const relatorio = {
      filters: [
        { htmlFor: 'alunoId', label: 'Aluno' },
        { htmlFor: 'professorId', label: 'Professor' },
        { htmlFor: 'status', label: 'Status' },
      ],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({ target: { name: 'alunoId', value: '1' } });
      result.current.handleChange({
        target: { name: 'professorId', value: '2' },
      });
      result.current.handleChange({
        target: { name: 'status', value: 'ATIVO' },
      });
    });

    expect(result.current.filtros).toEqual({
      alunoId: '1',
      professorId: '2',
      status: 'ATIVO',
    });
  });

  it('should update existing filter value', () => {
    const relatorio = {
      filters: [{ htmlFor: 'alunoId', label: 'Aluno' }],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'alunoId', value: '123' },
      });
    });

    expect(result.current.filtros.alunoId).toBe('123');

    act(() => {
      result.current.handleChange({
        target: { name: 'alunoId', value: '456' },
      });
    });

    expect(result.current.filtros.alunoId).toBe('456');
  });

  it('should call submit with endpoint and filtros', () => {
    const relatorio = {
      filters: [{ htmlFor: 'alunoId', label: 'Aluno' }],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'alunoId', value: '123' },
      });
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockSubmit).toHaveBeenCalledWith('/api/relatorios/vendas', {
      alunoId: '123',
    });
  });

  it('should call submit with all filters', () => {
    const relatorio = {
      filters: [
        { htmlFor: 'dataInicial', label: 'Data Inicial' },
        { htmlFor: 'dataFinal', label: 'Data Final' },
        { htmlFor: 'alunoId', label: 'Aluno' },
      ],
      endpoint: '/api/relatorios/aulas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    const initialData = result.current.filtros;

    act(() => {
      result.current.handleChange({ target: { name: 'alunoId', value: '99' } });
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(mockSubmit).toHaveBeenCalledWith('/api/relatorios/aulas', {
      ...initialData,
      alunoId: '99',
    });
  });

  it('should not modify other filters when changing one', () => {
    const relatorio = {
      filters: [
        { htmlFor: 'alunoId', label: 'Aluno' },
        { htmlFor: 'professorId', label: 'Professor' },
      ],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({ target: { name: 'alunoId', value: '1' } });
      result.current.handleChange({
        target: { name: 'professorId', value: '2' },
      });
    });

    expect(result.current.filtros.alunoId).toBe('1');
    expect(result.current.filtros.professorId).toBe('2');

    act(() => {
      result.current.handleChange({ target: { name: 'alunoId', value: '3' } });
    });

    expect(result.current.filtros.alunoId).toBe('3');
    expect(result.current.filtros.professorId).toBe('2'); // Should not change
  });

  it('should handle clearing a filter value', () => {
    const relatorio = {
      filters: [{ htmlFor: 'alunoId', label: 'Aluno' }],
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'alunoId', value: '123' },
      });
    });

    expect(result.current.filtros.alunoId).toBe('123');

    act(() => {
      result.current.handleChange({ target: { name: 'alunoId', value: '' } });
    });

    expect(result.current.filtros.alunoId).toBe('');
  });

  it('should return handleChange and handleSubmit functions', () => {
    const relatorio = {
      filters: null,
      endpoint: '/api/relatorios/vendas',
    };

    const { result } = renderHook(() =>
      useRelatorioForm({ relatorio, submit: mockSubmit })
    );

    expect(typeof result.current.handleChange).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.filtros).toBe('object');
  });
});
