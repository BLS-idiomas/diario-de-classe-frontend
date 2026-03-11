'use client';
import {
  Form,
  FormError,
  FormGroup,
  InputField,
  Loading,
  SelectField,
  TextAreaField,
} from '@/components';
import { useRelatorioForm } from '@/hooks/relatorios/useRelatorioForm';
import { useRelatorios } from '@/hooks/relatorios/useRelatorios';
import { useState } from 'react';

function FiltroRelatorio({ filtro, value, handleChange }) {
  const params = {
    ...filtro,
    value: value,
    onChange: handleChange,
  };

  switch (filtro.type) {
    case 'select':
      return <SelectField {...params} />;
    case 'textarea':
      return <TextAreaField {...params} />;
    default:
      return <InputField {...params} />;
  }
}

function CardRelatorio({ relatorio, isSubmitting, submit }) {
  const { filtros, handleChange, handleSubmit } = useRelatorioForm({
    relatorio,
    submit,
  });

  return (
    <div className="bg-main rounded-lg shadow p-6 flex flex-col gap- border border-main">
      <h3 className="text-lg font-semibold text-main mb-1">
        {relatorio.title}
      </h3>
      <p className="text-muted mb-2">{relatorio.description}</p>

      <Form handleSubmit={handleSubmit} col={2} className="grid">
        {/* <FormError title={message} errors={errors} /> */}
        <FormGroup col={2}>
          {relatorio?.filters.map(filtro => (
            <FiltroRelatorio
              key={filtro.htmlFor}
              filtro={filtro}
              value={filtros[filtro.htmlFor]}
              handleChange={handleChange}
            />
          ))}
        </FormGroup>
      </Form>

      <button
        className={`btn btn-primary self-end mt-4  ${isSubmitting ? 'blocked' : ''}`}
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        Gerar
      </button>
    </div>
  );
}

export default function RelatoriosPage() {
  const {
    submit,
    file,
    data,
    status,
    isLoading,
    message,
    errors,
    isSubmitting,
  } = useRelatorios();

  if (data) console.log('data =>', data);
  return (
    <>
      <h1 className="page-title">Relatórios</h1>
      <p className="text-muted mb-8  pr-40 ">
        Gere relatórios personalizados para análise e acompanhamento das
        informações do sistema. Escolha o tipo de relatório, defina os filtros
        desejados e clique em Gerar para exportar os dados.
      </p>

      {!data && <Loading />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map((relatorio, index) => (
          <CardRelatorio
            key={relatorio.title + index}
            relatorio={relatorio}
            isSubmitting={isSubmitting}
            submit={submit}
          />
        ))}
      </div>
    </>
  );
}
