const THEME_COOKIE_KEY = 'theme';
const THEME_VALUES = ['light', 'dark'];
const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 ano

// Fonte única do default de tema — importado por `layout.jsx` (fallback de
// SSR na ausência de cookie) e por `ThemeProvider` (estado inicial quando
// `initialTheme` chega `null`), para não haver dois literais divergentes.
export const DEFAULT_THEME = 'light';

export const getKey = () => THEME_COOKIE_KEY;

export const parseThemeCookie = rawValue => {
  if (THEME_VALUES.includes(rawValue)) return rawValue;
  return null;
};

export const serializeThemeCookie = theme => {
  return `${getKey()}=${theme}; Path=/; SameSite=Lax; Max-Age=${THEME_COOKIE_MAX_AGE_SECONDS}`;
};
