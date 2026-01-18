const mockSuccess = jest.fn();
const mockPush = jest.fn();

import { STATUS } from '@/constants/status';
import { renderHook, act, waitFor } from '@testing-library/react';
import React, { createContext, useContext } from 'react';
import { useNovaAula } from './useNovaAula';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({ success: mockSuccess }),
}));
jest.mock('@/store/slices/aulasSlice', () => ({
  createAula: jest.fn(() => ({ type: 'createAula' })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
  clearCurrent: jest.fn(() => ({ type: 'clearCurrent' })),
}));

const mockDispatch = jest.fn();

beforeEach(() => {
  require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  require('react-redux').useSelector.mockImplementation(cb =>
    cb({
      aulas: {
        status: 'IDLE',
        message: '',
        errors: [],
        current: null,
        action: '',
      },
    })
  );
  jest.clearAllMocks();
});

describe('useNovaAula', () => {
  it('deve retornar valores padrão e chamar submit', () => {
    const { result } = renderHook(() => useNovaAula());
    act(() => {
      result.current.submit({ dataToSend: { nome: 'Aula' } });
    });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'createAula' });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toBe('');
    expect(result.current.errors).toEqual([]);
  });

  it('deve retornar isLoading true quando status for LOADING', () => {
    require('react-redux').useSelector.mockImplementation(cb =>
      cb({
        aulas: {
          status: 'loading',
          message: '',
          errors: [],
          current: null,
          action: 'createAula',
        },
      })
    );
    const { result } = renderHook(() => useNovaAula());
    expect(result.current.isLoading).toBe(true);
  });

  it('deve executar efeitos colaterais em caso de sucesso', async () => {
    // Cria contexto para simular o estado global do Redux
    const AulasContext = createContext();
    const useAulasContext = () => useContext(AulasContext);
    // Mock do useSelector para ler do contexto
    require('react-redux').useSelector.mockImplementation(cb =>
      cb(useAulasContext())
    );
    // Ref para armazenar setAulas fora do componente
    const setAulasRef = { current: null };
    // Wrapper com useState para simular transição de estado
    const Wrapper = ({ children }) => {
      const [aulas, setAulas] = React.useState({
        status: STATUS.IDLE,
        message: '',
        errors: [],
        current: null,
        action: '',
      });
      // Armazena setAulas na ref
      React.useEffect(() => {
        setAulasRef.current = setAulas;
      }, [setAulas]);
      return (
        <AulasContext.Provider value={{ aulas }}>
          {children}
        </AulasContext.Provider>
      );
    };
    const { rerender } = renderHook(() => useNovaAula(), {
      wrapper: Wrapper,
    });
    // Transição para sucesso
    act(() => {
      setAulasRef.current({
        status: STATUS.SUCCESS,
        message: '',
        errors: [],
        current: { id: 1 },
        action: 'createAula',
      });
    });
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith('Aula criado com sucesso!');
      expect(mockPush).toHaveBeenCalledWith('/aulas');
    });
  });

  it('deve lidar com status de erro', () => {
    require('react-redux').useSelector.mockImplementation(cb =>
      cb({
        aulas: {
          status: 'failed',
          message: 'Erro',
          errors: ['erro'],
          current: null,
          action: '',
        },
      })
    );
    const { result } = renderHook(() => useNovaAula());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toBe('Erro');
    expect(result.current.errors).toEqual(['erro']);
  });
});
