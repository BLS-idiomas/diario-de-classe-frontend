'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Wand2 } from 'lucide-react';
import { TIPO_AULA_LABEL, DIAS_LABEL } from '@/constants';
import {
  Form,
  FormError,
  FormGroup,
  SelectField,
  InputField,
  CheckboxField,
  Badge,
  Loading,
  ButtonsFields,
} from '@/components';

export const ContratoForm = ({
  alunoOptions,
  professorOptions,
  formData,
  isLoading,
  isSubmitting,
  errors,
  message,
  handleSubmit,
  handleChange,
  handleAlunoChange,
  handleProfessorChange,
  handleAtivoChange,
  handleHoraInicialChange,
  handleQuantidadeAulasChange,
  handleDeleteAula,
  handleEditAula,
  handleGenerateAulasByContrato,
  createAula,
  dataFormatter,
}) => {
  // TODO não mostrar alunos com contratos ativos
  // TODO Melhorar os campos desabilitados das aulas da semana
  // TODO refazer a forma que HORA FINAL das aulas da semana
  // TODO calcular hora final igual aos outros no modaç
  // TODO Quando adicionar uma aula precisa reordenar as aulas por data
  const [showSubmit, setShowSubmit] = useState(false);
  const [showDiasAulas, setShowDiasAulas] = useState(false);
  const [showAulas, setShowAulas] = useState(false);

  useEffect(() => {
    const { professor, aluno, dataInicio, dataTermino, diasAulas, aulas } =
      formData;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowDiasAulas(aluno && professor && dataInicio && dataTermino);
    setShowAulas(diasAulas.some(dia => dia.ativo));
    setShowSubmit(showDiasAulas && showAulas && aulas.length > 0);
  }, [formData]);

  return (
    <Form handleSubmit={handleSubmit}>
      <FormError title={message} errors={errors} />

      <div className="grid gap-6">
        <FormGroup col={2}>
          {/* STEP 1 - SELECIONE O ALUNO E PROFESSOR */}
          <SelectField
            required
            htmlFor="alunoId"
            label="Aluno"
            placeholder="Selecione o aluno"
            onChange={handleAlunoChange}
            value={formData.alunoId}
            options={alunoOptions}
          />
          <SelectField
            required
            htmlFor="professorId"
            label="Professor"
            placeholder="Selecione o professor"
            onChange={handleProfessorChange}
            value={formData.professorId}
            options={professorOptions}
          />
          {/* STEP 3 - DATA DE INÍCIO E TÉRMINO DO CONTRATO */}
          <InputField
            required
            htmlFor="dataInicio"
            label="Data de inicio do contrato"
            type="date"
            onChange={handleChange}
            value={formData.dataInicio}
          />
          <InputField
            required
            htmlFor="dataTermino"
            label="Data de término do contrato"
            type="date"
            onChange={handleChange}
            value={formData.dataTermino}
          />
        </FormGroup>
      </div>

      {/* STEP 2 - DIAS DE AULA */}
      <div className="flex flex-col gap-4" hidden={!showDiasAulas}>
        <p>Registre as aulas que o aluno terá em cada dia da semana.</p>

        <FormGroup cols={2}>
          {formData.diasAulas.map(dia => (
            <div key={dia.diaSemana} className="flex flex-col gap-2 mb-4">
              <h4 className="text-xl font-semibold mb-2">
                {DIAS_LABEL[dia.diaSemana]}
              </h4>
              <CheckboxField
                htmlFor={dia.diaSemana}
                label="Ativo"
                checked={dia.ativo || false}
                onChange={handleAtivoChange}
              />
              <SelectField
                disabled={!dia.ativo}
                htmlFor={dia.diaSemana}
                label="Quantidade de aulas"
                onChange={handleQuantidadeAulasChange}
                options={[
                  { label: '1 (40 min)', value: 1 },
                  { label: '2 (80 min)', value: 2 },
                  { label: '3 (120 min)', value: 3 },
                ]}
                value={dia.quantidadeAulas}
              />

              <InputField
                disabled={!dia.ativo}
                htmlFor={dia.diaSemana}
                label="Hora inicial"
                type="time"
                onChange={handleHoraInicialChange}
                value={dia.horaInicial}
              />

              <InputField
                disabled
                htmlFor={dia.diaSemana}
                label="Hora final"
                type="time"
                value={dia.horaFinal}
              />
            </div>
          ))}
        </FormGroup>
      </div>

      {/* STEP 3 - AULAS */}
      <div className="flex flex-col gap-4" hidden={!showAulas}>
        <p>Total de {formData.aulas.length} aulas.</p>
        <div className="flex gap-4">
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={createAula}
          >
            <Plus strokeWidth={2} size={20} />
            Nova Aula
          </button>

          <button
            type="button"
            className="btn btn-secondary flex items-center gap-2"
            onClick={handleGenerateAulasByContrato}
          >
            <Wand2 strokeWidth={2} size={20} />
            Gerar Aulas
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,500px))] gap-4">
          {isSubmitting ? (
            <Loading />
          ) : (
            formData?.aulas?.map(aula => (
              <div
                key={aula.id}
                className="border border-gray-300 rounded-md p-4"
              >
                <div className="flex flex-row  items-start gap-2 justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {(() => {
                        const date = new Date(aula.dataAula);
                        const dias = [
                          'DOMINGO',
                          'SEGUNDA',
                          'TERCA',
                          'QUARTA',
                          'QUINTA',
                          'SEXTA',
                          'SABADO',
                        ];
                        return DIAS_LABEL[dias[date.getDay()]];
                      })()}
                    </p>
                    <p>
                      <strong>Aula:</strong> {dataFormatter(aula.dataAula)}{' '}
                      {aula.horaInicial} - {aula.horaFinal}
                    </p>

                    {aula.tipo && aula.tipo !== 'PADRAO' && (
                      <Badge
                        icon="calendar"
                        color="alert"
                        text={TIPO_AULA_LABEL[aula.tipo]}
                      />
                    )}
                    {aula.observacao && (
                      <p>
                        <strong>Observação:</strong> {aula.observacao}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-outline btn-outline-secondary"
                      onClick={() => handleEditAula(aula)}
                    >
                      <Pencil strokeWidth={1} size={16} stroke="gray" />
                    </button>

                    <button
                      className="btn-outline btn-outline-danger"
                      onClick={() => handleDeleteAula(aula.id)}
                    >
                      <Trash2 strokeWidth={1} size={16} stroke="red" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ButtonsFields
        isLoading={isLoading}
        href="/contratos"
        blocked={!showSubmit}
      />
    </Form>
  );
};
