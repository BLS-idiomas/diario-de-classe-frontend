import { matchesSearchText, normalizeSearchText } from './matchesSearchText';

describe('matchesSearchText', () => {
  it('should match a substring in the middle of the label', () => {
    expect(matchesSearchText('Maria Aparecida', 'apare')).toBe(true);
  });

  it('should match when the label has an accent and the query does not', () => {
    expect(matchesSearchText('José Antônio', 'jose antonio')).toBe(true);
  });

  it('should match when the query has an accent and the label does not', () => {
    expect(matchesSearchText('Jose Antonio', 'josé antônio')).toBe(true);
  });

  it('should match regardless of mixed case', () => {
    expect(matchesSearchText('Maria Aparecida', 'APAREcida')).toBe(true);
  });

  it('should return true for an empty query regardless of the label', () => {
    expect(matchesSearchText('Maria Aparecida', '')).toBe(true);
    expect(matchesSearchText('', '')).toBe(true);
  });

  it('should return false when the query does not match any part of the label', () => {
    expect(matchesSearchText('Maria Aparecida', 'xyz123')).toBe(false);
  });

  it('should keep 1.000 calls well within the ~300ms NFR-001-001 budget', () => {
    const labels = Array.from(
      { length: 1000 },
      (_, index) => `aluno numero ${index} silva`
    );

    const start = performance.now();
    labels.forEach(label => matchesSearchText(label, 'numero 999'));
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100);
  });
});

describe('normalizeSearchText', () => {
  it('should lowercase and strip accents from the text', () => {
    expect(normalizeSearchText('João')).toBe('joao');
  });

  it('should lowercase text that already has no accents', () => {
    expect(normalizeSearchText('SILVA')).toBe('silva');
  });

  it('should strip accents while preserving mixed-case letters as lowercase', () => {
    expect(normalizeSearchText('Antônio')).toBe('antonio');
  });

  it('should return an empty string for an empty input', () => {
    expect(normalizeSearchText('')).toBe('');
  });
});
