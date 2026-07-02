import {
  loadFilters,
  saveFilters,
  clearFilters,
  clearAllFilters,
} from './filterStorage';
import { FILTER_STORAGE_KEYS } from '@/constants';

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
});
