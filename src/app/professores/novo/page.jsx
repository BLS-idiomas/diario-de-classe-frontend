'use client';

import Link from 'next/link';
import { useNovoProfessor } from '@/hooks/professores/useNovoProfessor';

export default function NovoProfessor() {
  const {
    formData,
    message,
    errors,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useNovoProfessor();

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Novo Professor
        </h1>
        <p className="text-gray-600">
          Preencha os dados para criar um novo professor
        </p>
      </div>

      <div className="mb-4">
        <Link
          href="/professores"
          className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Voltar para lista
        </Link>
      </div>

      {errors && errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">{message}:</h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Digite o nome"
            />
          </div>

          {/* Sobrenome */}
          <div>
            <label
              htmlFor="sobrenome"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sobrenome *
            </label>
            <input
              type="text"
              id="sobrenome"
              name="sobrenome"
              value={formData.sobrenome}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Digite o sobrenome"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Digite o email"
            />
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Telefone *
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Senha *
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Digite a senha"
            />
          </div>

          {/* Repetir Senha */}
          <div>
            <label
              htmlFor="repetirSenha"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Repetir Senha *
            </label>
            <input
              type="password"
              id="repetirSenha"
              name="repetirSenha"
              value={formData.repetirSenha}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Confirme a senha"
            />
          </div>
        </div>

        {/* Permissão - campo que ocupa toda a largura */}
        <div className="mt-6">
          <label
            htmlFor="permissao"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Permissão *
          </label>
          <select
            id="permissao"
            name="permissao"
            value={formData.permissao}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Selecione uma permissão</option>
            <option value="professor">Professor</option>
            <option value="coordenador">Coordenador</option>
            <option value="diretor">Diretor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-md text-white font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Criando...' : 'Criar Professor'}
          </button>

          <Link
            href="/professores"
            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-center"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
