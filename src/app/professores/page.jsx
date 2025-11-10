'use client';

import Link from 'next/link';
import { useProfessores } from '@/hooks/professores/useProfessores';

export default function Professores() {
  const { professores, isLoading, isSuccess, isEmpty, handleDeleteProfessor } =
    useProfessores();

  return (
    <div className="p-5">
      <h1>Lista de professores</h1>

      <div>
        <Link
          href="/professores/novo"
          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer"
        >
          Novo Professor
        </Link>
      </div>

      <table className="table-auto">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Permissão</th>
            <th>Data de criação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {isLoading && <p>Carregando...</p>}

          {isEmpty && (
            <tr>
              <td colSpan="8">Nenhum professor encontrado.</td>
            </tr>
          )}

          {isSuccess &&
            professores.map(professor => (
              <tr key={professor.id}>
                <td>{professor.id}</td>
                <td>{professor.nome}</td>
                <td>{professor.sobrenome}</td>
                <td>{professor.email}</td>
                <td>{professor.telefone || '-'}</td>
                <td>{professor.permissao}</td>
                <td>{professor.dataCriacao}</td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/professores/${professor.id}`}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/professores/${professor.id}/editar`}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteProfessor(professor.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      Apagar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
