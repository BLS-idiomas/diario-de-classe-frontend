import { getDatasPadrao } from './getDatasPadrao';

describe('getDatasPadrao', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('calcula início hoje e término N meses à frente, no fuso local', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-30T12:00:00.000-03:00'));

    expect(getDatasPadrao(3)).toEqual({
      dataInicioFormatada: '2026-06-30',
      dataTerminoFormatada: '2026-09-30',
    });
  });

  it('usa a semântica de todayLocalDate (fuso local), não toISOString/UTC', () => {
    jest.useFakeTimers();
    // Perto da meia-noite local: em UTC já é o dia seguinte — se o
    // utilitário reintroduzisse `toISOString().split('T')[0]`, este teste
    // capturaria a divergência de um dia.
    jest.setSystemTime(new Date('2026-06-30T23:30:00.000-03:00'));

    const { dataInicioFormatada, dataTerminoFormatada } = getDatasPadrao(6);

    expect(dataInicioFormatada).toBe('2026-06-30');
    expect(dataTerminoFormatada).toBe('2026-12-30');
  });

  it('parametriza a janela por número de meses (3 vs 6 produzem términos diferentes)', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-15T12:00:00.000-03:00'));

    expect(getDatasPadrao(3).dataTerminoFormatada).toBe('2026-04-15');
    expect(getDatasPadrao(6).dataTerminoFormatada).toBe('2026-07-15');
  });
});
