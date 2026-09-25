'use client';
import {
  Form,
  FormError,
  FormGroup,
  InputField,
  Loading,
  PainelFiltrosColapsavel,
  SelectField,
  TextAreaField,
} from '@/components';
import { RELATORIOS_PANEL_STORAGE_KEY } from '@/constants';
import { useCollapsiblePanelState } from '@/hooks/useCollapsiblePanelState';
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

// COMP-002-007: cada card se identifica no mapa único de persistência
// (`filters_relatorios_panel`, RELATORIOS_PANEL_STORAGE_KEY) por
// `relatorio.endpoint` — único campo estável hoje (`useRelatorioForm.js:37`,
// `submit(relatorio.endpoint, filtros)`). Degradação aceitável se o backend
// deixar de garantir essa estabilidade (TRISK-002-003): o card correspondente
// cai no default aberto, sem afetar os demais.
function CardRelatorio({ relatorio, isSubmitting, submit }) {
  const { filtros, handleChange, handleSubmit } = useRelatorioForm({
    relatorio,
    submit,
  });
  // Guarda de tipo: `itemId` só é aceito se for string não-vazia. Sem a
  // guarda, `undefined` chegaria ao script anti-flash de
  // `PainelFiltrosColapsavel`
  // (`JSON.stringify(undefined).replace(...)` lança `TypeError` durante o
  // render, e a rota não tem `error.jsx`/`ErrorBoundary`). Com
  // `storageKey = null`, o card nasce aberto (TRISK-002-003), mas NÃO fica
  // sem persistência: `isConfigDeMapa(null)` é `false`, então
  // `useCollapsiblePanelState` cai no ramo string e grava sob a chave
  // literal `"null"` (coerção do `localStorage`), compartilhada entre todos
  // os cards inválidos e sobrevivendo ao reload. Dívida declarada, fora do
  // escopo desta TASK — o conserto correto é um sentinela no
  // hook/componente compartilhado que desligue load/save e o script
  // anti-flash.
  const itemIdValido =
    typeof relatorio.endpoint === 'string' && relatorio.endpoint.length > 0;
  const storageKey = itemIdValido
    ? { mapKey: RELATORIOS_PANEL_STORAGE_KEY, itemId: relatorio.endpoint }
    : null;
  // MESMA storageKey passada ao painel (invariante de DEC-002-001 §6): só
  // assim o `isOpen` que o React controla converge com o que o script
  // anti-flash já aplicou ao DOM antes da hidratação.
  const { isOpen, toggle } = useCollapsiblePanelState(storageKey);

  return (
    <div className="bg-main rounded-lg shadow p-6 flex flex-col gap- border border-main">
      <h3 className="text-lg font-semibold text-main mb-1">
        {relatorio.title}
      </h3>
      <p className="text-muted mb-2">{relatorio.description}</p>

      {/* Sem appliedCount: `/relatorios` não tem noção de "filtro aplicado"
          (SPEC §4.2, DEC-002-004/COMP-002-007). */}
      {/* Hierarquia tipográfica: h1 20px/700 > h3 do card 18px/600 > h4
          "Filtros" 16px/600 (canônico de BlockQuoteInfo/index.jsx:4) —
          monotônica; "Filtros" não empata com o h1 da página nem é irmão de
          heading do h3 do card que o contém. */}
      <PainelFiltrosColapsavel
        titulo="Filtros"
        tagTitulo="h4"
        classeTitulo="font-semibold text-main"
        isOpen={isOpen}
        onToggle={toggle}
        storageKey={storageKey}
      >
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
      </PainelFiltrosColapsavel>
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
