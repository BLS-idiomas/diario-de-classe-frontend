'use client';

import { useInstallPrompt } from '@/hooks/pwa/useInstallPrompt';

/**
 * Convite de instalação discreto (COMP-002-003, FR-001-003/004/005). Todo o
 * contexto de exibição (mobile, autenticado, fora do login, fora do modo
 * standalone) é decidido pelo hook + pelo ponto de mount deste componente
 * (só dentro do layout autenticado, `src/app/(application)/layout.jsx`) —
 * este componente só decide O QUE renderizar dado (`estado`, `estaVisivel`).
 * O desfecho da escolha do usuário (aceite/recusa) não tem estado próprio
 * aqui: sai por toast (disparado pelo hook) e o banner recolhe.
 */
export const InstallPrompt = () => {
  const { estado, estaVisivel, promptInstall, dispensarConvite } =
    useInstallPrompt();

  if (!estaVisivel) {
    return null;
  }

  return (
    <div
      data-testid="install-prompt"
      role="status"
      className="fixed bottom-4 inset-x-4 mx-auto z-50 max-w-sm rounded-md border border-main bg-main p-4 shadow-lg"
    >
      {estado === 'esperando' && (
        <p className="text-sm text-main">
          Instalando o aplicativo, aguarde a confirmação...
        </p>
      )}
      {estado === 'idle' && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-main">
            Instale o Diário de Classe para abrir direto da tela inicial.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={promptInstall}
            >
              Instalar
            </button>
            <button
              type="button"
              className="btn-outline btn-outline-secondary"
              onClick={dispensarConvite}
              aria-label="Agora não, lembrar depois"
            >
              Agora não
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
