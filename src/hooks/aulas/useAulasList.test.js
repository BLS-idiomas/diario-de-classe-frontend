import { renderHook } from '@testing-library/react';
import { useAulasList } from './useAulasList';
import React from 'react';
import { STATUS_AULA_LABEL } from '@/constants/statusAulas';
import { TIPO_AULA_LABEL } from '@/constants/tipoAula';

describe('useAulasList', () => {
  const mockFormatter = jest.fn(date => `format:${date}`);
  const mockDelete = jest.fn();
  const aulas = [
    {
      id: 10,
      dataCriacao: '2025-12-21',
      horaFinal: '10:00',
      horaInicial: '09:00',
      status: 'AGENDADA',
      tipo: 'PADRAO',
    },
    {
      id: 11,
      dataCriacao: '2025-12-22',
      horaFinal: '11:00',
      horaInicial: '10:00',
      status: 'EM_ANDAMENTO',
      tipo: 'PADRAO',
    },
    {
      id: 12,
      dataCriacao: '2025-12-23',
      horaFinal: '12:00',
      horaInicial: '11:00',
      status: 'CONCLUIDA',
      tipo: 'PADRAO',
    },
    {
      id: 13,
      dataCriacao: '2025-12-24',
      horaFinal: '13:00',
      horaInicial: '12:00',
      status: 'CANCELADA',
      tipo: 'PADRAO',
    },
    {
      id: 14,
      dataCriacao: '2025-12-25',
      horaFinal: '14:00',
      horaInicial: '13:00',
      status: 'CANCELADA_POR_FALTA',
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
    expect(result.current.data[0].status).toBe(
      STATUS_AULA_LABEL[aulas[0].status]
    );
    expect(result.current.data[0].tipo).toBe(TIPO_AULA_LABEL[aulas[0].tipo]);
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
