import React from 'react';
import { render } from '@testing-library/react';
import { useAulasList } from './useAulasList';

function TestComponent({ aulas, dataFormatter, handleDeleteAula, onColumns }) {
  const { columns, data } = useAulasList({
    aulas,
    dataFormatter,
    handleDeleteAula,
  });

  onColumns(columns);

  return (
    <div data-testid="columns">
      {columns.map(col => (
        <span key={col.name}>{col.name};</span>
      ))}
      {data.map(row => (
        <div key={row.id}>{row.professor}</div>
      ))}
    </div>
  );
}

describe('useAulasList hook', () => {
  it('marca a coluna Professor com wrap para permitir quebra de linha', () => {
    const aulas = [];
    const dataFormatter = jest.fn();
    const handleDeleteAula = jest.fn();
    let capturedColumns = null;

    render(
      <TestComponent
        aulas={aulas}
        dataFormatter={dataFormatter}
        handleDeleteAula={handleDeleteAula}
        onColumns={columns => {
          capturedColumns = columns;
        }}
      />
    );

    expect(capturedColumns.find(c => c.name === 'Professor').wrap).toBe(true);
  });
});
