import { renderHook } from '@testing-library/react';
import { useSidebar } from './useSidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/professores',
}));

describe('useSidebar', () => {
  it('deve retornar strokeWidth como 1', () => {
    const { result } = renderHook(() => useSidebar(() => true));
    expect(result.current.strokeWidth).toBe(1);
  });

  it('deve incluir itens esperados na sidebar e refletir isAdmin corretamente', () => {
    // when isAdmin returns true
    const { result: r1 } = renderHook(() => useSidebar(() => true));
    expect(r1.current.sidebarItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/professores', label: 'Professores' }),
        expect.objectContaining({ href: '/', label: 'Home' }),
        expect.objectContaining({ href: '/meu-perfil', label: 'Meu perfil' }),
      ])
    );

    const professoresItem = r1.current.sidebarItems.find(
      i => i.href === '/professores'
    );
    expect(professoresItem).toBeDefined();
    expect(professoresItem.show).toBe(true);

    // when isAdmin returns false
    const { result: r2 } = renderHook(() => useSidebar(() => false));
    const professoresItem2 = r2.current.sidebarItems.find(
      i => i.href === '/professores'
    );
    expect(professoresItem2).toBeDefined();
    expect(professoresItem2.show).toBe(false);
  });

  it('deve retornar true para isActive quando o href for igual ao pathname', () => {
    const { result } = renderHook(() => useSidebar(() => true));
    expect(result.current.isActive('/professores')).toBe(true);
    expect(result.current.isActive('/alunos')).toBe(false);
  });

  it('deve retornar false para isActive quando o href for diferente do pathname', () => {
    const { result } = renderHook(() => useSidebar(() => true));
    expect(result.current.isActive('/aulas')).toBe(false);
  });
});
