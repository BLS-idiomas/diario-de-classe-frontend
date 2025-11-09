'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProfessor } from '@/store/slices/professoresSlice';

export default function Professor() {
  const params = useParams();
  const dispatch = useDispatch();
  const { current, message, loading } = useSelector(state => state.professores);

  useEffect(() => {
    if (params.id) {
      dispatch(getProfessor(params.id));
    }
  }, [dispatch, params.id]);

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
      </div>

      {loading && <p>Carregando...</p>}

      {message && <p>{message}</p>}

      {current && (
        <div>
          <p>Id: {current.id}</p>
          <p>Nome: {current.nome}</p>
          <p>Sobrenome: {current.sobrenome}</p>
          <p>Email: {current.email}</p>
          <p>Telefone: {current.telefone}</p>
          <p>Permissão: {current.permissao}</p>
          <p>Data de criação: {current.dataCriacao}</p>
          <p>Data de atualização: {current.dataAtualizacao}</p>
        </div>
      )}
    </div>
  );
}
