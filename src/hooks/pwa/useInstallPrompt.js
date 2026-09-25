'use client';

import { useEffect, useState } from 'react';
import { isMobileFunction } from '@/utils/isMobileFunction';
import { useToast } from '@/providers/ToastProvider';

/**
 * Chave única de leitura/escrita da dispensa do convite de instalação
 * (COMP-002-003, §6.5 do perfil: ponto único de acesso). Timestamp em ms
 * (`Date.now()`), nunca dado de aluno — não entra na purga de fim de sessão
 * (TASK-002-002, "Riscos específicos").
 */
const CHAVE_DISPENSADO_EM = 'pwa-install-dismissed-at';
const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

// Só dois estados observáveis persistem no banner (`idle`/`esperando`): o
// desfecho de `userChoice` (sucesso ou recusa) é feedback pontual via toast,
// não um estado exibido no card — ele nunca fica preso na tela depois que o
// usuário decide.
export const ESTADO_INSTALL_PROMPT = {
  IDLE: 'idle',
  ESPERANDO: 'esperando',
};

function lerDispensadoEm() {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(CHAVE_DISPENSADO_EM);
  } catch {
    return null;
  }
}

function gravarDispensadoAgora() {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(CHAVE_DISPENSADO_EM, String(Date.now()));
  } catch {
    // storage indisponível (modo privado/quota) — falha silenciosa: não
    // bloqueia a UI, só não lembra a dispensa na próxima sessão.
  }
}

// "Já dispensado" deriva da PRESENÇA do timestamp lido, nunca de comparação
// com um default (lição flag-de-escolha-deriva-da-presenca-nunca-de-
// comparacao-com-default) — a ausência (`null`) é o único caso "nunca
// dispensou"; qualquer timestamp presente é avaliado só pela janela de 30
// dias.
function estaDentroDaJanelaDeDispensa(dispensadoEm) {
  if (!dispensadoEm) {
    return false;
  }
  const timestamp = Number(dispensadoEm);
  if (!Number.isFinite(timestamp)) {
    return false;
  }
  return Date.now() - timestamp < TRINTA_DIAS_MS;
}

/**
 * Hook do convite de instalação (COMP-002-003, FR-001-003/004/005).
 *
 * Estado inicial de contexto e de dispensa nasce sempre de literal
 * (`useState(false)`/`useState(null)`), nunca de inicializador lazy lendo
 * `localStorage`/`matchMedia` — o valor real só é resolvido dentro de um
 * `useEffect` pós-montagem (lição usestate-com-inicializador-lazy-nao-herda-
 * o-valor-do-servidor): servidor e primeira hidratação do cliente produzem o
 * mesmo literal por construção.
 */
export function useInstallPrompt() {
  const { success, info } = useToast();
  const [deferredEvent, setDeferredEvent] = useState(null);
  const [estado, setEstado] = useState(ESTADO_INSTALL_PROMPT.IDLE);
  const [promptEmAndamento, setPromptEmAndamento] = useState(null);
  const [contexto, setContexto] = useState({
    isMobile: false,
    isStandalone: false,
    isDismissed: false,
  });

  useEffect(() => {
    // Resolve o literal de paridade SSR do useState acima; `window` já está
    // garantido aqui por rodar só no cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContexto({
      isMobile: isMobileFunction(window),
      isStandalone:
        window.matchMedia?.('(display-mode: standalone)').matches ?? false,
      isDismissed: estaDentroDaJanelaDeDispensa(lerDispensadoEm()),
    });
  }, []);

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setDeferredEvent(event);
      setEstado(ESTADO_INSTALL_PROMPT.IDLE);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // A resolução de `userChoice` (ação observável assíncrona) vive num
  // `useEffect` guardado por `isCurrent`, nunca dentro do handler de clique
  // direto — per lição useeffect-assincrono-com-acao-observavel-precisa-de-
  // guarda-de-cleanup: se o componente desmontar (ou um novo prompt
  // substituir o anterior) antes da resolução, o `setEstado`/`setDeferredEvent`
  // obsoletos nunca aplicam.
  //
  // O desfecho (sucesso ou recusa) sai por toast, nunca por um estado que
  // fica preso no banner: junto com o toast, o efeito sempre limpa os DOIS —
  // `estado` (volta a `idle`) E `deferredEvent` (volta a `null`) — porque
  // `estaVisivel` depende do evento e um evento resolvido não serve para um
  // novo `prompt()` (a API só permite chamar `prompt()` uma vez por evento).
  useEffect(() => {
    if (!promptEmAndamento) {
      return;
    }

    let isCurrent = true;

    const encerrarComToast = mostrarToast => {
      if (!isCurrent) {
        return;
      }
      mostrarToast();
      setEstado(ESTADO_INSTALL_PROMPT.IDLE);
      setDeferredEvent(atual => (atual === promptEmAndamento ? null : atual));
    };

    // Dois argumentos separados do `.then()` (não `.then(f).catch(c)`): uma
    // exceção dentro do handler de sucesso nunca deve ser capturada pelo
    // handler de erro — eles tratam só o desfecho da promise original.
    promptEmAndamento.userChoice
      .then(
        resultado => {
          encerrarComToast(() =>
            resultado?.outcome === 'accepted'
              ? success(
                  'Aplicativo instalado com sucesso! Abra pelo ícone na tela inicial.'
                )
              : info(
                  'Tudo bem, você pode instalar depois pelo menu do navegador.'
                )
          );
        },
        () => {
          encerrarComToast(() =>
            info('Tudo bem, você pode instalar depois pelo menu do navegador.')
          );
        }
      )
      .finally(() => {
        if (isCurrent) {
          setPromptEmAndamento(null);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [promptEmAndamento, success, info]);

  const promptInstall = () => {
    if (!deferredEvent) {
      return;
    }

    deferredEvent.prompt();
    setEstado(ESTADO_INSTALL_PROMPT.ESPERANDO);
    setPromptEmAndamento(deferredEvent);
  };

  const dispensarConvite = () => {
    gravarDispensadoAgora();
    setContexto(anterior => ({ ...anterior, isDismissed: true }));
  };

  const estaVisivel =
    deferredEvent !== null &&
    contexto.isMobile &&
    !contexto.isStandalone &&
    !contexto.isDismissed;

  return {
    estado,
    estaVisivel,
    promptInstall,
    dispensarConvite,
  };
}
