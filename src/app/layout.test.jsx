import RootLayout from './layout';
import { cookies } from 'next/headers';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ServiceWorkerRegister } from '@/components/app/ServiceWorkerRegister';

jest.mock('next/headers', () => ({ cookies: jest.fn() }));

jest.mock('@/providers/ThemeProvider', () => ({
  ThemeProvider: jest.fn(({ children }) => children),
}));

// Percorre a árvore de elementos React (sem renderizar) até achar o primeiro
// elemento que satisfaz `predicate`, devolvendo o próprio elemento.
function findElement(element, predicate) {
  if (!element || typeof element !== 'object') return null;
  if (predicate(element)) return element;
  const { children } = element.props ?? {};
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    const found = findElement(child, predicate);
    if (found) return found;
  }
  return null;
}

function findThemeProviderProps(element) {
  const found = findElement(element, el => el.type === ThemeProvider);
  return found?.props ?? null;
}

function findHeadChildren(element) {
  const head = findElement(element, el => el.type === 'head');
  if (!head) return null;
  const { children } = head.props ?? {};
  return Array.isArray(children) ? children : [children];
}

describe('RootLayout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('resolves initialTheme from the theme cookie and passes it to ThemeProvider', async () => {
    cookies.mockResolvedValue({ get: () => ({ value: 'dark' }) });

    const tree = await RootLayout({ children: 'conteudo' });

    expect(findThemeProviderProps(tree)).toEqual(
      expect.objectContaining({ initialTheme: 'dark' })
    );
  });

  it('passes null (not a collapsed default) when the theme cookie is absent, so ThemeProvider can tell "no cookie" from "cookie=light"', async () => {
    cookies.mockResolvedValue({ get: () => undefined });

    const tree = await RootLayout({ children: 'conteudo' });

    expect(findThemeProviderProps(tree)).toEqual(
      expect.objectContaining({ initialTheme: null })
    );
  });

  it('aponta as meta tags do head para os ícones reais, nunca mais para /bls.png', async () => {
    cookies.mockResolvedValue({ get: () => undefined });

    const tree = await RootLayout({ children: 'conteudo' });
    const headChildren = findHeadChildren(tree);

    const findByProps = matcher =>
      headChildren.find(
        child => child && typeof child === 'object' && matcher(child.props)
      );

    const manifestLink = findByProps(p => p.rel === 'manifest');
    const themeColorMeta = findByProps(p => p.name === 'theme-color');
    const iconLink = findByProps(p => p.rel === 'icon');
    const appleTouchIconLink = findByProps(p => p.rel === 'apple-touch-icon');

    expect(manifestLink.props.href).toBe('/manifest.json');
    expect(themeColorMeta.props.content).toBe('#1e293b');
    expect(iconLink.props.href).toMatch(/^\/icon-(192|512)\.png$/);
    expect(appleTouchIconLink.props.href).toMatch(/^\/icon-(192|512)\.png$/);
  });

  it('monta o ServiceWorkerRegister como filho do body (COMP-002-002)', async () => {
    cookies.mockResolvedValue({ get: () => undefined });

    const tree = await RootLayout({ children: 'conteudo' });

    expect(
      findElement(tree, el => el.type === ServiceWorkerRegister)
    ).not.toBeNull();
  });
});
