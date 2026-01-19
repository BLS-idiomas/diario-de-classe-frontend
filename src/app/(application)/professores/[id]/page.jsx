'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useFormater } from '@/hooks/useFormater';
import { useProfessor } from '@/hooks/professores/useProfessor';
import { useAlunosList } from '@/hooks/alunos/useAlunosList';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { useEditarDisponibilidadeProfessor } from '@/hooks/professores/useEditarDisponibilidadeProfessor';
import {
  PageContent,
  PageTitle,
  PageSubTitle,
  ButtonGroup,
  Loading,
  Section,
  Table,
  HeaderAvatar,
  Badge,
  BadgeGroup,
  InfoCard,
  InfoCardGroup,
  SectionTitle,
  BlockQuoteInfo,
  DisponibilidadeForm,
} from '@/components';

export default function Professor() {
  const params = useParams();
  const { professor, aulas, alunos, isLoading, isNotFound } = useProfessor(
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

  const {
    editMode,
    formData,
    message,
    errors,
    setDisponibilidadesHandle,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    setEditMode,
  } = useEditarDisponibilidadeProfessor(professor);

  useEffect(() => {
    if (
      professor &&
      professor.disponibilidades &&
      professor.disponibilidades.length > 0
    ) {
      setDisponibilidadesHandle(professor.disponibilidades);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professor]);

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (isLoading || !professor) {
    return <Loading />;
  }

  if (editMode) {
    return (
      <>
        <PageContent>
          <PageTitle>Editar Disponibilidade</PageTitle>

          <PageSubTitle>
            Atualize os dados da disponibilidade para dar aula do professor
          </PageSubTitle>
        </PageContent>
        <ButtonGroup>
          <button
            onClick={() => setEditMode(false)}
            className="btn btn-secondary"
          >
            ← Voltar
          </button>
        </ButtonGroup>

        <DisponibilidadeForm
          handleSubmit={handleSubmit}
          message={message}
          errors={errors}
          formData={formData}
          handleCheckboxChange={handleCheckboxChange}
          handleChange={handleChange}
          isLoading={isLoading}
          setEditMode={setEditMode}
        />
      </>
    );
  }

  return (
    <>
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
        <button onClick={() => setEditMode(true)} className="btn btn-primary">
          Editar Disponibilidade
        </button>
      </ButtonGroup>

      <div className="mt-4 space-y-8">
        <Section>
          {/* Header: avatar + name/email */}
          <HeaderAvatar entity={professor} />

          {/* Stats badges */}
          <BadgeGroup>
            <Badge
              icon="calendar"
              color="gray"
              text={`${(professor.disponibilidades || []).filter(d => d.ativo).length} aulas por semana`}
            />

            <Badge icon="lock" color="blue" text={professor.permissao} />
          </BadgeGroup>

          <InfoCardGroup>
            {/* Contato */}
            <InfoCard
              columns={[
                { text: 'Contato', type: 'header' },
                { text: telefoneFormatter(professor.telefone) },
                { text: professor.email },
              ]}
            />

            {/* Acesso */}
            <InfoCard
              columns={[
                { text: 'Acesso', type: 'header' },
                { text: `Permissão: ${professor.permissao}`, type: 'bold' },
                { text: `Id: ${professor.id}` },
              ]}
            />

            {/* Datas */}
            <InfoCard
              columns={[
                { text: 'Datas', type: 'header' },
                { text: `Criado: ${dataFormatter(professor.dataCriacao)}` },
                {
                  text: `Atualizado: ${dataFormatter(professor.dataAtualizacao)}`,
                },
              ]}
            />
          </InfoCardGroup>

          <BlockQuoteInfo
            title="Observações"
            noContent="Nenhuma observação disponível."
          >
            {professor.observacoes}
          </BlockQuoteInfo>
        </Section>

        {/* Disponibilidades */}
        <Section>
          <SectionTitle>Disponibilidades</SectionTitle>
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
          <SectionTitle>Alunos</SectionTitle>
          <Table
            columns={columnsAlunos}
            data={dataAlunos}
            isLoading={isLoading}
            notFoundMessage="Nenhum aluno encontrado."
            className="null"
          />
        </Section>

        {/*Aulas*/}
        <Section>
          <SectionTitle>Aulas</SectionTitle>
          <Table
            columns={columnsAulas}
            data={dataAulas}
            isLoading={isLoading}
            notFoundMessage="Nenhuma aula encontrada."
            className="null"
          />
        </Section>
      </div>
    </>
  );
}
