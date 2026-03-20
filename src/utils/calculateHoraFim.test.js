import {
  calculateHoraFim,
  calculateHoraFimByDuracaoAula,
} from './calculateHoraFim';

describe('calculateHoraFim', () => {
  describe('Basic Calculations', () => {
    it('should calculate final time with 1 aula and 40 minutes duration', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: 1,
        tempoAula: 40,
      });
      expect(result).toBe('09:40');
    });

    it('should calculate final time with 2 aulas and 40 minutes each', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: 2,
        tempoAula: 40,
      });
      expect(result).toBe('10:20');
    });

    it('should calculate final time with 3 aulas and 40 minutes each', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: 3,
        tempoAula: 40,
      });
      expect(result).toBe('11:00');
    });

    it('should handle different starting hours correctly', () => {
      const result = calculateHoraFim({
        horaInicial: '14:30',
        quantidadeAulas: 2,
        tempoAula: 40,
      });
      expect(result).toBe('15:50');
    });
  });

  describe('Midnight Boundary', () => {
    it('should wrap around midnight correctly', () => {
      const result = calculateHoraFim({
        horaInicial: '23:00',
        quantidadeAulas: 2,
        tempoAula: 40,
      });
      expect(result).toBe('00:20');
    });

    it('should handle late evening time with single aula', () => {
      const result = calculateHoraFim({
        horaInicial: '23:30',
        quantidadeAulas: 1,
        tempoAula: 40,
      });
      expect(result).toBe('00:10');
    });

    it('should handle exact midnight boundary', () => {
      const result = calculateHoraFim({
        horaInicial: '23:20',
        quantidadeAulas: 1,
        tempoAula: 40,
      });
      expect(result).toBe('00:00');
    });

    it('should handle full day wrap-around', () => {
      const result = calculateHoraFim({
        horaInicial: '22:00',
        quantidadeAulas: 3,
        tempoAula: 120,
      });
      expect(result).toBe('04:00');
    });
  });

  describe('Different Time Durations', () => {
    it('should calculate with 50 minute duration', () => {
      const result = calculateHoraFim({
        horaInicial: '10:00',
        quantidadeAulas: 1,
        tempoAula: 50,
      });
      expect(result).toBe('10:50');
    });

    it('should calculate with 60 minute duration (1 hour)', () => {
      const result = calculateHoraFim({
        horaInicial: '10:00',
        quantidadeAulas: 1,
        tempoAula: 60,
      });
      expect(result).toBe('11:00');
    });

    it('should calculate with 30 minute duration', () => {
      const result = calculateHoraFim({
        horaInicial: '10:00',
        quantidadeAulas: 2,
        tempoAula: 30,
      });
      expect(result).toBe('11:00');
    });
  });

  describe('Edge Cases & Invalid Inputs', () => {
    it('should return empty string when horaInicial is missing', () => {
      const result = calculateHoraFim({
        horaInicial: '',
        quantidadeAulas: 1,
        tempoAula: 40,
      });
      expect(result).toBe('');
    });

    it('should return empty string when quantidadeAulas is 0', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: 0,
        tempoAula: 40,
      });
      expect(result).toBe('');
    });

    it('should return empty string when quantidadeAulas is negative', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: -1,
        tempoAula: 40,
      });
      expect(result).toBe('');
    });

    it('should return empty string when quantidadeAulas is null', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: null,
        tempoAula: 40,
      });
      expect(result).toBe('');
    });

    it('should return empty string when quantidadeAulas is undefined', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: undefined,
        tempoAula: 40,
      });
      expect(result).toBe('');
    });

    it('should return empty string when tempoAula is missing', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: 1,
        tempoAula: undefined,
      });
      expect(result).toBe('');
    });
  });

  describe('Formatting', () => {
    it('should pad single digit hours with leading zero', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: 1,
        tempoAula: 40,
      });
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should pad single digit minutes with leading zero', () => {
      const result = calculateHoraFim({
        horaInicial: '09:30',
        quantidadeAulas: 1,
        tempoAula: 25,
      });
      expect(result).toBe('09:55');
    });

    it('should handle hours with leading zeros in input', () => {
      const result = calculateHoraFim({
        horaInicial: '09:15',
        quantidadeAulas: 2,
        tempoAula: 40,
      });
      expect(result).toBe('10:35');
    });

    it('should format result as HH:MM', () => {
      const result = calculateHoraFim({
        horaInicial: '08:05',
        quantidadeAulas: 1,
        tempoAula: 50,
      });
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result).toBe('08:55');
    });
  });

  describe('Large Quantities', () => {
    it('should handle large quantity of aulas', () => {
      const result = calculateHoraFim({
        horaInicial: '09:00',
        quantidadeAulas: 10,
        tempoAula: 40,
      });
      expect(result).toBe('15:40');
    });

    it('should handle very large quantity wrapping around multiple times', () => {
      const result = calculateHoraFim({
        horaInicial: '10:00',
        quantidadeAulas: 50,
        tempoAula: 40,
      });
      // 50 * 40 = 2000 minutes = 33 hours 20 minutes
      // 10:00 + 33:20 = 19:20 (next day, so 19:20)
      expect(result).toBe('19:20');
    });
  });

  describe('Real Scenarios', () => {
    it('should calculate morning class schedule', () => {
      const result = calculateHoraFim({
        horaInicial: '08:00',
        quantidadeAulas: 2,
        tempoAula: 50,
      });
      expect(result).toBe('09:40');
    });

    it('should calculate afternoon class schedule', () => {
      const result = calculateHoraFim({
        horaInicial: '14:00',
        quantidadeAulas: 3,
        tempoAula: 50,
      });
      expect(result).toBe('16:30');
    });

    it('should calculate evening class extending past midnight', () => {
      const result = calculateHoraFim({
        horaInicial: '22:30',
        quantidadeAulas: 2,
        tempoAula: 50,
      });
      expect(result).toBe('00:10');
    });
  });
});

describe('calculateHoraFimByDuracaoAula', () => {
  describe('Basic Calculations', () => {
    it('should calculate final time with 40 minute duration', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '09:00',
        duracaoAula: 40,
      });
      expect(result).toBe('09:40');
    });

    it('should calculate final time with 60 minute duration', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '09:00',
        duracaoAula: 60,
      });
      expect(result).toBe('10:00');
    });

    it('should calculate final time with 80 minute duration', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '09:00',
        duracaoAula: 80,
      });
      expect(result).toBe('10:20');
    });

    it('should handle different starting hours correctly', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '14:30',
        duracaoAula: 60,
      });
      expect(result).toBe('15:30');
    });
  });

  describe('Midnight Boundary', () => {
    it('should wrap around midnight correctly', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '23:40',
        duracaoAula: 40,
      });
      expect(result).toBe('00:20');
    });

    it('should handle late evening time', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '23:30',
        duracaoAula: 40,
      });
      expect(result).toBe('00:10');
    });

    it('should handle exact midnight boundary', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '23:20',
        duracaoAula: 40,
      });
      expect(result).toBe('00:00');
    });

    it('should handle full day wrap-around', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '22:00',
        duracaoAula: 360,
      });
      expect(result).toBe('04:00');
    });
  });

  describe('Formatting', () => {
    it('should pad single digit hours with leading zero', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '09:00',
        duracaoAula: 40,
      });
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should pad single digit minutes with leading zero', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '09:30',
        duracaoAula: 25,
      });
      expect(result).toBe('09:55');
    });

    it('should format result as HH:MM', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '08:05',
        duracaoAula: 50,
      });
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result).toBe('08:55');
    });
  });

  describe('Real Scenarios', () => {
    it('should calculate morning class schedule', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '08:00',
        duracaoAula: 100,
      });
      expect(result).toBe('09:40');
    });

    it('should calculate afternoon class schedule', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '14:00',
        duracaoAula: 150,
      });
      expect(result).toBe('16:30');
    });

    it('should calculate evening class extending past midnight', () => {
      const result = calculateHoraFimByDuracaoAula({
        horaInicial: '22:30',
        duracaoAula: 100,
      });
      expect(result).toBe('00:10');
    });
  });
});
