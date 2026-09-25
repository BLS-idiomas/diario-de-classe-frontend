// Fixture isolado de TASK-002-007 (slug hidratacao) — existe só para provar
// que a suíte de regressão detectaria a reintrodução dos padrões antigos de
// I/O de browser em ThemeProvider/useAvatar. Nunca importado por código de
// produção: reproduz deliberadamente o mecanismo problemático (localStorage
// sem guard, Math.random na conta) para os testes de
// `ThemeProvider.ssr.test.js`/`useAvatar.ssr.test.js` espionarem.

export const lerPreferenciaSemGuard = () => {
  return localStorage.getItem('theme');
};

export const gravarPreferenciaSemGuard = () => {
  localStorage.setItem('theme', 'dark');
};

export const calcularValorComSorteio = () => {
  return Math.random();
};
