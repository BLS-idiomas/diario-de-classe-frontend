'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getProfessor, updateProfessor } from '@/store/slices/professoresSlice';

export default function EditarProfessor() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const { loading, message, errors, current } = useSelector(
    state => state.professores
  );

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    permissao: 'professor',
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar dados do professor quando o componente montar
  useEffect(() => {
    if (params.id) {
      dispatch(getProfessor(params.id));
    }
  }, [dispatch, params.id]);

  // Inicializar o formulário quando os dados chegarem (apenas uma vez)
  if (current && !isInitialized) {
    setFormData({
      nome: current.nome || '',
      sobrenome: current.sobrenome || '',
      email: current.email || '',
      telefone: current.telefone || '',
      permissao: current.permissao || 'professor',
    });
    setIsInitialized(true);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const result = await dispatch(
        updateProfessor({
          id: params.id,
          data: formData,
        })
      );

      if (updateProfessor.fulfilled.match(result)) {
        // Sucesso - redirecionar para detalhes do professor
        router.push(`/professores/${params.id}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar professor:', error);
    }
  };

  if (!current && !isInitialized) {
    return (
      <div className="p-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-center">
          <p className="text-blue-600">Carregando dados do professor...</p>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="p-10 max-w-2xl mx-auto">
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          <p>Professor não encontrado.</p>
          <Link
            href="/professores"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            ← Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Editar Professor
        </h1>
        <p className="text-gray-600">
          Atualize os dados do professor{' '}
          <span className="font-medium">
            {current.nome} {current.sobrenome}
          </span>
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <Link
          href={`/professores/${params.id}`}
          className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Voltar para detalhes
        </Link>
        <Link
          href="/professores"
          className="px-4 py-2 text-sm bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
        >
          Lista de professores
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

      {message && !errors?.length && (
        <div
          className={`p-4 rounded-md mb-6 ${
            message.includes('sucesso')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o sobrenome"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o email"
              required
            />
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Telefone
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione uma permissão</option>
            <option value="professor">Professor</option>
            <option value="coordenador">Coordenador</option>
            <option value="diretor">Diretor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Informações adicionais - somente leitura */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">ID:</span> {current.id}
            </div>
            <div>
              <span className="font-medium">Data de criação:</span>{' '}
              {current.dataCriacao || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Última atualização:</span>{' '}
              {current.dataAtualizacao || 'N/A'}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-md text-white font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>

          <Link
            href={`/professores/${params.id}`}
            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-center inline-block"
          >
            Cancelar
          </Link>

          <Link
            href="/professores"
            className="px-6 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors text-center inline-block"
          >
            Voltar à Lista
          </Link>
        </div>
      </form>
    </div>
  );
}
