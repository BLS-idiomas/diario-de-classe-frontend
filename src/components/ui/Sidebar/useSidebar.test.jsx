import { renderHook } from '@testing-library/react';
import { useSidebar } from './useSidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/professores',
}));

describe('useSidebar', () => {
  it('deve retornar strokeWidth como 1', () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.strokeWidth).toBe(1);
  });

  it('deve retornar os itens da sidebar corretamente', () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.sidebarItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/professores', label: 'Professores' }),
        expect.objectContaining({ href: '/', label: 'Home' }),
      ])
    );
    expect(result.current.sidebarItems).toHaveLength(6);
  });

  it('deve retornar true para isActive quando o href for igual ao pathname', () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.isActive('/professores')).toBe(true);
    expect(result.current.isActive('/alunos')).toBe(false);
  });

  it('deve retornar false para isActive quando o href for diferente do pathname', () => {
    const { result } = renderHook(() => useSidebar());
    expect(result.current.isActive('/aulas')).toBe(false);
  });
});
