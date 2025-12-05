import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useDeletarAluno } from './useDeletarAluno';
import { deleteAluno } from '@/store/slices/alunosSlice';
import useSweetAlert from '@/hooks/useSweetAlert';

// Mock dos módulos
jest.mock('@/store/slices/alunosSlice', () => ({
  deleteAluno: jest.fn(),
}));

jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock store simples
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

describe('useDeletarAluno', () => {
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

    // Mock do deleteAluno action
    deleteAluno.mockImplementation(id => ({
      type: 'alunos/deleteAluno',
      payload: id,
    }));

    // Criar store mock
    store = createMockStore();
    store.dispatch = mockDispatch;
  });

  it('should return handleDeleteAluno function', () => {
    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    expect(result.current).toEqual({
      handleDeleteAluno: expect.any(Function),
    });
  });

  it('should show confirmation dialog when handleDeleteAluno is called', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: false });

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    await act(async () => {
      await result.current.handleDeleteAluno(123);
    });

    expect(mockShowConfirm).toHaveBeenCalledWith({
      title: 'Confirmar exclusão?',
      text: 'O registro desse aluno não pode ser recuperado!',
    });
  });

  it('should not dispatch delete action when user cancels confirmation', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: false });

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    await act(async () => {
      await result.current.handleDeleteAluno(123);
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockShowSuccess).not.toHaveBeenCalled();
    expect(mockShowError).not.toHaveBeenCalled();
  });

  it('should dispatch delete action and show success when user confirms and operation succeeds', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ type: 'success' });

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    await act(async () => {
      await result.current.handleDeleteAluno(123);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/deleteAluno',
      payload: 123,
    });

    expect(mockShowSuccess).toHaveBeenCalledWith({
      title: 'Confirmado!',
      text: 'Aluno excluído com sucesso.',
    });

    expect(mockShowError).not.toHaveBeenCalled();
  });

  it('should show error message when delete operation fails', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ error: true });

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    await act(async () => {
      await result.current.handleDeleteAluno(456);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/deleteAluno',
      payload: 456,
    });

    expect(mockShowError).toHaveBeenCalledWith({
      title: 'Erro!',
      text: 'Não foi possível excluir o aluno.',
    });

    expect(mockShowSuccess).not.toHaveBeenCalled();
  });

  it('should handle string IDs correctly', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ type: 'success' });

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    await act(async () => {
      await result.current.handleDeleteAluno('abc123');
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/deleteAluno',
      payload: 'abc123',
    });
  });

  it('should handle confirmation dialog errors gracefully', async () => {
    mockShowConfirm.mockRejectedValue(new Error('Dialog error'));

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    await act(async () => {
      await expect(result.current.handleDeleteAluno(123)).rejects.toThrow(
        'Dialog error'
      );
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should handle multiple delete operations sequentially', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({ type: 'success' });

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    await act(async () => {
      await result.current.handleDeleteAluno(1);
    });

    await act(async () => {
      await result.current.handleDeleteAluno(2);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockShowSuccess).toHaveBeenCalledTimes(2);
  });

  it('should handle network error in dispatch', async () => {
    mockShowConfirm.mockResolvedValue({ isConfirmed: true });
    mockDispatch.mockResolvedValue({
      error: { message: 'Network error' },
    });

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useDeletarAluno(), { wrapper });

    await act(async () => {
      await result.current.handleDeleteAluno(789);
    });

    expect(mockShowError).toHaveBeenCalledWith({
      title: 'Erro!',
      text: 'Não foi possível excluir o aluno.',
    });
  });
});
