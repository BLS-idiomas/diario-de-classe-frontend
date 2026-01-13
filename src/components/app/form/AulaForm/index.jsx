import { useMemo } from 'react';
import { STATUS_AULA, STATUS_AULA_LABEL, TIPO_AULA } from '@/constants';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { makeEmailLabel } from '@/utils/makeEmailLabel';
import {
  ButtonsFields,
  Form,
  FormError,
  FormGroup,
  InputField,
  SelectField,
  TextAreaField,
} from '@/components';
import { useFormater } from '@/hooks/useFormater';

export const AulaForm = ({
  handleSubmit,
  message,
  errors,
  handleChange,
  formData,
  isLoading,
  isEdit = false,
}) => {
  const { alunos } = useAlunos();
  const { professores } = useProfessores();
  const { contratos } = useContratos();
  const { dataFormatter } = useFormater();

  const getEntityOptions = entities => {
    return entities.map(entity => ({
      label: makeEmailLabel(entity),
      value: entity.id,
    }));
  };

  const contratoOptions = useMemo(() => {
    if (contratos && contratos.length > 0 && formData.idAluno) {
      return contratos
        .filter(
          contrato =>
            contrato.status !== 'PENDENTE' &&
            contrato.idAluno === formData.idAluno
        )
        .sort((a, b) => {
          if (a.status === 'ATIVO' && b.status !== 'ATIVO') return -1;
          if (a.status !== 'ATIVO' && b.status === 'ATIVO') return 1;
          return 0;
        })
        .map(contrato => ({
          label: `${contrato.status} - de ${dataFormatter(contrato.dataInicio)} até ${dataFormatter(contrato.dataTermino)}`,
          value: contrato.id,
        }));
    }
    return [];
  }, [contratos, dataFormatter, formData.idAluno]);

  return (
    <Form handleSubmit={handleSubmit}>
      <FormError title={message} errors={errors} />

      <div className="grid gap-6">
        <FormGroup>
          <SelectField
            required
            disabled={isEdit}
            htmlFor="idAluno"
            label="Aluno"
            placeholder="Selecione o aluno"
            options={getEntityOptions(alunos)}
            onChange={handleChange}
            value={formData.idAluno}
          />
          <SelectField
            required
            disabled={isEdit}
            htmlFor="idProfessor"
            label="Professor"
            placeholder="Selecione o professor"
            options={getEntityOptions(professores)}
            onChange={handleChange}
            value={formData.idProfessor}
          />
          <SelectField
            required
            htmlFor="idContrato"
            label="Contrato"
            placeholder="Selecione o contrato"
            options={contratoOptions}
            onChange={handleChange}
            value={formData.idContrato}
          />
          <SelectField
            required
            htmlFor="tipo"
            label="Tipo da aula"
            options={['PADRAO', 'REPOSICAO', 'OUTRA'].map(tipo => ({
              label: TIPO_AULA[tipo],
              value: tipo,
            }))}
            onChange={handleChange}
            value={formData.tipo}
          />
        </FormGroup>

        <FormGroup cols={isEdit ? 4 : 3}>
          <InputField
            required
            htmlFor="dataAula"
            type="date"
            label="Data"
            onChange={handleChange}
            value={formData.dataAula}
          />

          <InputField
            required
            htmlFor="horaInicial"
            label="Hora Início"
            type="time"
            onChange={handleChange}
            value={formData.horaInicial}
          />

          <InputField
            required
            htmlFor="horaFinal"
            label="Hora Fim"
            type="time"
            onChange={handleChange}
            value={formData.horaFinal}
          />
          {isEdit && (
            <SelectField
              required
              htmlFor="status"
              label="Status da aula"
              options={STATUS_AULA.map(status => ({
                label: STATUS_AULA_LABEL[status],
                value: status,
              }))}
              onChange={handleChange}
              value={formData.status}
            />
          )}
        </FormGroup>

        <TextAreaField
          htmlFor="observacao"
          label="Observação"
          placeholder="Digite a observação da aula"
          maxLength={2000}
          onChange={handleChange}
          value={formData.observacao}
        />
      </div>

      {/* Botões */}
      <ButtonsFields isLoading={isLoading} href="/aulas" />
    </Form>
  );
};
