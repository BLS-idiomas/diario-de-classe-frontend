import { useMemo } from 'react';
import {
  DURACAO_AULA,
  DURACAO_AULA_ARRAY,
  DURACAO_AULA_LABEL,
  STATUS,
  STATUS_AULA,
  STATUS_AULA_LABEL,
  TIPO_AULA,
  TIPO_AULA_LABEL,
} from '@/constants';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import {
  ButtonsFields,
  Form,
  FormError,
  FormGroup,
  InputField,
  SearchableSelectField,
  SelectField,
  TextAreaField,
} from '@/components';
import { useFormater } from '@/hooks/useFormater';
import { getEntityOptions } from '@/utils/getEntityOptions';
import { useUserAuth } from '@/providers/UserAuthProvider';

// Mensagem fixa em pt-BR (nunca o `message` cru do slice) — `status` é
// compartilhado entre ações do slice de Contratos, por isso o erro só é
// afirmado quando a ação em curso é realmente a de listagem consumida aqui
// (mesmo padrão de `aulas/page.jsx`).
const ERRO_CARREGAR_CONTRATOS =
  'Não foi possível carregar os contratos. Tente novamente.';

export const AulaForm = ({
  handleSubmit,
  message,
  errors,
  handleChange,
  formData,
  isLoading,
  isEdit = false,
  fieldErrors = {},
}) => {
  const { alunos } = useAlunos();
  const { professores } = useProfessores();
  const {
    contratos,
    isLoading: isLoadingContratos,
    status: statusContratos,
    action: actionContratos,
  } = useContratos();
  const { dataFormatter } = useFormater();
  const { isAdmin, currentUser } = useUserAuth();
  const professorOptions = isAdmin() ? professores : [currentUser];
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

  // FR-001-010/DEC-002-007: `contratoOptions` já exclui PENDENTE/outro Aluno
  // — resolve o rótulo a partir da lista completa (`contratos`, acima)
  // quando `formData.idContrato` não está mais em `contratoOptions` (ex.:
  // virou PENDENTE, ou pertence a um Aluno diferente após edição), para não
  // descartar o valor em silêncio (TRISK-002-003).
  const contratoSelecionadoLabel = useMemo(() => {
    if (!formData.idContrato) return undefined;
    const jaEstaEmContratoOptions = contratoOptions.some(
      option => String(option.value) === String(formData.idContrato)
    );
    if (jaEstaEmContratoOptions) return undefined;
    const contrato = contratos?.find(
      c => String(c.id) === String(formData.idContrato)
    );
    if (!contrato) return undefined;
    return `${contrato.status} - de ${dataFormatter(contrato.dataInicio)} até ${dataFormatter(contrato.dataTermino)}`;
  }, [contratoOptions, contratos, dataFormatter, formData.idContrato]);

  // FR-001-008, segunda cláusula — decisão de arquitetura: a checagem de
  // pertencimento Contrato→Aluno vive aqui (não em
  // `useAulaForm.handleChange`) porque `contratos` só existe neste
  // componente, via `useContratos()` acima; levar a lista para o hook
  // exigiria um parâmetro novo repassado pelas duas páginas containers e uma
  // segunda instância de `useContratos()` (TRISK-002-004, PLAN-002 §8) —
  // aqui não há chamada extra, só reaproveita a lista já carregada.
  const handleAlunoChange = e => {
    const { value } = e.target;
    const contratoAtual = contratos?.find(
      contrato => String(contrato.id) === String(formData.idContrato)
    );
    if (
      formData.idContrato &&
      contratoAtual &&
      String(contratoAtual.idAluno) !== String(value)
    ) {
      handleChange({ target: { name: 'idContrato', value: '' } });
    }
    handleChange(e);
  };

  // `list` chega `[]` tanto em `pending` quanto em `rejected`
  // (`contratosSlice.js`: `pending` zera `list`; `rejected` não mexe nela, só
  // herda o `[]` que o `pending` já deixou) — sem checar
  // `isLoadingContratos`/`statusContratos`, "Nenhum contrato disponível"
  // seria afirmado também enquanto a lista ainda carrega ou depois de uma
  // falha de rede, quando na verdade não se sabe (ou não se conseguiu saber)
  // se há Contrato elegível.
  const erroCarregarContratos =
    statusContratos === STATUS.FAILED && actionContratos === 'getContratos'
      ? ERRO_CARREGAR_CONTRATOS
      : undefined;
  const contratoErrorMessage = erroCarregarContratos
    ? erroCarregarContratos
    : !isLoadingContratos && formData.idAluno && contratoOptions.length === 0
      ? 'Nenhum contrato disponível para este aluno.'
      : undefined;

  return (
    <Form handleSubmit={handleSubmit} props={{ 'data-testid': 'aula-form' }}>
      <FormError title={message} errors={errors} dataTestId="aula-form-error" />

      <div className="grid gap-6">
        <FormGroup dataTestId="aula-form-group">
          <SearchableSelectField
            required
            htmlFor="idAluno"
            label="Aluno"
            placeholder="Selecione o aluno"
            options={getEntityOptions(alunos)}
            onChange={handleAlunoChange}
            value={formData.idAluno}
            requiredError={fieldErrors.idAluno}
          />
          <SearchableSelectField
            required
            htmlFor="idProfessor"
            label="Professor"
            placeholder="Selecione o professor"
            options={getEntityOptions(professorOptions)}
            onChange={handleChange}
            value={formData.idProfessor}
            requiredError={fieldErrors.idProfessor}
          />
        </FormGroup>

        <FormGroup cols={3} dataTestId="aula-form-group">
          <SearchableSelectField
            required
            htmlFor="idContrato"
            label="Contrato"
            placeholder="Selecione o contrato"
            options={contratoOptions}
            onChange={handleChange}
            value={formData.idContrato}
            requiredError={fieldErrors.idContrato}
            isLoading={isLoadingContratos}
            disabledReason={
              !formData.idAluno ? 'Selecione um Aluno antes' : undefined
            }
            selectedLabel={contratoSelecionadoLabel}
            errorMessage={contratoErrorMessage}
          />
          <SelectField
            required
            htmlFor="tipo"
            label="Tipo da aula"
            options={TIPO_AULA.map(tipo => ({
              label: TIPO_AULA_LABEL[tipo],
              value: tipo,
            }))}
            onChange={handleChange}
            value={formData.tipo}
          />
          <InputField
            required
            htmlFor="dataAula"
            type="date"
            label="Data"
            onChange={handleChange}
            value={formData.dataAula}
          />
        </FormGroup>

        <FormGroup cols={isEdit ? 4 : 3} dataTestId="aula-form-group">
          <InputField
            required
            htmlFor="horaInicial"
            label="Hora Início"
            type="time"
            onChange={handleChange}
            value={formData.horaInicial}
          />

          <SelectField
            required
            htmlFor="duracaoAula"
            label="Duração da Aula"
            options={DURACAO_AULA_ARRAY.map(duracao => ({
              label: DURACAO_AULA_LABEL[duracao],
              value: DURACAO_AULA[duracao],
            }))}
            onChange={handleChange}
            value={formData.duracaoAula}
          />

          <InputField
            required
            disabled
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
          required
          htmlFor="observacao"
          label="Conteúdo/Observação"
          placeholder="Digite o conteúdo da aula"
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
