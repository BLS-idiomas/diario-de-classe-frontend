'use client';

import { useEffect, useState } from 'react';
import packageJson from '../../../../package.json';

export const Footer = () => {
  const [anoAtual, setAnoAtual] = useState(null);

  useEffect(() => {
    // Efeito roda uma única vez, na montagem, para preencher `anoAtual` que
    // nasceu nulo por desenho (paridade SSR — ver DEC-002-003/PLAN-002);
    // dependências vazias são intencionais, não esquecidas.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnoAtual(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="bg-secondary border-t border-main py-6"
      data-testid="footer"
    >
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center">
          <p className="text-muted">© {anoAtual} BLS Idiomas.</p>
          <p className="text-sm text-muted">v{packageJson.version}</p>
        </div>
      </div>
    </footer>
  );
};
