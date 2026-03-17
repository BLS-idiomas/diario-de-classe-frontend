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
      dataAula: '2025-12-21',
      horaFinal: '10:00',
      horaInicial: '09:00',
      status: 'AGENDADA',
      tipo: 'PADRAO',
      contrato: { idioma: 'INGLES' },
      aluno: { nome: 'Aluno 1' },
      professor: { nome: 'Professor 1' },
    },
    {
      id: 11,
      dataAula: '2025-12-22',
      horaFinal: '11:00',
      horaInicial: '10:00',
      status: 'EM_ANDAMENTO',
      tipo: 'PADRAO',
      contrato: { idioma: 'ESPANHOL' },
      aluno: { nome: 'Aluno 2' },
      professor: { nome: 'Professor 2' },
    },
    {
      id: 12,
      dataAula: '2025-12-23',
      horaFinal: '12:00',
      horaInicial: '11:00',
      status: 'CONCLUIDA',
      tipo: 'PADRAO',
      contrato: { idioma: 'INGLES' },
      aluno: { nome: 'Aluno 3' },
      professor: { nome: 'Professor 1' },
    },
    {
      id: 13,
      dataAula: '2025-12-24',
      horaFinal: '13:00',
      horaInicial: '12:00',
      status: 'CANCELADA',
      tipo: 'PADRAO',
      contrato: { idioma: 'FRANCÊS' },
      aluno: { nome: 'Aluno 4' },
      professor: { nome: 'Professor 3' },
    },
    {
      id: 14,
      dataAula: '2025-12-25',
      horaFinal: '14:00',
      horaInicial: '13:00',
      status: 'CANCELADA_POR_FALTA',
      tipo: 'PADRAO',
      contrato: { idioma: 'INGLES' },
      aluno: { nome: 'Aluno 5' },
      professor: { nome: 'Professor 2' },
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
    expect(result.current.data[0].dataAula).toBe('format:2025-12-21');
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
