import { calculateDuracaoAula } from './calculateDuracaoAula';

describe('calculateDuracaoAula', () => {
  describe('Valid Durations', () => {
    it('should return 40 minutes when duration is valid', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '09:40',
      });
      expect(result).toBe(40);
    });

    it('should return 60 minutes when duration is valid', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '10:00',
      });
      expect(result).toBe(60);
    });

    it('should return 80 minutes when duration is valid', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '10:20',
      });
      expect(result).toBe(80);
    });

    it('should handle different starting times for 40 minute duration', () => {
      const result = calculateDuracaoAula({
        horaInicial: '14:30',
        horaFinal: '15:10',
      });
      expect(result).toBe(40);
    });

    it('should handle different starting times for 60 minute duration', () => {
      const result = calculateDuracaoAula({
        horaInicial: '14:30',
        horaFinal: '15:30',
      });
      expect(result).toBe(60);
    });

    it('should handle different starting times for 80 minute duration', () => {
      const result = calculateDuracaoAula({
        horaInicial: '14:30',
        horaFinal: '15:50',
      });
      expect(result).toBe(80);
    });
  });

  describe('Invalid Durations', () => {
    it('should return first valid duration (40) when duration is 50 minutes', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '09:50',
      });
      expect(result).toBe(40);
    });

    it('should return first valid duration (40) when duration is 30 minutes', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '09:30',
      });
      expect(result).toBe(40);
    });

    it('should return first valid duration (40) when duration is 120 minutes (not in array)', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '11:00',
      });
      expect(result).toBe(40);
    });

    it('should return first valid duration (40) when duration is 70 minutes', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '10:10',
      });
      expect(result).toBe(40);
    });

    it('should return first valid duration (40) when duration is 90 minutes', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '10:30',
      });
      expect(result).toBe(40);
    });
  });

  describe('Edge Cases', () => {
    it('should handle midnight boundary crossing', () => {
      const result = calculateDuracaoAula({
        horaInicial: '23:40',
        horaFinal: '00:20',
      });
      // 23:40 to 00:20 in minutes: from 1420 to 20 next day doesn't work with current logic
      // This would be negative, so it should return 40 (default)
      expect(result).toBe(40);
    });

    it('should handle same start and end time', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '09:00',
      });
      expect(result).toBe(40);
    });

    it('should handle time with minutes in both start and end', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:15',
        horaFinal: '09:55',
      });
      expect(result).toBe(40);
    });

    it('should handle single digit hours', () => {
      const result = calculateDuracaoAula({
        horaInicial: '9:00',
        horaFinal: '9:40',
      });
      expect(result).toBe(40);
    });
  });

  describe('Return Type', () => {
    it('should return an integer', () => {
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '09:40',
      });
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should return one of the valid durations', () => {
      const validDurations = [40, 60, 80];
      const result = calculateDuracaoAula({
        horaInicial: '09:00',
        horaFinal: '09:40',
      });
      expect(validDurations).toContain(result);
    });
  });

  describe('Real Scenarios', () => {
    it('should calculate 40 minute morning class', () => {
      const result = calculateDuracaoAula({
        horaInicial: '08:00',
        horaFinal: '08:40',
      });
      expect(result).toBe(40);
    });

    it('should calculate 60 minute morning class', () => {
      const result = calculateDuracaoAula({
        horaInicial: '08:00',
        horaFinal: '09:00',
      });
      expect(result).toBe(60);
    });

    it('should calculate 80 minute morning class', () => {
      const result = calculateDuracaoAula({
        horaInicial: '08:00',
        horaFinal: '09:20',
      });
      expect(result).toBe(80);
    });

    it('should calculate afternoon class with 40 minute duration', () => {
      const result = calculateDuracaoAula({
        horaInicial: '14:00',
        horaFinal: '14:40',
      });
      expect(result).toBe(40);
    });

    it('should calculate evening class with 60 minute duration', () => {
      const result = calculateDuracaoAula({
        horaInicial: '19:00',
        horaFinal: '20:00',
      });
      expect(result).toBe(60);
    });
  });
});
