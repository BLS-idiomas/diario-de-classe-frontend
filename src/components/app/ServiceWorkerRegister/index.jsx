'use client';

import { useEffect } from 'react';

/**
 * Registro do service worker manual (COMP-002-002, DEC-002-001). Único
 * ponto que chama `navigator.serviceWorker.register()` — nenhum outro lugar
 * da árvore registra o SW.
 *
 * URL de registro leva `?v=<build>` — mecanismo de invalidação de cache
 * documentado em `public/sw.js`.
 *
 * Só registra em produção: em desenvolvimento o bundler pode servir chunk
 * sem nome estável por conteúdo, e um SW cache-first serviria JS velho após
 * editar e recarregar. Fora de produção, desregistra qualquer SW de sessão
 * anterior para não deixar um cache velho na frente do HMR.
 */
export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker
        .getRegistrations()
        .then(registrations => {
          registrations.forEach(registration => registration.unregister());
        })
        .catch(() => {});
      return;
    }

    // Registro é melhoria progressiva (COMP-002-002): uma falha (rede,
    // ambiente sem suporte real, escopo bloqueado) nunca deve virar promise
    // rejeitada solta nem quebrar a árvore — só não há SW nesta sessão.
    navigator.serviceWorker
      .register(`/sw.js?v=${process.env.NEXT_PUBLIC_BUILD_ID || 'dev'}`)
      .catch(() => {});
  }, []);

  return null;
};
