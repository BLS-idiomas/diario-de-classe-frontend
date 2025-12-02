import { renderHook, act } from '@testing-library/react';
import { useProfessorForm } from './useProfessorForm';
import { PERMISSAO } from '@/constants';

describe('useProfessorForm', () => {
  it('should initialize with default values if no professor is provided', () => {
    const { result } = renderHook(() =>
      useProfessorForm({ submit: jest.fn() })
    );
    expect(result.current.formData).toEqual({
      nome: '',
      sobrenome: '',
      email: '',
      telefone: '',
      senha: '',
      repetirSenha: '',
      permissao: PERMISSAO.MEMBER,
    });
    expect(result.current.isSenhaError).toBe(false);
  });

  it('should initialize with professor values if provided', () => {
    const professor = {
      nome: 'Ana',
      sobrenome: 'Silva',
      email: 'ana@teste.com',
      telefone: '123456789',
      senha: 'abc123',
      repetirSenha: 'abc123',
      permissao: 'admin',
    };
    const { result } = renderHook(() =>
      useProfessorForm({ professor, submit: jest.fn() })
    );
    expect(result.current.formData).toEqual(professor);
  });

  it('should update formData on handleChange', () => {
    const { result } = renderHook(() =>
      useProfessorForm({ submit: jest.fn() })
    );
    act(() => {
      result.current.handleChange({
        target: { name: 'nome', value: 'Carlos' },
      });
    });
    expect(result.current.formData.nome).toBe('Carlos');
  });

  it('should set isSenhaError true if senha and repetirSenha do not match on submit', () => {
    const submit = jest.fn();
    const { result } = renderHook(() => useProfessorForm({ submit }));
    act(() => {
      result.current.handleChange({ target: { name: 'senha', value: '123' } });
      result.current.handleChange({
        target: { name: 'repetirSenha', value: '456' },
      });
    });
    const mockEvent = { preventDefault: jest.fn() };
    act(() => {
      result.current.handleSubmit(mockEvent);
    });
    expect(result.current.isSenhaError).toBe(true);
    expect(submit).not.toHaveBeenCalled();
  });

  it('should call submit with correct data when senha matches repetirSenha', () => {
    const submit = jest.fn();
    const { result } = renderHook(() => useProfessorForm({ submit }));
    act(() => {
      result.current.handleChange({ target: { name: 'senha', value: '123' } });
      result.current.handleChange({
        target: { name: 'repetirSenha', value: '123' },
      });
      result.current.handleChange({
        target: { name: 'nome', value: 'Carlos' },
      });
    });
    const mockEvent = { preventDefault: jest.fn() };
    act(() => {
      result.current.handleSubmit(mockEvent);
    });
    expect(result.current.isSenhaError).toBe(false);
    expect(submit).toHaveBeenCalledWith({
      id: null,
      dataToSend: {
        nome: 'Carlos',
        sobrenome: '',
        email: '',
        telefone: '',
        senha: '123',
        permissao: PERMISSAO.MEMBER,
      },
    });
  });
});
