export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center justify-between h-full px-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Diário de Classe
        </h1>
        <nav className="flex space-x-6">
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Início
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Turmas
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Relatórios
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Configurações
          </a>
        </nav>
      </div>
    </header>
  );
};
