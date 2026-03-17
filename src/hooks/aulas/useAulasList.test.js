import { renderHook } from '@testing-library/react';
import { useAulasList } from './useAulasList';
import React from 'react';
import { STATUS_AULA_LABEL } from '@/constants/statusAulas';
import { TIPO_AULA_LABEL } from '@/constants/tipoAula';
import { IDIOMA_LABEL } from '@/constants/idioma';

describe('useAulasList', () => {
  const mockFormatter = jest.fn(date => `format:${date}`);
  const mockDelete = jest.fn();

  const mockAula = {
    id: 10,
    dataAula: '2025-12-21',
    horaFinal: '10:00',
    horaInicial: '09:00',
    status: 'AGENDADA',
    tipo: 'PADRAO',
    contrato: { idioma: 'INGLES' },
    aluno: { nome: 'Aluno 1' },
    professor: { nome: 'Professor 1' },
  };

  const aulas = [
    mockAula,
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('columns', () => {
    it('should return all columns including actions by default', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: [],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      const columnNames = result.current.columns.map(col => col.name);
      expect(columnNames).toEqual([
        '#',
        'Aluno',
        'Professor',
        'Data',
        'Hora inicial',
        'Hora final',
        'Tipo',
        'Status',
        'Idioma',
        'Ações',
      ]);
    });

    it('should remove actions column when readOnly is true', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: [],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
          readOnly: true,
        })
      );

      const columnNames = result.current.columns.map(col => col.name);
      expect(columnNames).not.toContain('Ações');
      expect(columnNames).toHaveLength(9);
    });

    it('should have correct column properties', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: [],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      const idColumn = result.current.columns[0];
      expect(idColumn.name).toBe('#');
      expect(idColumn.sortable).toBe(true);
      expect(idColumn.width).toBe('75px');

      const acoesColumn =
        result.current.columns[result.current.columns.length - 1];
      expect(acoesColumn.name).toBe('Ações');
      expect(acoesColumn.sortable).toBe(false);
      expect(acoesColumn.width).toBe('auto');
    });
  });

  describe('data transformation', () => {
    it('should transform aula data correctly', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: [mockAula],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data).toHaveLength(1);
      const firstRow = result.current.data[0];

      expect(firstRow.id).toBe(1);
      expect(firstRow.dataAula).toBe('format:2025-12-21');
      expect(firstRow.horaInicial).toBe('09:00');
      expect(firstRow.horaFinal).toBe('10:00');
      expect(firstRow.status).toBe(STATUS_AULA_LABEL['AGENDADA']);
      expect(firstRow.tipo).toBe(TIPO_AULA_LABEL['PADRAO']);
      expect(firstRow.idioma).toBe(IDIOMA_LABEL['INGLES']);
      expect(firstRow.aluno).toBe('Aluno 1');
      expect(firstRow.professor).toBe('Professor 1');
    });

    it('should use fallback "-" when aluno or professor is missing', () => {
      const aulaWithMissingData = {
        ...mockAula,
        aluno: null,
        professor: null,
      };

      const { result } = renderHook(() =>
        useAulasList({
          aulas: [aulaWithMissingData],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data[0].aluno).toBe('-');
      expect(result.current.data[0].professor).toBe('-');
    });

    it('should use fallback "-" when aluno.nome or professor.nome is missing', () => {
      const aulaWithEmptyNames = {
        ...mockAula,
        aluno: {},
        professor: {},
      };

      const { result } = renderHook(() =>
        useAulasList({
          aulas: [aulaWithEmptyNames],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data[0].aluno).toBe('-');
      expect(result.current.data[0].professor).toBe('-');
    });

    it('should format multiple aulas with correct sequence', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas,
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data).toHaveLength(3);
      expect(result.current.data[0].id).toBe(1);
      expect(result.current.data[1].id).toBe(2);
      expect(result.current.data[2].id).toBe(3);
    });
  });

  describe('actions component', () => {
    it('should render actions component with valid React element', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: [mockAula],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(React.isValidElement(result.current.data[0].acoes)).toBe(true);
    });

    it('should still render actions in data even when readOnly is true', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: [mockAula],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
          readOnly: true,
        })
      );

      // Data still contains acoes, but the column is removed
      expect(React.isValidElement(result.current.data[0].acoes)).toBe(true);
    });
  });

  describe('empty and null handling', () => {
    it('should return empty data when aulas is undefined', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: undefined,
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data).toEqual([]);
    });

    it('should return empty data when aulas is null', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: null,
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data).toEqual([]);
    });

    it('should return empty data when aulas is empty array', () => {
      const { result } = renderHook(() =>
        useAulasList({
          aulas: [],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data).toEqual([]);
    });
  });

  describe('data formatter usage', () => {
    it('should call dataFormatter for each aula', () => {
      renderHook(() =>
        useAulasList({
          aulas,
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(mockFormatter).toHaveBeenCalledWith('2025-12-21');
      expect(mockFormatter).toHaveBeenCalledWith('2025-12-22');
      expect(mockFormatter).toHaveBeenCalledWith('2025-12-23');
      expect(mockFormatter).toHaveBeenCalledTimes(3);
    });

    it('should use formatted data in result', () => {
      mockFormatter.mockReturnValueOnce('21/12/2025');

      const { result } = renderHook(() =>
        useAulasList({
          aulas: [mockAula],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data[0].dataAula).toBe('21/12/2025');
    });
  });

  describe('memoization', () => {
    it('should memoize data and not recompute with same props', () => {
      const { result, rerender } = renderHook(
        ({ props }) =>
          useAulasList({
            aulas: props.aulas,
            dataFormatter: props.dataFormatter,
            handleDeleteAula: props.handleDeleteAula,
            readOnly: props.readOnly,
            submit: props.submit,
            isLoadingSubmit: props.isLoadingSubmit,
          }),
        {
          initialProps: {
            props: {
              aulas,
              dataFormatter: mockFormatter,
              handleDeleteAula: mockDelete,
              readOnly: false,
              submit: null,
              isLoadingSubmit: false,
            },
          },
        }
      );

      const firstData = result.current.data;

      rerender({
        props: {
          aulas,
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
          readOnly: false,
          submit: null,
          isLoadingSubmit: false,
        },
      });

      expect(result.current.data).toBe(firstData);
    });

    it('should recompute data when aulas changes', () => {
      const { result, rerender } = renderHook(
        ({ aulas: aulasProp }) =>
          useAulasList({
            aulas: aulasProp,
            dataFormatter: mockFormatter,
            handleDeleteAula: mockDelete,
          }),
        {
          initialProps: { aulas: [mockAula] },
        }
      );

      const firstData = result.current.data;
      expect(firstData).toHaveLength(1);

      rerender({ aulas });

      expect(result.current.data).not.toBe(firstData);
      expect(result.current.data).toHaveLength(3);
    });
  });

  describe('different statuses and types', () => {
    it('should correctly label all aula statuses', () => {
      const aulaWithDifferentStatus = {
        ...mockAula,
        status: 'CONCLUIDA',
      };

      const { result } = renderHook(() =>
        useAulasList({
          aulas: [aulaWithDifferentStatus],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data[0].status).toBe(
        STATUS_AULA_LABEL['CONCLUIDA']
      );
    });

    it('should correctly label all aula types', () => {
      const aulaWithDifferentType = {
        ...mockAula,
        tipo: 'PROVA',
      };

      const { result } = renderHook(() =>
        useAulasList({
          aulas: [aulaWithDifferentType],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data[0].tipo).toBe(TIPO_AULA_LABEL['PROVA']);
    });

    it('should correctly label all idiomas', () => {
      const aulaWithDifferentIdioma = {
        ...mockAula,
        contrato: { idioma: 'ESPANHOL' },
      };

      const { result } = renderHook(() =>
        useAulasList({
          aulas: [aulaWithDifferentIdioma],
          dataFormatter: mockFormatter,
          handleDeleteAula: mockDelete,
        })
      );

      expect(result.current.data[0].idioma).toBe(IDIOMA_LABEL['ESPANHOL']);
    });
  });
});
