'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProfessor } from '@/hooks/professores/useProfessor';

export default function Professor() {
  const params = useParams();
  const { professor, message, isLoading, isSuccess, isFailed } = useProfessor(
    params.id
  );

  return (
    <div className="p-10">
      <h1>Detalhes do professor</h1>

      <div>
        <Link
          href="/professores"
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
        >
          Voltar
        </Link>

        <Link
          href={`/professores/${params.id}/editar`}
          className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Editar
        </Link>

        <Link
          href={`/professores/${params.id}/disponibilidade`}
          className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Disponibilidade
        </Link>
        <Link
          href={`/professores/${params.id}/alunos`}
          className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Alunos
        </Link>
        <Link
          href={`/professores/${params.id}/aulas`}
          className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Aulas
        </Link>
      </div>

      {isLoading && <p className="text-blue-600">Carregando...</p>}

      {isFailed && (
        <div
          className={`p-4 rounded-md mb-4 ${
            professor
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {isSuccess && professor && (
        <div className="mt-5">
          <p>Id: {professor.id}</p>
          <p>Nome: {professor.nome}</p>
          <p>Sobrenome: {professor.sobrenome}</p>
          <p>Email: {professor.email}</p>
          <p>Telefone: {professor.telefone}</p>
          <p>Permissão: {professor.permissao}</p>
          <p>Data de criação: {professor.dataCriacao}</p>
          <p>Data de atualização: {professor.dataAtualizacao}</p>

          <div className="mt-4">
            {professor.disponibilidades &&
              professor.disponibilidades.length > 0 &&
              professor.disponibilidades.map(disponibilidade => (
                <div key={disponibilidade.id} className="mb-6">
                  <strong>DIA DA SEMANA:</strong> {disponibilidade.diaSemana}
                  <p>Id: {disponibilidade.id}</p>
                  <p>horaInicial: {disponibilidade.horaInicial}</p>
                  <p>horaFinal: {disponibilidade.horaFinal}</p>
                  <p>ativo: {disponibilidade.ativo}</p>
                  <p>userId: {disponibilidade.userId}</p>
                  <p>dataCriacao: {disponibilidade.dataCriacao}</p>
                  <p>dataAtualizacao: {disponibilidade.dataAtualizacao}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
