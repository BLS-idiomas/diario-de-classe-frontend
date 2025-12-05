'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { STATUS_ERROR } from '@/constants/statusError';
import { useFormater } from '@/hooks/useFormater';
import { useProfessor } from '@/hooks/professores/useProfessor';
import {
  Container,
  PageContent,
  PageTitle,
  PageSubTitle,
  ButtonGroup,
  Loading,
  Section,
  Table,
} from '@/components';
import { useAlunosList } from '@/hooks/alunos/useAlunosList';
import { useAulasList } from '@/hooks/aulas/useAulasList';

export default function Professor() {
  const params = useParams();
  const { professor, aulas, alunos, isLoading, statusError } = useProfessor(
    params.id
  );
  const { telefoneFormatter, dataFormatter } = useFormater();

  const { columns: columnsAlunos, data: dataAlunos } = useAlunosList({
    alunos,
    telefoneFormatter,
    dataFormatter,
    readOnly: true,
  });

  const { columns: columnsAulas, data: dataAulas } = useAulasList({
    aulas,
    telefoneFormatter,
    dataFormatter,
  });

  useEffect(() => {
    if (aulas) console.log('aulas', aulas);
  }, [aulas]);

  useEffect(() => {
    if (
      statusError === STATUS_ERROR.BAD_REQUEST ||
      statusError === STATUS_ERROR.NOT_FOUND
    ) {
      return notFound();
    }
  }, [statusError]);

  if (isLoading || !professor) {
    return <Loading />;
  }

  return (
    <Container>
      <PageContent>
        <PageTitle>Detalhes do professor</PageTitle>
        <PageSubTitle>Visualização dos dados do professor</PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/professores" className="btn btn-secondary">
          ← Voltar
        </Link>

        <Link
          href={`/professores/${params.id}/editar`}
          className="btn btn-primary"
        >
          Editar
        </Link>
      </ButtonGroup>

      <div className="mt-4 space-y-8">
        <Section>
          <div>
            {/* Header: avatar + name/email */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold">
                {professor.nome?.charAt(0) || '-'}
                {professor.sobrenome?.charAt(0) || ''}
              </div>
              <div>
                <div className="text-xl font-semibold">
                  {professor.nome} {professor.sobrenome}
                </div>
                <div className="text-sm text-gray-600">{professor.email}</div>
              </div>
            </div>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                📅{' '}
                {(professor.disponibilidades || []).filter(d => d.ativo).length}{' '}
                aulas por semana
              </span>

              <span className="px-2 py-1 bg-blue-100 rounded text-sm">
                🔐 {professor.permissao}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Contato */}
              <div className="p-3 rounded-md bg-gray-50">
                <div className="text-sm text-gray-500">Contato</div>
                <div className="mt-2 text-sm text-gray-700">
                  {telefoneFormatter(professor.telefone)}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {professor.email}
                </div>
              </div>

              {/* Acesso */}
              <div className="p-3 rounded-md bg-gray-50">
                <div className="text-sm text-gray-500">Acesso</div>
                <div className="font-medium mt-2">
                  Permissão: {professor.permissao}
                </div>
                <div className="text-sm text-gray-600">Id: {professor.id}</div>
              </div>

              {/* Datas */}
              <div className="p-3 rounded-md bg-gray-50">
                <div className="text-sm text-gray-500">Datas</div>
                <div className="mt-2 text-sm">
                  Criado: {dataFormatter(professor.dataCriacao)}
                </div>
                <div className="text-sm">
                  Atualizado: {dataFormatter(professor.dataAtualizacao)}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Observações</h4>
              {professor.observacoes ? (
                <blockquote className="border-l-4 pl-3 italic text-gray-700">
                  {professor.observacoes}
                </blockquote>
              ) : (
                <p className="text-gray-500">Nenhuma observação disponível.</p>
              )}
            </div>
          </div>
        </Section>

        {/* Disponibilidades */}
        <Section>
          <h3 className="text-lg font-semibold mb-3">Disponibilidades</h3>
          {professor.disponibilidades &&
          professor.disponibilidades.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {professor.disponibilidades.map(d => (
                <div key={d.id} className="p-3 rounded-md bg-white shadow-sm">
                  <div className="font-medium">{d.diaSemana}</div>
                  <div className="text-sm text-gray-600">
                    {d.horaInicial} - {d.horaFinal}
                  </div>
                  <div
                    className={`mt-2 inline-block px-2 py-0.5 text-xs rounded-full ${d.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {d.ativo ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Sem disponibilidades cadastradas.</p>
          )}
        </Section>

        {/*Alunos*/}
        <Section>
          <h3 className="text-lg font-semibold mb-3">Alunos</h3>
          <Table
            columns={columnsAlunos}
            data={dataAlunos}
            isLoading={isLoading}
            notFoundMessage="Nenhum aluno encontrado."
          />
        </Section>

        {/*Aulas*/}
        <Section>
          <h3 className="text-lg font-semibold mb-3">Aulas</h3>
          <Table
            columns={columnsAulas}
            data={dataAulas}
            isLoading={isLoading}
            notFoundMessage="Nenhuma aula encontrada."
          />
        </Section>
      </div>
    </Container>
  );
}
