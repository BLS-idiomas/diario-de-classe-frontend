import {
  loadFilters,
  saveFilters,
  clearFilters,
  clearAllFilters,
  loadPanelState,
  savePanelState,
  loadPanelStateMap,
  savePanelStateMap,
  isConfigDeMapa,
} from './filterStorage';
import {
  FILTER_STORAGE_KEYS,
  FILTER_PANEL_STORAGE_KEYS,
  RELATORIOS_PANEL_STORAGE_KEY,
} from '@/constants';

describe('filterStorage util', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const defaults = { dataInicio: '', tipo: '', q: '' };

  it('returns defaults when nothing is stored', () => {
    expect(loadFilters('filters_aulas', defaults)).toEqual(defaults);
  });

  it('merges stored values over defaults', () => {
    localStorage.setItem('filters_aulas', JSON.stringify({ tipo: 'PADRAO' }));
    expect(loadFilters('filters_aulas', defaults)).toEqual({
      dataInicio: '',
      tipo: 'PADRAO',
      q: '',
    });
  });

  it('returns defaults when stored JSON is invalid', () => {
    localStorage.setItem('filters_aulas', '{invalid');
    expect(loadFilters('filters_aulas', defaults)).toEqual(defaults);
  });

  it('saves filters as JSON', () => {
    saveFilters('filters_aulas', { tipo: 'OUTRA' });
    expect(JSON.parse(localStorage.getItem('filters_aulas'))).toEqual({
      tipo: 'OUTRA',
    });
  });

  it('clears a single filter key', () => {
    saveFilters('filters_aulas', { tipo: 'OUTRA' });
    clearFilters('filters_aulas');
    expect(localStorage.getItem('filters_aulas')).toBeNull();
  });

  it('clears all filter keys', () => {
    Object.values(FILTER_STORAGE_KEYS).forEach(key =>
      saveFilters(key, { any: true })
    );
    clearAllFilters();
    Object.values(FILTER_STORAGE_KEYS).forEach(key =>
      expect(localStorage.getItem(key)).toBeNull()
    );
  });

  it('clears all panel state keys', () => {
    Object.values(FILTER_PANEL_STORAGE_KEYS).forEach(key =>
      savePanelState(key, 'recolhido')
    );
    savePanelStateMap(
      RELATORIOS_PANEL_STORAGE_KEY,
      'algum-endpoint',
      'recolhido'
    );

    clearAllFilters();

    Object.values(FILTER_PANEL_STORAGE_KEYS).forEach(key =>
      expect(localStorage.getItem(key)).toBeNull()
    );
    expect(localStorage.getItem(RELATORIOS_PANEL_STORAGE_KEY)).toBeNull();
  });
});

describe('loadPanelState / savePanelState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the default when nothing is stored or stored JSON is invalid', () => {
    expect(loadPanelState('panel_aulas', 'aberto')).toBe('aberto');

    localStorage.setItem('panel_aulas', '{invalid');
    expect(loadPanelState('panel_aulas', 'aberto')).toBe('aberto');
  });

  it('persists the plain value', () => {
    savePanelState('panel_aulas', 'recolhido');
    expect(loadPanelState('panel_aulas', 'aberto')).toBe('recolhido');
  });

  it.each([
    ['RECOLHIDO', JSON.stringify('RECOLHIDO')],
    ['true', JSON.stringify(true)],
    ['<script>', JSON.stringify('<script>')],
    ['número', JSON.stringify(5)],
    ['objeto', JSON.stringify({ recolhido: true })],
    ['null', JSON.stringify(null)],
    ['string vazia', JSON.stringify('')],
    ['JSON inválido', '{invalid'],
  ])(
    'deny-by-default: valor gravado à mão (%s) devolve o default, nunca "recolhido"',
    (_descricao, valorGravado) => {
      localStorage.setItem('panel_aulas', valorGravado);
      expect(loadPanelState('panel_aulas', 'aberto')).toBe('aberto');
    }
  );
});

describe('isConfigDeMapa (endereço canônico da convenção de storageKey, achado C)', () => {
  it.each([
    ['string simples', 'panel_aulas', false],
    ['objeto { mapKey, itemId }', { mapKey: 'k', itemId: 'a' }, true],
    ['objeto qualquer sem mapKey', { itemId: 'a' }, false],
    ['null', null, false],
    ['número', 5, false],
    ['undefined', undefined, false],
  ])('com %s, devolve %s', (_descricao, valor, esperado) => {
    expect(isConfigDeMapa(valor)).toBe(esperado);
  });
});

describe('loadPanelStateMap / savePanelStateMap', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the default when the item is absent from the map', () => {
    savePanelStateMap(RELATORIOS_PANEL_STORAGE_KEY, 'endpoint-a', 'recolhido');
    expect(
      loadPanelStateMap(RELATORIOS_PANEL_STORAGE_KEY, 'endpoint-b', 'aberto')
    ).toBe('aberto');
  });

  it('returns the default when the stored map JSON is invalid (fail secure)', () => {
    localStorage.setItem(RELATORIOS_PANEL_STORAGE_KEY, '{invalid');
    expect(
      loadPanelStateMap(RELATORIOS_PANEL_STORAGE_KEY, 'endpoint-a', 'aberto')
    ).toBe('aberto');
  });

  it('merges items instead of replacing the whole map', () => {
    savePanelStateMap(RELATORIOS_PANEL_STORAGE_KEY, 'endpoint-a', 'recolhido');
    savePanelStateMap(RELATORIOS_PANEL_STORAGE_KEY, 'endpoint-b', 'aberto');

    // conteúdo persistido, não o retorno de loadPanelStateMap: sob
    // substituição total do mapa, a última chave escrita sempre sobrevive,
    // então uma asserção sobre o retorno nunca discriminaria merge de
    // substituição (mutante `if (value === 'aberto') return;` sobreviveria).
    expect(
      JSON.parse(localStorage.getItem(RELATORIOS_PANEL_STORAGE_KEY))
    ).toEqual({ 'endpoint-a': 'recolhido', 'endpoint-b': 'aberto' });
  });

  it.each([
    ['RECOLHIDO', 'RECOLHIDO'],
    ['true', true],
    ['<script>', '<script>'],
    ['número', 5],
    ['objeto', { recolhido: true }],
    ['null', null],
    ['string vazia', ''],
  ])(
    'deny-by-default: item com valor gravado à mão (%s) devolve o default, nunca "recolhido"',
    (_descricao, valorGravado) => {
      localStorage.setItem(
        RELATORIOS_PANEL_STORAGE_KEY,
        JSON.stringify({ 'endpoint-lixo': valorGravado })
      );
      expect(
        loadPanelStateMap(
          RELATORIOS_PANEL_STORAGE_KEY,
          'endpoint-lixo',
          'aberto'
        )
      ).toBe('aberto');
    }
  );
});
