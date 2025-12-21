import { makeFullNameLabel } from './makeFullNameLabel';

describe('makeFullNameLabel', () => {
  it('should concatenate nome and sobrenome with a space', () => {
    expect(makeFullNameLabel({ nome: 'João', sobrenome: 'Silva' })).toBe(
      'João Silva'
    );
    expect(makeFullNameLabel({ nome: 'Ana', sobrenome: 'Paula' })).toBe(
      'Ana Paula'
    );
  });

  it('should handle empty sobrenome', () => {
    expect(makeFullNameLabel({ nome: 'João', sobrenome: '' })).toBe('João ');
  });

  it('should handle empty nome', () => {
    expect(makeFullNameLabel({ nome: '', sobrenome: 'Silva' })).toBe(' Silva');
  });

  it('should handle both empty', () => {
    expect(makeFullNameLabel({ nome: '', sobrenome: '' })).toBe(' ');
  });
});
