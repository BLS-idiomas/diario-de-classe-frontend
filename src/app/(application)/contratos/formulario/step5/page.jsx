'use client';

import { useContratoForm } from '@/providers/ContratoFormProvider';
import { PageSubTitle, InfoCard } from '@/components';

export default function ContratoStep5() {
  const { formData } = useContratoForm();
  const professor = formData.professor || {};
  const aluno = formData.aluno || {};
  const contrato = formData.contrato || {};
  const diasAulas = formData.currentDiasAulas || [];
  const aulas = formData.aulas || [];

  return (
    <div className="flex flex-col gap-6">
      <PageSubTitle>
        Confira os dados cadastrados antes de finalizar ou volte para editar.
      </PageSubTitle>

      {/* Aluno e Professor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <InfoCard
          columns={[
            { text: 'Aluno', type: 'header' },
            { text: `${aluno.nome || '-'} ${aluno.sobrenome || ''}` },
            { text: aluno.email || '-' },
          ]}
          bgColor="white"
        />
        <InfoCard
          columns={[
            { text: 'Professor', type: 'header' },
            { text: `${professor.nome} ${professor.sobrenome}` },
            { text: professor.email },
          ]}
          bgColor="white"
        />
      </div>

      {/* Contrato */}
      <section>
        <PageSubTitle>Informações do Contrato</PageSubTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            columns={[
              { text: 'Status', type: 'header' },
              { text: contrato.status || '-' },
            ]}
          />
          <InfoCard
            columns={[
              { text: 'Data de Início', type: 'header' },
              { text: contrato.dataInicio?.slice(0, 10) || '-' },
            ]}
          />
          <InfoCard
            columns={[
              { text: 'Data de Término', type: 'header' },
              { text: contrato.dataTermino?.slice(0, 10) || '-' },
            ]}
          />
          <InfoCard
            columns={[
              { text: 'Total de Aulas', type: 'header' },
              { text: contrato.totalAulas ?? '-' },
            ]}
          />
        </div>
      </section>

      {/* Dias de Aula */}
      <section>
        <PageSubTitle>Dias de Aula</PageSubTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(!diasAulas || diasAulas.length === 0) && (
            <span>Nenhum dia cadastrado.</span>
          )}
          {diasAulas &&
            diasAulas.map(dia => (
              <InfoCard
                key={dia.diaSemana}
                columns={[
                  { text: dia.diaSemana, type: 'header' },
                  { text: `Ativo: ${dia.ativo ? 'Sim' : 'Não'}` },
                  { text: `Início: ${dia.horaInicial || '-'}` },
                  { text: `Fim: ${dia.horaFinal || '-'}` },
                  { text: `Aulas: ${dia.quantidadeAulas}` },
                ]}
              />
            ))}
        </div>
      </section>

      {/* Aulas */}
      <section>
        <PageSubTitle>Aulas Agendadas</PageSubTitle>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Data</th>
                <th className="p-2 border">Hora Inicial</th>
                <th className="p-2 border">Hora Final</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Observação</th>
              </tr>
            </thead>
            <tbody>
              {(!aulas || aulas.length === 0) && (
                <tr>
                  <td colSpan={6} className="text-center p-2">
                    Nenhuma aula cadastrada.
                  </td>
                </tr>
              )}
              {aulas &&
                aulas.map(aula => (
                  <tr key={aula.id}>
                    <td className="border p-2">
                      {aula.dataAula?.slice(0, 10) || '-'}
                    </td>
                    <td className="border p-2">{aula.horaInicial}</td>
                    <td className="border p-2">{aula.horaFinal}</td>
                    <td className="border p-2">{aula.tipo}</td>
                    <td className="border p-2">{aula.status}</td>
                    <td className="border p-2">{aula.observacao || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
