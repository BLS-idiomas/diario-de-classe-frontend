'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useUnsavedChangesGuard } from '@/providers/UnsavedChangesGuardProvider';
import { useConfiguracao } from '@/hooks/configuracoes/useConfiguracao';
import { useConfiguracaoForm } from '@/hooks/configuracoes/useConfiguracaoForm';
import { mapearErroServidorPorCampo } from '@/hooks/configuracoes/validarConfiguracao';
import {
  ButtonsFields,
  CheckboxField,
  Form,
  FormError,
  FormGroup,
  InputField,
  Loading,
  PageTitle,
  Section,
  SectionTitle,
} from '@/components';
import { DIAS_ARRAY, DIAS_LABEL, STATUS } from '@/constants';

const HINT_DURACAO_AULA =
  'Usada apenas para sugerir a hora final de um dia de aula no formulário de contrato quando a quantidade de aulas daquele dia é alterada. Não muda a duração de aulas, dias de aula nem contratos. O novo valor só vale para quem entrar no sistema depois da mudança.';
const HINT_TOLERANCIA =
  'O valor é armazenado, mas ainda não é aplicado automaticamente pelo sistema.';
const HINT_HORARIO_FUNCIONAMENTO =
  'O valor é registrado, mas ainda não restringe o lançamento de aulas.';
const MENSAGEM_FALHA_NAO_VALIDACAO =
  'A gravação pode ter sido aplicada parcialmente. Recarregue a tela e confira os valores em vigor antes de tentar novamente.';

export default function Configuracao() {
  const { currentUser, isAdmin } = useUserAuth();
  const {
    submit,
    configuracao,
    isLoading,
    isSubmitting,
    message,
    errors,
    action,
    status,
    statusError,
  } = useConfiguracao();
  const {
    formData,
    isDirty,
    errosValidacao,
    handleChange,
    handleSubmit,
    handleDiasDeFuncionamentoChange,
    restaurarUltimaLeitura,
  } = useConfiguracaoForm({
    submit,
    configuracao,
  });
  const { setGuard, clearGuard, confirmNavigation } = useUnsavedChangesGuard();
  const errosServidorPorCampo = mapearErroServidorPorCampo(errors);

  // Falha não-validação: a gravação (PUT) chegou a FAILED sem erro de validação por campo
  // (ex.: 500/rede, com ou sem status HTTP) — soma a orientação de recarregar
  // (RISK-001-003, gravação não atômica). A falha de validação (`errors` com item
  // mapeável) já é suficiente por campo, sem essa frase somada por cima (FR-001-020). 401
  // fica só com o logout forçado do layout (`useApplicationLayout`) — a tela não soma a
  // orientação de gravação parcial. `status === STATUS.FAILED` evita acusar falha fora do
  // ramo de erro (ex.: action/errors residuais de um render anterior).
  const falhaNaoValidacao =
    status === STATUS.FAILED &&
    action === 'updateConfiguracao' &&
    Number(statusError) !== 401 &&
    (errors || []).length === 0;
  const mensagensErro = falhaNaoValidacao
    ? [...(errors || []), MENSAGEM_FALHA_NAO_VALIDACAO]
    : errors;

  const handleCancelar = () => {
    const resultado = confirmNavigation({
      title: 'Descartar alterações?',
      text: 'Há alterações não salvas nesta tela. Se você cancelar, elas serão descartadas.',
      confirmButtonText: 'Descartar alterações',
    });
    if (resultado === true) {
      restaurarUltimaLeitura();
      return;
    }
    resultado.then(confirmado => {
      if (confirmado) restaurarUltimaLeitura();
    });
  };

  useEffect(() => {
    setGuard(() => isDirty);
    return () => clearGuard();
  }, [isDirty, setGuard, clearGuard]);

  if (currentUser && !isAdmin()) {
    return notFound();
  }

  if (isLoading && !configuracao) {
    return <Loading />;
  }

  // Ordem estável dos 7 dias por diaSemana (SEGUNDA → DOMINGO, DIAS_ARRAY): o
  // GET ordena diasDeFuncionamento por diaSemana, mas o PUT não — exibir na
  // ordem do array recebido reintroduziria a ordem instável após salvar.
  const diasDeFuncionamentoOrdenados = DIAS_ARRAY.map(diaSemana =>
    formData.diasDeFuncionamento.find(dia => dia.diaSemana === diaSemana)
  ).filter(Boolean);

  return (
    <>
      <PageTitle>Configurações do sistema</PageTitle>

      <Form handleSubmit={handleSubmit}>
        <FormError title={message} errors={mensagensErro} />

        <div className="space-y-6">
          <Section>
            <SectionTitle>Aulas</SectionTitle>
            <FormGroup>
              <InputField
                required
                htmlFor="duracaoAula"
                label="Duração da Aula (minutos)"
                placeholder="Digite a duração da aula em minutos"
                type="number"
                onChange={handleChange}
                value={formData.duracaoAula}
                hint={HINT_DURACAO_AULA}
                error={
                  errosValidacao.duracaoAula ||
                  errosServidorPorCampo.duracaoAula
                }
              />
              <InputField
                required
                htmlFor="tolerancia"
                label="Tolerância de Atraso (minutos)"
                placeholder="Digite a tolerância de atraso em minutos"
                type="number"
                onChange={handleChange}
                value={formData.tolerancia}
                hint={HINT_TOLERANCIA}
                error={
                  errosValidacao.tolerancia || errosServidorPorCampo.tolerancia
                }
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Horário de funcionamento</SectionTitle>
            <p className="text-sm text-muted mb-4">
              {HINT_HORARIO_FUNCIONAMENTO}
            </p>
            <FormGroup>
              {diasDeFuncionamentoOrdenados.map(funcionamento => {
                const errosDia =
                  errosValidacao.diasDeFuncionamento?.[
                    funcionamento.diaSemana
                  ] || {};

                return (
                  <div key={funcionamento.diaSemana} className="mb-4">
                    <div className="flex gap-5">
                      <h4 className="text-base font-semibold text-main mb-2">
                        {DIAS_LABEL[funcionamento.diaSemana]}
                      </h4>
                      <CheckboxField
                        htmlFor={`${funcionamento.diaSemana}.ativo`}
                        label="Ativo"
                        checked={funcionamento.ativo || false}
                        onChange={handleDiasDeFuncionamentoChange}
                      />
                    </div>
                    <FormGroup cols={1}>
                      <InputField
                        disabled={!funcionamento.ativo}
                        htmlFor={`${funcionamento.diaSemana}.horaInicial`}
                        label="Hora inicial"
                        type="time"
                        onChange={handleDiasDeFuncionamentoChange}
                        value={funcionamento.horaInicial}
                        error={errosDia.horaInicial}
                      />

                      <InputField
                        disabled={!funcionamento.ativo}
                        htmlFor={`${funcionamento.diaSemana}.horaFinal`}
                        label="Hora final"
                        type="time"
                        onChange={handleDiasDeFuncionamentoChange}
                        value={funcionamento.horaFinal}
                        error={errosDia.horaFinal}
                      />
                    </FormGroup>
                  </div>
                );
              })}
            </FormGroup>
          </Section>
        </div>

        <ButtonsFields
          isLoading={isSubmitting}
          href="/configuracoes"
          onCancel={handleCancelar}
          savingLabel="Salvando..."
        />
      </Form>
    </>
  );
}
