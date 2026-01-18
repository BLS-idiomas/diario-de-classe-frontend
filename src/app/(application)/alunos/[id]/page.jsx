'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useFormater } from '@/hooks/useFormater';
import { useAluno } from '@/hooks/alunos/useAluno';
import {
  PageContent,
  PageTitle,
  PageSubTitle,
  ButtonGroup,
  Loading,
  Section,
} from '@/components';

export default function Aluno() {
  const params = useParams();
  const {
    aluno,
    aulas,
    diasAulas,
    contrato,
    contratos,
    isLoading,
    isNotFound,
  } = useAluno(params.id);
  const { telefoneFormatter, dataFormatter } = useFormater();

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (isLoading || !aluno) {
    return <Loading />;
  }

  // TODO fazer igual a professor

  return (
    <>
      <PageContent>
        <PageTitle>Detalhes do aluno</PageTitle>
        <PageSubTitle>Visualização dos dados do aluno</PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/alunos" className="btn btn-secondary">
          ← Voltar
        </Link>

        <Link href={`/alunos/${params.id}/editar`} className="btn btn-primary">
          Editar
        </Link>
      </ButtonGroup>

      <div className="mt-4 space-y-8">
        <Section>
          <div>
            {/* Header: avatar + name/email */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold">
                {aluno.nome?.charAt(0) || '-'}
                {aluno.sobrenome?.charAt(0) || ''}
              </div>
              <div>
                <div className="text-xl font-semibold">
                  {aluno.nome} {aluno.sobrenome}
                </div>
                <div className="text-sm text-gray-600">{aluno.email}</div>
              </div>
            </div>
            {/* Stats badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                📅 {diasAulas?.length || 0} aulas por semana
              </span>

              <span className="px-2 py-1 bg-blue-100 rounded text-sm">
                🔐{' '}
                {contrato
                  ? `${contrato?.totalAulasFeitas} de ${contrato?.totalAulas}`
                  : 'Sem contrato'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Contato */}
              <div className="p-3 rounded-md bg-gray-50">
                <div className="text-sm text-gray-500">Contato</div>
                <div className="mt-2 text-sm text-gray-700">
                  {telefoneFormatter(aluno?.telefone)}
                </div>
                <div className="mt-1 text-sm text-gray-600">{aluno?.email}</div>
              </div>

              {/* Acesso */}
              <div className="p-3 rounded-md bg-gray-50">
                <div className="text-sm text-gray-500">Contrato</div>
                <div className="mt-2">
                  Situação: {contrato ? contrato?.status : 'Sem contrato'}
                  {contrato && (
                    <div className="text-sm text-gray-600">
                      Vigência: de {dataFormatter(contrato?.dataInicio)} até{' '}
                      {dataFormatter(contrato?.dataTermino)}
                    </div>
                  )}
                </div>
              </div>

              {/* Datas */}
              <div className="p-3 rounded-md bg-gray-50">
                <div className="text-sm text-gray-500">Datas</div>
                <div className="mt-2 text-sm">
                  Criado: {dataFormatter(aluno?.dataCriacao)}
                </div>
                <div className="text-sm">
                  Atualizado: {dataFormatter(aluno?.dataAtualizacao)}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Material</h4>
              {aluno.material ? (
                <blockquote className="border-l-4 pl-3 italic text-gray-700">
                  {aluno.material}
                </blockquote>
              ) : (
                <p className="text-gray-500">Nenhum material disponível.</p>
              )}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
