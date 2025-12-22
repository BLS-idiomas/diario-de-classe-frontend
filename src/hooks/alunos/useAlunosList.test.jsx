import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAlunosList } from './useAlunosList';

function TestComponent({ alunos, telefoneFormatter, dataFormatter }) {
  const { columns, data } = useAlunosList({
    alunos,
    telefoneFormatter,
    dataFormatter,
  });

  return (
    <div>
      <div data-testid="columns">
        {columns.map(col => (
          <span key={col.name}>{col.name};</span>
        ))}
      </div>
      <div data-testid="rows">
        {data.map(row => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            <span>{row.id}</span>
            <span>{row.name}</span>
            <span>{row.sobrenome}</span>
            <span>{row.telefone}</span>
            <span>{row.email}</span>
            <span>{row.dataCriacao}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

describe('useAlunosList hook', () => {
  it('returns columns with expected names', () => {
    const alunos = [];
    const telefoneFormatter = jest.fn();
    const dataFormatter = jest.fn();

    render(
      <TestComponent
        alunos={alunos}
        telefoneFormatter={telefoneFormatter}
        dataFormatter={dataFormatter}
      />
    );

    const columnsEl = screen.getByTestId('columns');
    expect(columnsEl).toHaveTextContent('#;');
    expect(columnsEl).toHaveTextContent('Nome;');
    expect(columnsEl).toHaveTextContent('Sobrenome;');
    expect(columnsEl).toHaveTextContent('Telefone;');
    expect(columnsEl).toHaveTextContent('Email;');
    expect(columnsEl).toHaveTextContent('Data de criação;');
  });

  it('formats data using provided formatters', () => {
    const alunos = [
      {
        nome: 'João',
        sobrenome: 'Silva',
        telefone: '123456',
        email: 'joao@example.com',
        dataCriacao: '2023-01-01',
      },
    ];

    const telefoneFormatter = jest.fn(t => `tel:${t}`);
    const dataFormatter = jest.fn(d => `date:${d}`);

    render(
      <TestComponent
        alunos={alunos}
        telefoneFormatter={telefoneFormatter}
        dataFormatter={dataFormatter}
      />
    );

    // Ensure formatters were called with original values
    expect(telefoneFormatter).toHaveBeenCalledWith('123456');
    expect(dataFormatter).toHaveBeenCalledWith('2023-01-01');

    // Validate rendered transformed values
    const row = screen.getByTestId('row-1');
    expect(row).toHaveTextContent('1');
    expect(row).toHaveTextContent('João');
    expect(row).toHaveTextContent('Silva');
    expect(row).toHaveTextContent('tel:123456');
    expect(row).toHaveTextContent('joao@example.com');
    expect(row).toHaveTextContent('date:2023-01-01');
  });
});
