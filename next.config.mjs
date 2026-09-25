// Adiciona configuração turbopack vazia para Next.js 16

// Alimenta `NEXT_PUBLIC_BUILD_ID` — mecanismo `?v=` de invalidação de cache
// do SW documentado em `public/sw.js`.
const BUILD_ID = process.env.BUILD_ID || String(Date.now());

const config = {
  turbopack: {},
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
};

export default config;
