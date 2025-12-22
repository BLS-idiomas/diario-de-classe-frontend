import { makeEmailLabel } from './makeEmailLabel';

describe('makeEmailLabel', () => {
  it('should return the correct email label', () => {
    const input = {
      nome: 'João',
      sobrenome: 'Silva',
      email: 'joao@exemplo.com',
    };
    const result = makeEmailLabel(input);
    expect(result).toBe('João Silva <joao@exemplo.com>');
  });

  it('should handle empty sobrenome', () => {
    const input = { nome: 'Maria', sobrenome: '', email: 'maria@exemplo.com' };
    const result = makeEmailLabel(input);
    expect(result).toBe('Maria  <maria@exemplo.com>');
  });

  it('should handle missing fields gracefully', () => {
    const input = { nome: '', sobrenome: '', email: '' };
    const result = makeEmailLabel(input);
    expect(result).toBe('  <>');
  });
});
