'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from 'react';
import {
  getKey,
  parseThemeCookie,
  serializeThemeCookie,
  DEFAULT_THEME,
} from '@/utils/themeCookie';

const THEME_KEY = getKey();

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children, initialTheme = null }) => {
  const [theme, setTheme] = useState(initialTheme ?? DEFAULT_THEME);
  // Distingue "escolha explícita registrada" de "ambiente" (DEC-002-004,
  // emenda de mecanismo): só cookie e migração de localStorage contam como
  // escolha; a correção por `matchMedia` (SO em modo escuro) não. Começa
  // `true` só quando já havia cookie — é o que o servidor resolveu.
  const [hasChoice, setHasChoice] = useState(initialTheme !== null);

  // Migração de preferência salva antes do cookie existir (DEC-002-001,
  // emenda de mecanismo) + preferência de sistema operacional na primeira
  // visita (AC-001-003, cenário 2): só executa quando não há cookie
  // (`initialTheme === null`) — nesse caso não há nada a perder, então o
  // efeito lê `localStorage` uma única vez e corrige o estado em memória,
  // sem gravar nada (nem cookie, nem `localStorage`) aqui — a gravação em
  // ambos os canais é só responsabilidade de `toggleTheme` (ação explícita
  // do usuário). `localStorage` (escolha explícita anterior) tem prioridade
  // sobre a preferência do sistema operacional: só cai em `matchMedia`
  // quando não há cookie **e** não há legado em `localStorage`.
  useLayoutEffect(() => {
    if (initialTheme !== null) return;

    const legacy = parseThemeCookie(localStorage.getItem(THEME_KEY));
    if (legacy) {
      if (legacy !== theme) setTheme(legacy);
      setHasChoice(true);
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atributo lido pelo CSS (DEC-002-004): sem escolha explícita registrada
  // ainda, permanece `'system'` para o bloco `[data-theme='system'] @media
  // (prefers-color-scheme: dark)` decidir — nunca `theme` puro, ou a escolha
  // explícita de tema claro seria sobreposta pelo SO em modo escuro.
  const domTheme = hasChoice ? theme : 'system';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', domTheme);
  }, [domTheme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    document.cookie = serializeThemeCookie(next);
    setTheme(next);
    setHasChoice(true);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={domTheme}>{children}</div>
    </ThemeContext.Provider>
  );
};
