import { render } from '@testing-library/react';
import EditarAula from './page';
import { useEditarAula } from '@/hooks/aulas/useEditarAula';
import { STATUS_ERROR } from '@/constants/statusError';

jest.mock('@/hooks/aulas/useEditarAula');
jest.mock('@/hooks/aulas/useAulaForm');
jest.mock('@/components');

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null),
  })),
  notFound: jest.fn(),
}));

const {
  useEditarAula: useEditarAulaHook,
} = require('@/hooks/aulas/useEditarAula');
const { useAulaForm: useAulaFormHook } = require('@/hooks/aulas/useAulaForm');

describe('Editar Aula Page', () => {
  let notFound;
  let useParams;
  let useSearchParams;

  beforeAll(() => {
    ({ notFound, useParams, useSearchParams } = require('next/navigation'));
  });
  beforeEach(() => {
    jest.clearAllMocks();

    useEditarAulaHook.mockReturnValue({
      aula: {
        id: 1,
        titulo: 'Aula 1',
        data: '2024-01-15',
        dataAula: '2024-01-15T10:00:00Z',
      },
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      statusError: null,
      current: { id: 1, titulo: 'Aula 1', dataAula: '2024-01-15T10:00:00Z' },
      errors: [],
      message: null,
      submit: jest.fn(),
    });

    useAulaFormHook.mockReturnValue({
      formData: { titulo: 'Aula 1' },
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFormData: jest.fn(),
    });
  });

  it('renders editar aula page', () => {
    render(<EditarAula />);
    expect(useEditarAulaHook).toHaveBeenCalled();
  });

  it('calls notFound when aula not found', () => {
    useEditarAulaHook.mockReturnValue({
      aula: null,
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      statusError: STATUS_ERROR.NOT_FOUND,
      current: null,
      errors: [],
      message: null,
      submit: jest.fn(),
    });

    useAulaFormHook.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFormData: jest.fn(),
    });

    render(<EditarAula />);
    expect(notFound).toHaveBeenCalled();
  });
});
