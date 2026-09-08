import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useLivrosList } from './useLivrosList';

function TestComponent({ livros, readOnly = false }) {
  const { columns, data } = useLivrosList({
    livros,
    handleDeleteLivro: jest.fn(),
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
        {data.map(row => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            <span data-testid={`nome-${row.id}`}>{row.nome}</span>
            <span data-testid={`idioma-${row.id}`}>{row.idioma}</span>
            <span data-testid={`nivel-${row.id}`}>{row.nivel}</span>
            <span data-testid={`ativo-${row.id}`}>{row.ativo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

describe('useLivrosList hook', () => {
  it('retorna as colunas esperadas', () => {
    render(<TestComponent livros={[]} />);

    const columnsEl = screen.getByTestId('columns');
    expect(columnsEl).toHaveTextContent('Livro;');
    expect(columnsEl).toHaveTextContent('Idioma;');
    expect(columnsEl).toHaveTextContent('Nível;');
    expect(columnsEl).toHaveTextContent('Situação;');
    expect(columnsEl).toHaveTextContent('Ações;');
  });

  it('remove a coluna de ações quando readOnly', () => {
    render(<TestComponent livros={[]} readOnly />);

    expect(screen.getByTestId('columns')).not.toHaveTextContent('Ações;');
  });

  it('traduz idioma e situação do livro', () => {
    render(
      <TestComponent
        livros={[
          {
            id: 'livro-1',
            nome: 'New Interchange 1',
            idioma: 'INGLES',
            nivel: 1,
            ativo: true,
          },
        ]}
      />
    );

    expect(screen.getByTestId('nome-1')).toHaveTextContent('New Interchange 1');
    expect(screen.getByTestId('idioma-1')).toHaveTextContent('Inglês');
    expect(screen.getByTestId('nivel-1')).toHaveTextContent('1');
    expect(screen.getByTestId('ativo-1')).toHaveTextContent('Ativo');
  });

  it('mostra traço no nível ausente e marca livro inativo', () => {
    render(
      <TestComponent
        livros={[
          {
            id: 'livro-2',
            nome: 'Espanhol Básico',
            idioma: 'ESPANHOL',
            nivel: null,
            ativo: false,
          },
        ]}
      />
    );

    expect(screen.getByTestId('nivel-1')).toHaveTextContent('-');
    expect(screen.getByTestId('ativo-1')).toHaveTextContent('Inativo');
  });

  it('devolve lista vazia sem livros', () => {
    render(<TestComponent livros={null} />);

    expect(screen.getByTestId('rows')).toBeEmptyDOMElement();
  });
});
