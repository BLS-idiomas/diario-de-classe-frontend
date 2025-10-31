"use client";

import { useState } from "react";

export default function Home() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Fixo */}
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

      {/* Layout Principal */}
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${
            sidebarExpanded ? "w-[700px]" : "w-20"
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
                    <span className="text-gray-700 font-medium">
                      Disciplinas
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📝</span>
                  </div>
                  {sidebarExpanded && (
                    <span className="text-gray-700 font-medium">
                      Avaliações
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📋</span>
                  </div>
                  {sidebarExpanded && (
                    <span className="text-gray-700 font-medium">
                      Frequência
                    </span>
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

        {/* Conteúdo Principal */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarExpanded ? "ml-[700px]" : "ml-20"
          }`}
        >
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Bem-vindo ao Diário de Classe
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Total de Alunos
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">142</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Turmas Ativas
                  </h3>
                  <p className="text-3xl font-bold text-green-600">8</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Disciplinas
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">12</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Atividades Recentes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-semibold">MG</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Maria Silva adicionou uma nova nota
                      </p>
                      <p className="text-sm text-gray-500">Há 2 horas</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 font-semibold">JS</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        João Santos marcou presença na turma A
                      </p>
                      <p className="text-sm text-gray-500">Há 4 horas</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-purple-600 font-semibold">AP</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Ana Paula criou nova avaliação
                      </p>
                      <p className="text-sm text-gray-500">Ontem</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Todos os direitos reservados a BLS Idiomas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
