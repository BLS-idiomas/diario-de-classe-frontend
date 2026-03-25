import { getEntityOptions } from '../getEntityOptions';

describe('getEntityOptions', () => {
  it('should return an empty array when provided with an empty array', () => {
    const result = getEntityOptions([]);
    expect(result).toEqual([]);
  });

  it('should transform a single entity correctly', () => {
    const entities = [
      {
        id: 1,
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@example.com',
      },
    ];

    const result = getEntityOptions(entities);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      label: 'João Silva <joao@example.com>',
      value: 1,
    });
  });

  it('should transform multiple entities correctly', () => {
    const entities = [
      {
        id: 1,
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@example.com',
      },
      {
        id: 2,
        nome: 'Maria',
        sobrenome: 'Santos',
        email: 'maria@example.com',
      },
      {
        id: 3,
        nome: 'Pedro',
        sobrenome: 'Oliveira',
        email: 'pedro@example.com',
      },
    ];

    const result = getEntityOptions(entities);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      {
        label: 'João Silva <joao@example.com>',
        value: 1,
      },
      {
        label: 'Maria Santos <maria@example.com>',
        value: 2,
      },
      {
        label: 'Pedro Oliveira <pedro@example.com>',
        value: 3,
      },
    ]);
  });

  it('should handle entities with special characters in names', () => {
    const entities = [
      {
        id: 1,
        nome: 'José',
        sobrenome: 'São João',
        email: 'jose@example.com',
      },
    ];

    const result = getEntityOptions(entities);

    expect(result[0]).toEqual({
      label: 'José São João <jose@example.com>',
      value: 1,
    });
  });

  it('should preserve the order of entities', () => {
    const entities = [
      {
        id: 10,
        nome: 'A',
        sobrenome: 'Z',
        email: 'a@example.com',
      },
      {
        id: 5,
        nome: 'B',
        sobrenome: 'Y',
        email: 'b@example.com',
      },
      {
        id: 15,
        nome: 'C',
        sobrenome: 'X',
        email: 'c@example.com',
      },
    ];

    const result = getEntityOptions(entities);

    expect(result.map(opt => opt.value)).toEqual([10, 5, 15]);
  });

  it('should not mutate the original array', () => {
    const entities = [
      {
        id: 1,
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@example.com',
      },
    ];

    const entitiesCopy = JSON.parse(JSON.stringify(entities));

    getEntityOptions(entities);

    expect(entities).toEqual(entitiesCopy);
  });
});
