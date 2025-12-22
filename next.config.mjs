import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = withPWA({
  pwa: {
    dest: 'public',
    disable: isDev,
    register: true,
    skipWaiting: true,
    manifest: '/manifest.json',
  },
  // ...outras configs do next
});

// Adiciona configuração turbopack vazia para Next.js 16
export default {
  ...nextConfig,
  turbopack: {},
};
