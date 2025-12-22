import { renderHook } from '@testing-library/react';
import { useAulasList } from './useAulasList';
import React from 'react';

describe('useAulasList', () => {
  const mockFormatter = jest.fn(date => `format:${date}`);
  const mockDelete = jest.fn();
  const aulas = [
    {
      id: 10,
      dataCriacao: '2025-12-21',
      horaFinal: '10:00',
      horaInicial: '09:00',
      status: 'ATIVO',
      tipo: 'PADRAO',
    },
  ];

  it('should return columns and data with actions', () => {
    const { result } = renderHook(() =>
      useAulasList({
        aulas,
        dataFormatter: mockFormatter,
        handleDeleteAula: mockDelete,
      })
    );
    expect(result.current.columns.some(col => col.name === 'Ações')).toBe(true);
    expect(result.current.data[0].id).toBe(1);
    expect(result.current.data[0].dataCriacao).toBe('format:2025-12-21');
    expect(result.current.data[0].horaFinal).toBe('10:00');
    expect(result.current.data[0].horaInicial).toBe('09:00');
    expect(result.current.data[0].status).toBe('ATIVO');
    expect(result.current.data[0].tipo).toBe('PADRAO');
    // Testa se existe o componente de ações (div)
    expect(React.isValidElement(result.current.data[0].acoes)).toBe(true);
  });

  it('should not include actions column if readOnly is true', () => {
    const { result } = renderHook(() =>
      useAulasList({
        aulas,
        dataFormatter: mockFormatter,
        handleDeleteAula: mockDelete,
        readOnly: true,
      })
    );
    expect(result.current.columns.some(col => col.name === 'Ações')).toBe(
      false
    );
  });

  it('should return empty data if aulas is undefined', () => {
    const { result } = renderHook(() =>
      useAulasList({
        aulas: undefined,
        dataFormatter: mockFormatter,
        handleDeleteAula: mockDelete,
      })
    );
    expect(result.current.data).toEqual([]);
  });
});
