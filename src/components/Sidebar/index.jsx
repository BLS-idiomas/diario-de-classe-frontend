export const Sidebar = ({ sidebarExpanded, toggleSidebar }) => {
  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${
        sidebarExpanded ? 'w-[700px]' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Conteúdo da Sidebar */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
              {sidebarExpanded && (
                <span className="text-gray-700 font-medium">Dashboard</span>
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </div>
              {sidebarExpanded && (
                <span className="text-gray-700 font-medium">Alunos</span>
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📚</span>
              </div>
              {sidebarExpanded && (
                <span className="text-gray-700 font-medium">Disciplinas</span>
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📝</span>
              </div>
              {sidebarExpanded && (
                <span className="text-gray-700 font-medium">Avaliações</span>
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📋</span>
              </div>
              {sidebarExpanded && (
                <span className="text-gray-700 font-medium">Frequência</span>
              )}
            </div>
          </nav>
        </div>

        {/* Botão Toggle fixo na parte inferior */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {sidebarExpanded ? (
              <>
                <span className="mr-2">◀</span>
                <span>Recolher</span>
              </>
            ) : (
              <span>▶</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
