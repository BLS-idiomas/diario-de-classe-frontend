import { renderHook } from '@testing-library/react';
import { useAvatar } from './useAvatar';

describe('useAvatar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getTitleByText', () => {
    it('should return first letter of a single word in uppercase', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('João');
      expect(title).toBe('JO');
    });

    it('should return first letter of first and second word in uppercase', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('João Silva');
      expect(title).toBe('JS');
    });

    it('should return first two letters if only one word', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('Maria');
      expect(title).toBe('MA');
    });

    it('should handle names with more than two words', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('João Pedro Silva');
      expect(title).toBe('JP');
    });

    it('should handle single character names', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('J');
      expect(title).toBe('J');
    });

    it('should handle empty or null text', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('');
      expect(title).toBe('');
    });

    it('should convert lowercase to uppercase', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('ana maria');
      expect(title).toBe('AM');
    });
  });

  describe('getKeyByText', () => {
    it('should generate key for single word', () => {
      const { result } = renderHook(() => useAvatar());
      const key = result.current.getKeyByText('João');
      expect(key).toBe('João-avatar-key');
    });

    it('should replace spaces with hyphens', () => {
      const { result } = renderHook(() => useAvatar());
      const key = result.current.getKeyByText('João Silva');
      expect(key).toBe('João-Silva-avatar-key');
    });

    it('should handle multiple spaces', () => {
      const { result } = renderHook(() => useAvatar());
      const key = result.current.getKeyByText('João Pedro Silva');
      expect(key).toBe('João-Pedro-Silva-avatar-key');
    });

    it('should append -avatar-key suffix', () => {
      const { result } = renderHook(() => useAvatar());
      const key = result.current.getKeyByText('Test');
      expect(key).toContain('-avatar-key');
    });
  });

  describe('getColorByText', () => {
    it('should return a color class with text-white', () => {
      const { result } = renderHook(() => useAvatar());
      const color = result.current.getColorByText('João Silva');
      expect(color).toContain('text-white');
      expect(color).toMatch(/bg-\w+-\d+/);
    });

    it('should return consistent color for same text', () => {
      const { result } = renderHook(() => useAvatar());
      const color1 = result.current.getColorByText('João Silva');
      const color2 = result.current.getColorByText('João Silva');
      expect(color1).toBe(color2);
    });

    it('should save color to localStorage', () => {
      const { result } = renderHook(() => useAvatar());
      const text = 'Maria Santos';
      result.current.getColorByText(text);

      const key = result.current.getKeyByText(text);
      const savedColor = localStorage.getItem(key);
      expect(savedColor).toBeTruthy();
      expect(savedColor).toMatch(/bg-\w+-\d+/);
    });

    it('should retrieve color from localStorage if exists', () => {
      const { result } = renderHook(() => useAvatar());
      const text = 'Pedro Oliveira';
      const key = result.current.getKeyByText(text);

      // Pré-salva uma cor no cache
      localStorage.setItem(key, 'bg-red-400');

      const color = result.current.getColorByText(text);
      expect(color).toBe('bg-red-400 text-white');
    });

    it('should generate random color if not in cache', () => {
      const { result } = renderHook(() => useAvatar());
      const color = result.current.getColorByText('Novo Usuario');

      const validColors = [
        'bg-red-400',
        'bg-green-500',
        'bg-blue-500',
        'bg-yellow-600',
        'bg-purple-500',
        'bg-pink-500',
        'bg-teal-500',
        'bg-orange-500',
        'bg-cyan-500',
        'bg-indigo-500',
      ];

      const colorClass = color.replace(' text-white', '');
      expect(validColors).toContain(colorClass);
    });

    it('should generate different colors for different texts (statistically)', () => {
      const { result } = renderHook(() => useAvatar());
      const colors = new Set();

      // Testa com 20 nomes diferentes
      for (let i = 0; i < 20; i++) {
        const color = result.current.getColorByText(`Usuario ${i}`);
        colors.add(color);
      }

      // Espera que pelo menos 5 cores diferentes sejam geradas
      expect(colors.size).toBeGreaterThanOrEqual(5);
    });
  });

  describe('integration tests', () => {
    it('should work together: key generation, color assignment and retrieval', () => {
      const { result } = renderHook(() => useAvatar());
      const text = 'Ana Costa';

      // Gera a chave
      const key = result.current.getKeyByText(text);
      expect(key).toBe('Ana-Costa-avatar-key');

      // Gera e salva a cor
      const color1 = result.current.getColorByText(text);
      expect(color1).toContain('text-white');

      // Recupera a mesma cor
      const color2 = result.current.getColorByText(text);
      expect(color1).toBe(color2);

      // Verifica que está no localStorage
      const cachedColor = localStorage.getItem(key);
      expect(cachedColor).toBeTruthy();
    });

    it('should generate title and color for complete avatar', () => {
      const { result } = renderHook(() => useAvatar());
      const text = 'Carlos Eduardo';

      const title = result.current.getTitleByText(text);
      const color = result.current.getColorByText(text);

      expect(title).toBe('CE');
      expect(color).toContain('text-white');
      expect(color).toMatch(/bg-\w+-\d+/);
    });
  });

  describe('edge cases', () => {
    it('should handle text with special characters', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('José María');
      expect(title).toBe('JM');
    });

    it('should handle text with numbers', () => {
      const { result } = renderHook(() => useAvatar());
      const title = result.current.getTitleByText('User123');
      expect(title).toBe('US');
    });

    it('should handle very long names', () => {
      const { result } = renderHook(() => useAvatar());
      const longName = 'João Pedro Antonio Carlos Eduardo Silva Santos';
      const title = result.current.getTitleByText(longName);
      expect(title).toBe('JP');
      expect(title.length).toBe(2);
    });

    it('should handle empty string', () => {
      const { result } = renderHook(() => useAvatar());
      const key = result.current.getKeyByText('');
      expect(key).toBe('-avatar-key');
    });
  });
});
