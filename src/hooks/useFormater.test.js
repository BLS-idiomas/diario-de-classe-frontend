import { useFormater } from './useFormater';

describe('useFormater', () => {
  const { telefoneFormatter, dataFormatter } = useFormater();

  describe('telefoneFormatter', () => {
    it('returns - for falsy values', () => {
      expect(telefoneFormatter(null)).toBe('-');
      expect(telefoneFormatter(undefined)).toBe('-');
      expect(telefoneFormatter('')).toBe('-');
    });

    it('formats 11-digit phone correctly', () => {
      const raw = '11987654321';
      expect(telefoneFormatter(raw)).toBe('(11) 98765-4321');
    });

    it('formats 10-digit phone correctly', () => {
      const raw = '1198765432';
      expect(telefoneFormatter(raw)).toBe('(11) 9876-5432');
    });

    it('strips non-digit characters before formatting', () => {
      const raw = '(11) 98765-4321';
      expect(telefoneFormatter(raw)).toBe('(11) 98765-4321');
    });
  });

  describe('dataFormatter', () => {
    it('returns - for falsy values', () => {
      expect(dataFormatter(null)).toBe('-');
      expect(dataFormatter(undefined)).toBe('-');
      expect(dataFormatter('')).toBe('-');
    });

    it('formats ISO date string to dd/mm/yyyy', () => {
      // use midday UTC to avoid timezone boundary issues
      const iso = '2024-05-10T12:00:00Z';
      expect(dataFormatter(iso)).toBe('10/05/2024');
    });
  });
});
