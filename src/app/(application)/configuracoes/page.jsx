'use client';

import { notFound } from 'next/navigation';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useConfiguracao } from '@/hooks/configuracoes/useConfiguracao';
import { useConfiguracaoForm } from '@/hooks/configuracoes/useConfiguracaoForm';
import {
  ButtonsFields,
  CheckboxField,
  Form,
  FormError,
  FormGroup,
  InputField,
  Loading,
  PageTitle,
} from '@/components';
import { DIAS_LABEL } from '@/constants';

export default function Configuracao() {
  const { currentUser, isAdmin } = useUserAuth();
  const { submit, configuracao, isLoading, isSubmitting, message, errors } =
    useConfiguracao();
  const {
    formData,
    handleChange,
    handleSubmit,
    handleDiasDeFuncionamentoChange,
  } = useConfiguracaoForm({
    submit,
    configuracao,
  });

  if (currentUser && !isAdmin()) {
    return notFound();
  }

  if (isLoading && !configuracao) {
    return <Loading />;
  }

  return (
    <>
      <PageTitle>Configurações do sistema</PageTitle>

      <Form handleSubmit={handleSubmit}>
        <FormError title={message} errors={errors} />

        <FormGroup>
          {/* Duração da Aula */}
          <InputField
            required
            htmlFor="duracaoAula"
            label="Duração da Aula"
            placeholder="Digite a duração da aula em minutos"
            type="number"
            onChange={handleChange}
            value={formData.duracaoAula}
          />
          {/* Tolerância de atraso (minutos) */}
          <InputField
            required
            htmlFor="tolerancia"
            label="Tolerância de Atraso"
            placeholder="Digite a tolerância de atraso em minutos"
            type="number"
            onChange={handleChange}
            value={formData.tolerancia}
          />

          {formData &&
            formData.diasDeFuncionamento.map((funcionamento, index) => (
              <div key={funcionamento.diaSemana} className="mb-4">
                <div className="flex gap-5">
                  <h4 className="text-xl font-semibold mb-2">
                    {DIAS_LABEL[funcionamento.diaSemana]}
                  </h4>
                  <CheckboxField
                    htmlFor={`${funcionamento.diaSemana}.ativo`}
                    label="Ativo"
                    checked={
                      formData.diasDeFuncionamento[index]?.ativo || false
                    }
                    onChange={handleDiasDeFuncionamentoChange}
                  />
                </div>
                <FormGroup cols={1}>
                  <InputField
                    disabled={!formData.diasDeFuncionamento[index]?.ativo}
                    htmlFor={`${funcionamento.diaSemana}.horaInicial`}
                    label="Hora inicial"
                    type="time"
                    onChange={handleDiasDeFuncionamentoChange}
                    value={formData.diasDeFuncionamento[index]?.horaInicial}
                  />

                  <InputField
                    disabled={!formData.diasDeFuncionamento[index]?.ativo}
                    htmlFor={`${funcionamento.diaSemana}.horaFinal`}
                    label="Hora final"
                    type="time"
                    onChange={handleDiasDeFuncionamentoChange}
                    value={formData.diasDeFuncionamento[index]?.horaFinal}
                  />
                </FormGroup>
              </div>
            ))}
        </FormGroup>

        <ButtonsFields isLoading={isSubmitting} href="/configuracoes" />
      </Form>
    </>
  );
}
