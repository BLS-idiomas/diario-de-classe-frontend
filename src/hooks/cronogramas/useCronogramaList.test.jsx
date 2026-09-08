import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCronogramaList } from './useCronogramaList';

function TestComponent({ linhas, readOnly = false }) {
  const { columns, data } = useCronogramaList({
    linhas,
    dataFormatter: value => (value ? `fmt(${value})` : ''),
    handleLancarConteudo: jest.fn(),
    readOnly,
  });

  return (
    <div>
      <div data-testid="columns">
        {columns.map(col => (
          <span key={col.name}>{col.name};</span>
        ))}
      </div>
      <div data-testid="rows">
        {data.map((row, index) => (
          <div key={index} data-testid={`row-${index}`}>
            <span data-testid={`ordem-${index}`}>{row.ordem}</span>
            <span data-testid={`titulo-${index}`}>{row.titulo}</span>
            <span data-testid={`descricao-${index}`}>{row.descricao}</span>
            <span data-testid={`data-${index}`}>{row.dataAula}</span>
            <span data-testid={`hora-${index}`}>{row.hora}</span>
            <span data-testid={`status-${index}`}>{row.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const linha = (overrides = {}) => ({
  idAula: 'aula-1',
  ordem: 1,
  titulo: 'Unit 1',
  descricao: 'Greetings',
  dataAula: '2026-03-02',
  horaInicial: '08:00',
  horaFinal: '09:00',
  tipo: 'PADRAO',
  status: 'AGENDADA',
  conteudoManual: false,
  ...overrides,
});

describe('useCronogramaList hook', () => {
  it('retorna as colunas esperadas', () => {
    render(<TestComponent linhas={[]} />);

    const columnsEl = screen.getByTestId('columns');
    expect(columnsEl).toHaveTextContent('Ordem;');
    expect(columnsEl).toHaveTextContent('Conteúdo;');
    expect(columnsEl).toHaveTextContent('Descrição / tarefa;');
    expect(columnsEl).toHaveTextContent('Data;');
    expect(columnsEl).toHaveTextContent('Hora;');
    expect(columnsEl).toHaveTextContent('Tipo;');
    expect(columnsEl).toHaveTextContent('Status;');
    expect(columnsEl).toHaveTextContent('Ações;');
  });

  it('remove a coluna de ações quando readOnly', () => {
    render(<TestComponent linhas={[]} readOnly />);

    expect(screen.getByTestId('columns')).not.toHaveTextContent('Ações;');
  });

  it('monta a linha com data formatada e faixa de horário', () => {
    render(<TestComponent linhas={[linha()]} />);

    expect(screen.getByTestId('ordem-0')).toHaveTextContent('1');
    expect(screen.getByTestId('titulo-0')).toHaveTextContent('Unit 1');
    expect(screen.getByTestId('descricao-0')).toHaveTextContent('Greetings');
    expect(screen.getByTestId('data-0')).toHaveTextContent('fmt(2026-03-02)');
    expect(screen.getByTestId('hora-0')).toHaveTextContent('08:00 - 09:00');
  });

  it('traduz o status da aula', () => {
    render(<TestComponent linhas={[linha({ status: 'CONCLUIDA' })]} />);

    expect(screen.getByTestId('status-0')).toHaveTextContent('Concluída');
  });

  it('marca como manual a aula com conteúdo escolhido à mão', () => {
    render(<TestComponent linhas={[linha({ conteudoManual: true })]} />);

    expect(screen.getByTestId('status-0')).toHaveTextContent(
      'Agendada (manual)'
    );
  });

  it('explica a lacuna quando a aula não tem conteúdo vinculado', () => {
    render(
      <TestComponent
        linhas={[
          linha({
            ordem: null,
            titulo: null,
            descricao: null,
            status: 'CANCELADA_POR_FALTA',
          }),
        ]}
      />
    );

    expect(screen.getByTestId('titulo-0')).toHaveTextContent(
      '— sem conteúdo —'
    );
    expect(screen.getByTestId('ordem-0')).toHaveTextContent('-');
    expect(screen.getByTestId('descricao-0')).toHaveTextContent('-');
    expect(screen.getByTestId('status-0')).toHaveTextContent('Falta');
  });

  it('devolve lista vazia sem linhas', () => {
    render(<TestComponent linhas={null} />);

    expect(screen.getByTestId('rows')).toBeEmptyDOMElement();
  });
});
