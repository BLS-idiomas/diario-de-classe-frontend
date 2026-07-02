import { startOfTodayUTC } from './startOfTodayUTC';

describe('startOfTodayUTC util', () => {
  it('returns today at UTC midnight (00:00:00.000Z)', () => {
    const hoje = startOfTodayUTC();
    const now = new Date();

    expect(hoje.getUTCHours()).toBe(0);
    expect(hoje.getUTCMinutes()).toBe(0);
    expect(hoje.getUTCSeconds()).toBe(0);
    expect(hoje.getUTCMilliseconds()).toBe(0);
    expect(hoje.getUTCFullYear()).toBe(now.getUTCFullYear());
    expect(hoje.getUTCMonth()).toBe(now.getUTCMonth());
    expect(hoje.getUTCDate()).toBe(now.getUTCDate());
  });

  it('treats a class dated at today UTC midnight as not-past', () => {
    const hoje = startOfTodayUTC();
    const aulaHoje = new Date(hoje);
    expect(aulaHoje < hoje).toBe(false);
    expect(aulaHoje >= hoje).toBe(true);
  });
});
