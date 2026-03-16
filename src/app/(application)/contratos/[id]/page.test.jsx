import { render } from '@testing-library/react';
import Contrato from './page';
import { notFound, useParams } from 'next/navigation';
import { useContrato } from '@/hooks/contratos/useContrato';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';

jest.mock('@/hooks/contratos/useContrato');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/aulas/useAulasList');
jest.mock('@/components');

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  notFound: jest.fn(),
}));

describe('Contrato Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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
});
