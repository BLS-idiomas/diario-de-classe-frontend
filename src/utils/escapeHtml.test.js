import { escapeHtml } from './escapeHtml';

describe('escapeHtml', () => {
  it('escapa os cinco caracteres perigosos', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });

  it('escapa & antes dos demais, sem duplicar entidade', () => {
    // Se & fosse escapado depois, "&lt;" viraria "&amp;lt;".
    expect(escapeHtml('<a>')).toBe('&lt;a&gt;');
    expect(escapeHtml('&amp;')).toBe('&amp;amp;');
  });

  it('neutraliza a payload que escapava do textarea', () => {
    // Era o vetor real: fechava o textarea e injetava uma <img> com onerror.
    const payload = '</textarea><img src=x onerror="alert(1)">';

    const escapado = escapeHtml(payload);

    expect(escapado).not.toContain('</textarea>');
    expect(escapado).not.toContain('<img');
    expect(escapado).toContain('&lt;/textarea&gt;');
  });

  it('neutraliza payload de atributo', () => {
    const escapado = escapeHtml('x" onfocus="alert(1)');

    expect(escapado).not.toContain('"');
    expect(escapado).toContain('&quot;');
  });

  it.each([null, undefined])('devolve string vazia para %p', valor => {
    expect(escapeHtml(valor)).toBe('');
  });

  it('converte não-string para texto', () => {
    expect(escapeHtml(3)).toBe('3');
    expect(escapeHtml(0)).toBe('0');
    expect(escapeHtml(false)).toBe('false');
  });

  it('mantém texto comum intacto', () => {
    expect(escapeHtml('Unit 1 - Greetings')).toBe('Unit 1 - Greetings');
  });
});
