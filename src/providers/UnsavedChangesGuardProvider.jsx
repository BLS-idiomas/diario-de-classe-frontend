'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import useSweetAlert from '@/hooks/useSweetAlert';

const UnsavedChangesGuardContext = createContext(null);

// Fora do provider (ou dentro dele, sem tela com alteração pendente), o guard
// nulo garante que `SidebarItem`/`Header` naveguem/deslogem sem nenhuma
// interceptação: `confirmNavigation()` resolve `true` sem diálogo,
// `setGuard`/`clearGuard` não fazem nada e nunca lançam.
const GUARD_NULO = {
  setGuard: () => {},
  clearGuard: () => {},
  confirmNavigation: () => true,
};

export const useUnsavedChangesGuard = () => {
  const context = useContext(UnsavedChangesGuardContext);
  return context || GUARD_NULO;
};

export const UnsavedChangesGuardProvider = ({ children }) => {
  const guardRef = useRef(null);
  const [isDirtyRegistrado, setIsDirtyRegistrado] = useState(false);
  const { showConfirm } = useSweetAlert();

  const setGuard = useCallback(fn => {
    guardRef.current = fn;
    setIsDirtyRegistrado(Boolean(fn?.()));
  }, []);

  const clearGuard = useCallback(() => {
    guardRef.current = null;
    setIsDirtyRegistrado(false);
  }, []);

  // `confirmNavigation()` é deliberadamente polimórfica: devolve o booleano
  // `true` de forma síncrona (nunca uma Promise) quando não há alteração
  // pendente, para que `SidebarItem`/`Header` continuem navegando/deslogando
  // sem aguardar nada. Só quando há alteração pendente ela devolve a Promise
  // do diálogo de confirmação.
  //
  // `liberarSeFalhar` decide o que a Promise resolve quando o diálogo em si
  // falha (rejeita): `false` nega a navegação (padrão, usado pelo menu
  // lateral); `true` libera mesmo assim (usado só pelo logout do Header —
  // sessão encerrada vence rascunho).
  //
  // `title`/`text`/`confirmButtonText` são uma sobreposição opcional: sem
  // elas, o diálogo usa o texto de navegação (menu lateral, logout); quem
  // chama com um efeito diferente (ex.: Cancelar da tela de configuração, que
  // descarta em vez de sair) sobrepõe só o que precisa.
  const confirmNavigation = useCallback(
    ({
      liberarSeFalhar = false,
      title = 'Sair sem salvar?',
      text = 'Há alterações não salvas nesta tela. Se você sair agora, elas serão perdidas.',
      confirmButtonText = 'Sair sem salvar',
    } = {}) => {
      const isDirty = Boolean(guardRef.current?.());
      if (!isDirty) return true;

      return showConfirm({
        title,
        text,
        confirmButtonText,
        cancelButtonText: 'Continuar editando',
      })
        .then(result => Boolean(result.isConfirmed))
        .catch(() => liberarSeFalhar);
    },
    [showConfirm]
  );

  useEffect(() => {
    if (!isDirtyRegistrado) return undefined;

    const handleBeforeUnload = event => {
      event.preventDefault();
      // Legado de navegadores antigos: alguns só exibem o aviso nativo
      // quando `returnValue` é atribuído. Remover quando o piso de suporte
      // for Chrome/Edge >= 119 (versão que passou a dispensar `returnValue`).
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirtyRegistrado]);

  const value = { setGuard, clearGuard, confirmNavigation };

  return (
    <UnsavedChangesGuardContext.Provider value={value}>
      {children}
    </UnsavedChangesGuardContext.Provider>
  );
};
