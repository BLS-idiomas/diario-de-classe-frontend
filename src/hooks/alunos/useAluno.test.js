import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAluno } from './useAluno';
import {
  getAluno,
  getAulasAluno,
  getDiasAulasAluno,
  getContratoAluno,
  getContratosAluno,
} from '@/store/slices/alunosSlice';
import { STATUS } from '@/constants';

// Mock dos módulos
jest.mock('@/store/slices/alunosSlice', () => ({
  getAluno: jest.fn(),
  getAulasAluno: jest.fn(),
  getDiasAulasAluno: jest.fn(),
  getContratoAluno: jest.fn(),
  getContratosAluno: jest.fn(),
}));

jest.mock('@/constants', () => ({
  STATUS: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILED: 'failed',
  },
}));

jest.mock('@/constants/statusError', () => ({
  STATUS_ERROR: {
    BAD_REQUEST: '400',
    NOT_FOUND: '404',
  },
}));

// Mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      alunos: (state = initialState, action) => state,
    },
  });
};

// Wrapper para Provider
const createWrapper = store => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe.skip('useAluno', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Implementação dos actions para facilitar asserções
    getAluno.mockImplementation(id => ({
      type: 'alunos/getAluno',
      payload: id,
    }));

    getAulasAluno.mockImplementation(id => ({
      type: 'alunos/getAulasAluno',
      payload: id,
    }));

    getDiasAulasAluno.mockImplementation(id => ({
      type: 'alunos/getDiasAulasAluno',
      payload: id,
    }));

    getContratoAluno.mockImplementation(id => ({
      type: 'alunos/getContratoAluno',
      payload: id,
    }));

    getContratosAluno.mockImplementation(id => ({
      type: 'alunos/getContratosAluno',
      payload: id,
    }));

    mockDispatch = jest.fn();
  });

  it('dispatches getAluno when id is provided', () => {
    const initialState = {
      current: { id: 123, nome: 'João', sobrenome: 'Silva' },
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: 'ok',
      status: STATUS.IDLE,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useAluno(123), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getAluno',
      payload: 123,
    });
  });

  it('dispatches all five actions when id and current are provided', () => {
    const initialState = {
      current: { id: 123, nome: 'João', sobrenome: 'Silva' },
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: '',
      status: STATUS.IDLE,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useAluno(123), { wrapper });

    expect(mockDispatch).toHaveBeenCalledTimes(5);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getAluno',
      payload: 123,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getAulasAluno',
      payload: 123,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getDiasAulasAluno',
      payload: 123,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getContratoAluno',
      payload: 123,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getContratosAluno',
      payload: 123,
    });
  });

  it('does not dispatch when id is falsy', () => {
    const initialState = {};
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useAluno(null), { wrapper });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('returns correct shape and flags for IDLE status', () => {
    const initialState = {
      current: { id: 5, nome: 'Ana', sobrenome: 'Santos' },
      aulas: [{ id: 1, titulo: 'Aula 1' }],
      diasAulas: [{ dia: 'Segunda', horario: '08:00' }],
      contrato: { id: 1, numero: 'CONT-001' },
      contratos: [{ id: 1, numero: 'CONT-001' }],
      message: 'all good',
      status: STATUS.IDLE,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(5), { wrapper });

    expect(result.current).toEqual({
      aluno: initialState.current,
      aulas: initialState.aulas,
      diasAulas: initialState.diasAulas,
      contrato: initialState.contrato,
      contratos: initialState.contratos,
      message: initialState.message,
      isLoading: true,
      isSuccess: false,
      isFailed: false,
      isNotFound: false,
    });
  });

  it('returns correct flags for LOADING status', () => {
    const initialState = {
      current: null,
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: '',
      status: STATUS.LOADING,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(5), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(false);
  });

  it('returns correct flags for SUCCESS status', () => {
    const initialState = {
      current: { id: 10, nome: 'Carlos', sobrenome: 'Pereira' },
      aulas: [
        { id: 1, titulo: 'Aula 1' },
        { id: 2, titulo: 'Aula 2' },
      ],
      diasAulas: [
        { dia: 'Segunda', horario: '08:00' },
        { dia: 'Quarta', horario: '10:00' },
      ],
      contrato: { id: 10, numero: 'CONT-010', valor: 1500 },
      contratos: [
        { id: 10, numero: 'CONT-010', valor: 1500 },
        { id: 9, numero: 'CONT-009', valor: 1200 },
      ],
      message: 'success',
      status: STATUS.SUCCESS,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(10), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isFailed).toBe(false);
    expect(result.current.aulas).toHaveLength(2);
    expect(result.current.diasAulas).toHaveLength(2);
    expect(result.current.contrato).toEqual(initialState.contrato);
    expect(result.current.contratos).toHaveLength(2);
  });

  it('returns correct flags for FAILED status', () => {
    const initialState = {
      current: null,
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: 'error message',
      status: STATUS.FAILED,
      statusError: '404',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(5), { wrapper });

    expect(result.current.isFailed).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return isNotFound when statusError is present', () => {
    const initialState = {
      current: null,
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: 'Not found',
      status: STATUS.FAILED,
      statusError: '404',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(999), { wrapper });

    expect(result.current.isNotFound).toBe(true);
  });

  it('should handle undefined state gracefully', () => {
    const store = createMockStore();
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(1), { wrapper });

    expect(result.current.aluno).toBeUndefined();
    expect(result.current.message).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(false);
  });

  it('should dispatch with string id', () => {
    const initialState = {
      current: { id: 'abc123', nome: 'Maria' },
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: '',
      status: STATUS.SUCCESS,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useAluno('abc123'), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getAluno',
      payload: 'abc123',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getAulasAluno',
      payload: 'abc123',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getDiasAulasAluno',
      payload: 'abc123',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getContratoAluno',
      payload: 'abc123',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getContratosAluno',
      payload: 'abc123',
    });
  });

  it('should return empty arrays and null contrato when data is not loaded', () => {
    const initialState = {
      current: { id: 1, nome: 'João' },
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: '',
      status: STATUS.SUCCESS,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(1), { wrapper });

    expect(result.current.aulas).toEqual([]);
    expect(result.current.diasAulas).toEqual([]);
    expect(result.current.contrato).toBeNull();
    expect(result.current.contratos).toEqual([]);
  });

  it('should return populated aulas array when available', () => {
    const mockAulas = [
      { id: 1, titulo: 'Aula de Inglês', data: '2024-01-01' },
      { id: 2, titulo: 'Aula de Espanhol', data: '2024-01-02' },
    ];

    const initialState = {
      current: { id: 1, nome: 'João' },
      aulas: mockAulas,
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: '',
      status: STATUS.SUCCESS,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(1), { wrapper });

    expect(result.current.aulas).toEqual(mockAulas);
    expect(result.current.aulas).toHaveLength(2);
  });

  it('should return populated diasAulas array when available', () => {
    const mockDiasAulas = [
      { dia: 'Segunda', horario: '08:00', sala: 'A1' },
      { dia: 'Quarta', horario: '10:00', sala: 'B2' },
      { dia: 'Sexta', horario: '14:00', sala: 'C3' },
    ];

    const initialState = {
      current: { id: 1, nome: 'João' },
      aulas: [],
      diasAulas: mockDiasAulas,
      contrato: null,
      contratos: [],
      message: '',
      status: STATUS.SUCCESS,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(1), { wrapper });

    expect(result.current.diasAulas).toEqual(mockDiasAulas);
    expect(result.current.diasAulas).toHaveLength(3);
  });

  it('should return contrato object when available', () => {
    const mockContrato = {
      id: 1,
      numero: 'CONT-2024-001',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      valor: 2000.0,
      status: 'ativo',
    };

    const initialState = {
      current: { id: 1, nome: 'João' },
      aulas: [],
      diasAulas: [],
      contrato: mockContrato,
      contratos: [],
      message: '',
      status: STATUS.SUCCESS,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(1), { wrapper });

    expect(result.current.contrato).toEqual(mockContrato);
    expect(result.current.contrato.numero).toBe('CONT-2024-001');
  });

  it('should return contratos array when available', () => {
    const mockContratos = [
      {
        id: 1,
        numero: 'CONT-2024-001',
        dataInicio: '2024-01-01',
        dataFim: '2024-12-31',
        valor: 2000.0,
        status: 'ativo',
      },
      {
        id: 2,
        numero: 'CONT-2023-002',
        dataInicio: '2023-01-01',
        dataFim: '2023-12-31',
        valor: 1500.0,
        status: 'finalizado',
      },
    ];

    const initialState = {
      current: { id: 1, nome: 'João' },
      aulas: [],
      diasAulas: [],
      contrato: mockContratos[0],
      contratos: mockContratos,
      message: '',
      status: STATUS.SUCCESS,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(1), { wrapper });

    expect(result.current.contratos).toEqual(mockContratos);
    expect(result.current.contratos).toHaveLength(2);
    expect(result.current.contratos[0].numero).toBe('CONT-2024-001');
    expect(result.current.contratos[1].status).toBe('finalizado');
  });

  it('should return all data populated when fully loaded', () => {
    const mockAluno = { id: 1, nome: 'João', sobrenome: 'Silva' };
    const mockAulas = [{ id: 1, titulo: 'Aula 1' }];
    const mockDiasAulas = [{ dia: 'Segunda', horario: '08:00' }];
    const mockContrato = { id: 1, numero: 'CONT-001' };
    const mockContratos = [{ id: 1, numero: 'CONT-001' }];

    const initialState = {
      current: mockAluno,
      aulas: mockAulas,
      diasAulas: mockDiasAulas,
      contrato: mockContrato,
      contratos: mockContratos,
      message: 'Loaded successfully',
      status: STATUS.SUCCESS,
      statusError: null,
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(1), { wrapper });

    expect(result.current.aluno).toEqual(mockAluno);
    expect(result.current.aulas).toEqual(mockAulas);
    expect(result.current.diasAulas).toEqual(mockDiasAulas);
    expect(result.current.contrato).toEqual(mockContrato);
    expect(result.current.contratos).toEqual(mockContratos);
    expect(result.current.message).toBe('Loaded successfully');
    expect(result.current.isSuccess).toBe(true);
  });

  it('returns isNotFound true when statusError is 404 and no current aluno', () => {
    const initialState = {
      current: null,
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: 'Not found',
      status: STATUS.FAILED,
      statusError: '404',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(999), { wrapper });

    expect(result.current.isNotFound).toBe(true);
    expect(result.current.aluno).toBeNull();
  });

  it('returns isNotFound true when statusError is 400 and no current aluno', () => {
    const initialState = {
      current: null,
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: 'Bad request',
      status: STATUS.FAILED,
      statusError: '400',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(999), { wrapper });

    expect(result.current.isNotFound).toBe(true);
    expect(result.current.aluno).toBeNull();
  });

  it('returns isNotFound false when aluno exists even with error status', () => {
    const initialState = {
      current: { id: 5, nome: 'Ana' },
      aulas: [],
      diasAulas: [],
      contrato: null,
      contratos: [],
      message: 'Some error',
      status: STATUS.FAILED,
      statusError: '404',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(5), { wrapper });

    expect(result.current.isNotFound).toBe(false);
    expect(result.current.aluno).toEqual({ id: 5, nome: 'Ana' });
  });

  it('returns isNotFound false when statusError is not 400 or 404', () => {
    const initialState = {
      current: null,
      aulas: [],
      diasAulas: [],
      contrato: null,
      message: 'Server error',
      status: STATUS.FAILED,
      statusError: '500',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAluno(999), { wrapper });

    expect(result.current.isNotFound).toBe(false);
    expect(result.current.isFailed).toBe(true);
  });
});
