import { todayLocalDate } from './todayLocalDate';

describe('todayLocalDate', () => {
  it('formata a data local como YYYY-MM-DD', () => {
    expect(todayLocalDate(new Date(2026, 8, 8, 10, 0))).toBe('2026-09-08');
  });

  it('não vira o dia à noite, ao contrário do toISOString', () => {
    // Regressão: em UTC-3, das 21h em diante o toISOString() já está no dia
    // seguinte e o input type="date" abria com amanhã.
    const noite = new Date(2026, 8, 8, 23, 30);

    expect(todayLocalDate(noite)).toBe('2026-09-08');
    expect(todayLocalDate(noite)).toBe(
      `${noite.getFullYear()}-09-0${noite.getDate()}`
    );
  });

  it('preenche mês e dia com zero à esquerda', () => {
    expect(todayLocalDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('usa agora quando nenhuma data é passada', () => {
    const agora = new Date();
    const esperado = `${agora.getFullYear()}-${String(
      agora.getMonth() + 1
    ).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;

    expect(todayLocalDate()).toBe(esperado);
  });
});
