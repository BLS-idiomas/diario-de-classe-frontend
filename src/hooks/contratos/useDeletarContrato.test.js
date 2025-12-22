import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useDeletarContrato } from './useDeletarContrato';
import { deleteContrato } from '@/store/slices/contratosSlice';
import useSweetAlert from '@/hooks/useSweetAlert';

// Mock dos módulos
jest.mock('@/store/slices/contratosSlice', () => ({
  deleteContrato: jest.fn(),
}));

jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock store simples
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      contratos: (state = initialState, action) => state,
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

describe('useDeletarContrato', () => {
  let mockDispatch;
  let mockShowSuccess;
  let mockShowError;
  let mockShowConfirm;
  let store;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock das funções do SweetAlert
    mockShowSuccess = jest.fn();
    mockShowError = jest.fn();
    mockShowConfirm = jest.fn();

    useSweetAlert.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showConfirm: mockShowConfirm,
    });

    // Mock do dispatch
    mockDispatch = jest.fn();

    // Mock do deleteContrato action
    deleteContrato.mockImplementation(id => ({
      type: 'contratos/delete',
      payload: id,
    }));

    // Criar store mock
    store = createMockStore({});
    store.dispatch = mockDispatch;
  });

  it('should return handleDeleteContrato function', () => {
    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    expect(typeof result.current.handleDeleteContrato).toBe('function');
  });

  it('should show confirm dialog when handleDeleteContrato is called', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: false });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    expect(mockShowConfirm).toHaveBeenCalledWith({
      title: 'Confirmar exclusão?',
      text: 'O registro desse contrato não pode ser recuperado!',
    });
  });

  it('should not dispatch deleteContrato when user cancels', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: false });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch deleteContrato when user confirms', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ type: 'fulfilled', payload: {} });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    expect(mockDispatch).toHaveBeenCalledWith(deleteContrato(1));
  });

  it('should show success message after successful deletion', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({
      type: 'contratos/delete/fulfilled',
      payload: {},
    });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    expect(mockShowSuccess).toHaveBeenCalledWith({
      title: 'Confirmado!',
      text: 'Contrato excluído com sucesso.',
    });
  });

  it('should show error message after failed deletion', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({
      type: 'contratos/delete/rejected',
      error: { message: 'Error' },
    });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    expect(mockShowError).toHaveBeenCalledWith({
      title: 'Erro!',
      text: 'Não foi possível excluir o contrato.',
    });
  });

  it('should handle deletion with different id types', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ type: 'fulfilled', payload: {} });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    // Test with number
    await act(async () => {
      await result.current.handleDeleteContrato(123);
    });
    expect(mockDispatch).toHaveBeenCalledWith(deleteContrato(123));

    // Test with string
    await act(async () => {
      await result.current.handleDeleteContrato('456');
    });
    expect(mockDispatch).toHaveBeenCalledWith(deleteContrato('456'));
  });

  it('should not show success/error messages if user cancels', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: false });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    expect(mockShowSuccess).not.toHaveBeenCalled();
    expect(mockShowError).not.toHaveBeenCalled();
  });

  it('should handle consecutive deletions', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ type: 'fulfilled', payload: {} });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    await act(async () => {
      await result.current.handleDeleteContrato(2);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockShowSuccess).toHaveBeenCalledTimes(2);
  });

  it('should handle error result object', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({
      type: 'contratos/delete/rejected',
      error: { message: 'Network error' },
    });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    expect(mockShowError).toHaveBeenCalled();
  });

  it('should call dispatch with correct action', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ type: 'fulfilled', payload: {} });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    const testId = 42;

    await act(async () => {
      await result.current.handleDeleteContrato(testId);
    });

    expect(deleteContrato).toHaveBeenCalledWith(testId);
    expect(mockDispatch).toHaveBeenCalledWith(deleteContrato(testId));
  });

  it('should handle rejection after confirmation', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ error: new Error('Failed to delete') });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });

    expect(mockShowError).toHaveBeenCalledWith({
      title: 'Erro!',
      text: 'Não foi possível excluir o contrato.',
    });
  });

  it('should handle multiple error scenarios', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    // Scenario 1: Network error
    mockDispatch.mockResolvedValue({ error: new Error('Network error') });
    await act(async () => {
      await result.current.handleDeleteContrato(1);
    });
    expect(mockShowError).toHaveBeenCalled();

    jest.clearAllMocks();

    // Scenario 2: Server error
    mockDispatch.mockResolvedValue({
      type: 'contratos/delete/rejected',
      error: { message: 'Server error' },
    });
    await act(async () => {
      await result.current.handleDeleteContrato(2);
    });
    expect(mockShowError).toHaveBeenCalled();
  });

  it('should use useSweetAlert hook', () => {
    renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    expect(useSweetAlert).toHaveBeenCalled();
  });

  it('should handle empty or null ids gracefully', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ type: 'fulfilled', payload: {} });

    const { result } = renderHook(() => useDeletarContrato(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.handleDeleteContrato(null);
    });

    expect(mockDispatch).toHaveBeenCalledWith(deleteContrato(null));
  });
});
