import React from 'react';
import { render } from '@testing-library/react';
import { useProfessoresList } from './useProfessoresList';

function TestComponent(props) {
  const { columns, data } = useProfessoresList(props);
  return (
    <div>
      <div data-testid="columns">{columns.map(c => c.name).join('|')}</div>
      <div data-testid="rows">
        {data.map((r, i) => (
          <div key={i} data-testid={`row-${i}`}>
            <div data-testid={`row-${i}-name`}>{r.name}</div>
            <div data-testid={`row-${i}-telefone`}>{r.telefone}</div>
            <div data-testid={`row-${i}-data`}>{r.dataCriacao}</div>
            <div data-testid={`row-${i}-acoes`}>{r.acoes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

describe('useProfessoresList', () => {
  it('returns columns and formatted data and calls delete handler', () => {
    const professores = [
      {
        id: 10,
        nome: 'João',
        sobrenome: 'Silva',
        telefone: '11987654321',
        email: 'joao@test.com',
        permissao: 'admin',
        dataCriacao: '2024-05-10T12:00:00Z',
      },
    ];

    const currentUser = { id: 999, nome: 'Admin User' };
    const telefoneFormatter = jest.fn(t => `tel-${t}`);
    const dataFormatter = jest.fn(d => `data-${d}`);
    const handleDeleteProfessor = jest.fn();

    const { getByTestId } = render(
      <TestComponent
        currentUser={currentUser}
        professores={professores}
        telefoneFormatter={telefoneFormatter}
        dataFormatter={dataFormatter}
        handleDeleteProfessor={handleDeleteProfessor}
      />
    );

    // columns
    expect(getByTestId('columns').textContent).toContain('Nome');

    // formatted fields
    expect(getByTestId('row-0-name').textContent).toBe('João');
    expect(getByTestId('row-0-telefone').textContent).toBe('tel-11987654321');
    expect(getByTestId('row-0-data').textContent).toBe(
      'data-2024-05-10T12:00:00Z'
    );

    // simulate delete button click inside the acoes
    const acoes = getByTestId('row-0-acoes');
    const button = acoes.querySelector('button');
    expect(button).not.toBeNull();

    // click
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(handleDeleteProfessor).toHaveBeenCalledWith(10);
  });

  it('hides delete button when currentUser.id matches professor.id', () => {
    const professores = [
      {
        id: 10,
        nome: 'João',
        sobrenome: 'Silva',
        telefone: '11987654321',
        email: 'joao@test.com',
        permissao: 'admin',
        dataCriacao: '2024-05-10T12:00:00Z',
      },
    ];

    const currentUser = { id: 10, nome: 'João' }; // Same ID as professor
    const telefoneFormatter = jest.fn(t => `tel-${t}`);
    const dataFormatter = jest.fn(d => `data-${d}`);
    const handleDeleteProfessor = jest.fn();

    const { getByTestId } = render(
      <TestComponent
        currentUser={currentUser}
        professores={professores}
        telefoneFormatter={telefoneFormatter}
        dataFormatter={dataFormatter}
        handleDeleteProfessor={handleDeleteProfessor}
      />
    );

    // Delete button should not be present
    const acoes = getByTestId('row-0-acoes');
    const button = acoes.querySelector('button');
    expect(button).toBeNull();
  });

  it('shows delete button when currentUser is null', () => {
    const professores = [
      {
        id: 10,
        nome: 'João',
        sobrenome: 'Silva',
        telefone: '11987654321',
        email: 'joao@test.com',
        permissao: 'admin',
        dataCriacao: '2024-05-10T12:00:00Z',
      },
    ];

    const telefoneFormatter = jest.fn(t => `tel-${t}`);
    const dataFormatter = jest.fn(d => `data-${d}`);
    const handleDeleteProfessor = jest.fn();

    const { getByTestId } = render(
      <TestComponent
        currentUser={null}
        professores={professores}
        telefoneFormatter={telefoneFormatter}
        dataFormatter={dataFormatter}
        handleDeleteProfessor={handleDeleteProfessor}
      />
    );

    // Delete button should be present when currentUser is null
    const acoes = getByTestId('row-0-acoes');
    const button = acoes.querySelector('button');
    expect(button).not.toBeNull();
  });
});
