import { withStickyColumns } from './tableResponsivo';

describe('withStickyColumns', () => {
  it('fixa apenas a primeira coluna essencial (#, left 0px) e a coluna de ações (right 0px) — gate 11', () => {
    const columns = [
      { name: '#', essential: true, width: '75px' },
      { name: 'Aluno', essential: true, width: '160px' },
      { name: 'Data', essential: true, width: '110px' },
      { name: 'Professor', essential: false },
      { name: 'Ações', isAction: true, width: 'auto' },
    ];

    const result = withStickyColumns(columns);

    expect(result[0].style.position).toBe('sticky');
    expect(result[0].style.left).toBe('0px');
    expect(result[1].style).toBeUndefined();
    expect(result[2].style).toBeUndefined();
    expect(result[3].style).toBeUndefined();
    expect(result[4].style.right).toBe('0px');
  });

  it('usa background-color: inherit nas células sticky, não um token fixo — a célula herda o background COMPUTADO da linha (base/zebra/hover) em vez de travar numa cor estática que nunca muda de estado', () => {
    const columns = [
      { name: '#', essential: true, width: '75px' },
      { name: 'Nome', essential: false },
      { name: 'Ações', isAction: true, width: 'auto' },
    ];

    const result = withStickyColumns(columns);

    expect(result[0].style.backgroundColor).toBe('inherit');
    expect(result[2].style.backgroundColor).toBe('inherit');
  });

  it('não lança e não atribui right quando não há coluna isAction (readOnly), mas mantém # sticky', () => {
    const columns = [
      { name: '#', essential: true, width: '75px' },
      { name: 'Nome', essential: true, width: '140px' },
      { name: 'Telefone', essential: false },
    ];

    expect(() => withStickyColumns(columns)).not.toThrow();

    const result = withStickyColumns(columns);
    result.forEach(column => {
      expect(column.style?.right).toBeUndefined();
    });
    expect(result[0].style.left).toBe('0px');
    expect(result[1].style).toBeUndefined();
  });

  it('é determinístico e não muta o array recebido', () => {
    const columns = [
      { name: '#', essential: true, width: '75px' },
      { name: 'Nome', essential: true, width: '140px' },
      { name: 'Ações', isAction: true, width: 'auto' },
    ];

    const first = withStickyColumns(columns);
    const second = withStickyColumns(columns);

    expect(first).toEqual(second);
    expect(columns[0].style).toBeUndefined();
  });

  it('não mede nada em runtime (sem ResizeObserver/getBoundingClientRect)', () => {
    const originalResizeObserver = global.ResizeObserver;
    const originalGetBoundingClientRect =
      Element.prototype.getBoundingClientRect;

    global.ResizeObserver = function () {
      throw new Error('ResizeObserver não deveria ser chamado');
    };
    Element.prototype.getBoundingClientRect = function () {
      throw new Error('getBoundingClientRect não deveria ser chamado');
    };

    const columns = [
      { name: '#', essential: true, width: '75px' },
      { name: 'Nome', essential: true, width: '140px' },
      { name: 'Ações', isAction: true, width: 'auto' },
    ];

    expect(() => withStickyColumns(columns)).not.toThrow();

    global.ResizeObserver = originalResizeObserver;
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });
});
