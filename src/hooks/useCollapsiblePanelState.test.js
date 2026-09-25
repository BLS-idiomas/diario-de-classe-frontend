import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { useCollapsiblePanelState } from './useCollapsiblePanelState';

const CHAVE_A = 'panel_teste_a';
const CHAVE_B = 'panel_teste_b';
const CHAVE_MAPA = 'panel_teste_mapa';

function ComponenteQueLogaIsOpen({ storageKey, renderLog }) {
  const { isOpen } = useCollapsiblePanelState(storageKey);
  renderLog.push(isOpen);
  return null;
}

describe('useCollapsiblePanelState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('AC-001-001/014: sem preferência salva para a chave, isOpen inicial é true', () => {
    const { result } = renderHook(() => useCollapsiblePanelState(CHAVE_A));

    expect(result.current.isOpen).toBe(true);
  });

  it('AC-001-003/016: toggle() inverte, persiste e isola por chave', () => {
    const { result } = renderHook(() => useCollapsiblePanelState(CHAVE_A));

    act(() => result.current.toggle());

    expect(result.current.isOpen).toBe(false);
    expect(JSON.parse(localStorage.getItem(CHAVE_A))).toBe('recolhido');

    const { result: mesmaChave } = renderHook(() =>
      useCollapsiblePanelState(CHAVE_A)
    );
    expect(mesmaChave.current.isOpen).toBe(false);

    const { result: outraChave } = renderHook(() =>
      useCollapsiblePanelState(CHAVE_B)
    );
    expect(outraChave.current.isOpen).toBe(true);
  });

  it('AC-001-003/016 (ramo aberto): recolhido semeado, toggle() reabre e persiste "aberto" — nova instância da mesma chave também lê aberto', () => {
    localStorage.setItem(CHAVE_A, JSON.stringify('recolhido'));

    const { result } = renderHook(() => useCollapsiblePanelState(CHAVE_A));
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());

    expect(result.current.isOpen).toBe(true);
    // conteúdo persistido, não o retorno de loadPanelState: o default
    // ('aberto') e o valor gravado 'aberto' são indistinguíveis por lá.
    expect(JSON.parse(localStorage.getItem(CHAVE_A))).toBe('aberto');

    const { result: novaInstancia } = renderHook(() =>
      useCollapsiblePanelState(CHAVE_A)
    );
    expect(novaInstancia.current.isOpen).toBe(true);
  });

  it('AC-001-004/017: leitura que lança resulta em isOpen=true, sem propagar exceção', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(_key => {
      throw new Error('falha simulada de leitura');
    });

    let hook;
    expect(() => {
      hook = renderHook(() => useCollapsiblePanelState(CHAVE_A));
    }).not.toThrow();

    expect(hook.result.current.isOpen).toBe(true);
  });

  it('AC-001-004/017: gravação que lança resulta em isOpen=true, sem propagar exceção', () => {
    const { result } = renderHook(() => useCollapsiblePanelState(CHAVE_A));

    jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation((_key, _value) => {
        throw new Error('falha simulada de gravação');
      });

    expect(() => {
      act(() => result.current.toggle());
    }).not.toThrow();

    expect(result.current.isOpen).toBe(true);
  });

  it('AC-001-023: variante mapa, itemIds distintos sem preferência salva → ambas isOpen=true', () => {
    const { result: a } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'a' })
    );
    const { result: b } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'b' })
    );

    expect(a.current.isOpen).toBe(true);
    expect(b.current.isOpen).toBe(true);
  });

  it('AC-001-025: toggle() na variante mapa persiste só o item alterado', () => {
    const { result: a } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'a' })
    );

    act(() => a.current.toggle());

    expect(JSON.parse(localStorage.getItem(CHAVE_MAPA))).toEqual({
      a: 'recolhido',
    });

    const { result: novaA } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'a' })
    );
    expect(novaA.current.isOpen).toBe(false);

    const { result: novaB } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'b' })
    );
    expect(novaB.current.isOpen).toBe(true);
  });

  it('AC-001-025 (ramo aberto): item semeado recolhido, toggle() reabre e persiste "aberto" no mapa — nova instância do mesmo item também lê aberto', () => {
    localStorage.setItem(CHAVE_MAPA, JSON.stringify({ a: 'recolhido' }));

    const { result } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'a' })
    );
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());

    expect(result.current.isOpen).toBe(true);
    // conteúdo persistido, não o retorno de loadPanelStateMap: o default
    // ('aberto') e o valor gravado 'aberto' são indistinguíveis por lá.
    expect(JSON.parse(localStorage.getItem(CHAVE_MAPA))).toEqual({
      a: 'aberto',
    });

    const { result: novaInstancia } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'a' })
    );
    expect(novaInstancia.current.isOpen).toBe(true);
  });

  it('AC-001-026: leitura/gravação que lança na variante mapa não bloqueia as demais instâncias', () => {
    const { result: a } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'a' })
    );
    const { result: b } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'b' })
    );

    jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation((_key, _value) => {
        throw new Error('falha simulada de gravação');
      });

    expect(() => {
      act(() => a.current.toggle());
    }).not.toThrow();

    expect(a.current.isOpen).toBe(true);

    jest.restoreAllMocks();

    expect(b.current.isOpen).toBe(true);
  });

  it('AC-001-024 (parcial): toggle() na primeira instância não escreve na chave da segunda no mapa persistido', () => {
    const { result: a } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'a' })
    );
    const { result: b } = renderHook(() =>
      useCollapsiblePanelState({ mapKey: CHAVE_MAPA, itemId: 'b' })
    );

    act(() => a.current.toggle());

    expect(b.current.isOpen).toBe(true);
    // conteúdo persistido: 'b' não sofreu escrita nenhuma — não é só que
    // "aberto" veio de volta, é que a chave nunca foi tocada.
    expect(JSON.parse(localStorage.getItem(CHAVE_MAPA))).toEqual({
      a: 'recolhido',
    });
  });

  it('NFR-001-002: isOpen já nasce false na primeira execução do corpo, sem correção por efeito', () => {
    localStorage.setItem(CHAVE_A, JSON.stringify('recolhido'));
    const renderLog = [];

    render(
      <ComponenteQueLogaIsOpen storageKey={CHAVE_A} renderLog={renderLog} />
    );

    expect(renderLog.length).toBeGreaterThanOrEqual(1);
    expect(renderLog.every(valor => valor === false)).toBe(true);
  });
});
