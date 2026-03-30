import { render } from '@testing-library/react';
import Contrato from './page';
import { notFound, useParams } from 'next/navigation';
import { useContrato } from '@/hooks/contratos/useContrato';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import * as nextNavigation from 'next/navigation';

jest.mock('@/hooks/contratos/useContrato');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/aulas/useAulasList');
jest.mock('@/components');

// Mock buildQueryString
jest.mock('@/utils/bindUrlParams', () => ({
  buildQueryString: jest.fn(params => {
    if (!params || Object.keys(params).length === 0) return '';
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `?${queryString}`;
  }),
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  useSearchParams: jest.fn(),
  notFound: jest.fn(),
}));

describe('Contrato Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useSearchParams
    const mockSearchParams = {
      get: jest.fn(() => null),
    };
    nextNavigation.useSearchParams.mockReturnValue(mockSearchParams);

    useContrato.mockReturnValue({
      contrato: { id: 1, numero: 'CONT-001', valor: 1000 },
      isLoading: false,
      isNotFound: false,
    });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(tel => tel),
      dataFormatter: jest.fn(date => date),
    });

    useAulasList.mockReturnValue({
      columns: [],
      data: [],
    });
  });

  it('renders contrato detail page', () => {
    render(<Contrato />);
    expect(useContrato).toHaveBeenCalled();
  });

  it('calls notFound when contrato not found', () => {
    useContrato.mockReturnValue({
      contrato: null,
      isLoading: false,
      isNotFound: true,
    });

    render(<Contrato />);
    expect(notFound).toHaveBeenCalled();
  });

  it('should use default /contratos when backUrl is null', () => {
    const mockSearchParams = {
      get: jest.fn(() => null),
    };
    nextNavigation.useSearchParams.mockReturnValue(mockSearchParams);

    render(<Contrato />);
    expect(mockSearchParams.get).toHaveBeenCalledWith('backUrl');
  });

  it('should use provided backUrl from searchParams', () => {
    const mockSearchParams = {
      get: jest.fn(key => {
        if (key === 'backUrl') return '/alunos/123';
        return null;
      }),
    };
    nextNavigation.useSearchParams.mockReturnValue(mockSearchParams);

    render(<Contrato />);
    expect(mockSearchParams.get).toHaveBeenCalledWith('backUrl');
  });
});
