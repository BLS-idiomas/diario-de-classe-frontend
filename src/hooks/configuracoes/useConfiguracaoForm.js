import { useEffect, useMemo, useState } from 'react';
import { validarConfiguracao } from './validarConfiguracao';
import { useConfirmarAlteracaoDuracao } from './useConfirmarAlteracaoDuracao';
import { DIAS_ARRAY } from '@/constants';

const CAMPOS_DIA_COMPARADOS = ['ativo', 'horaInicial', 'horaFinal'];

const ERROS_VALIDACAO_VAZIO = {
  duracaoAula: undefined,
  tolerancia: undefined,
  diasDeFuncionamento: {},
};

function temErroDeValidacao(resultadoValidacao) {
  if (resultadoValidacao.duracaoAula || resultadoValidacao.tolerancia) {
    return true;
  }

  return Object.values(resultadoValidacao.diasDeFuncionamento).some(
    erroDia => erroDia.horaInicial || erroDia.horaFinal
  );
}

/**
 * Move o foco para o primeiro campo inválido, na ordem visual da tela: duração →
 * tolerância → os 7 dias em `DIAS_ARRAY`, horaInicial antes de horaFinal. Num dia
 * inativo o input de hora fica `disabled` (não pode receber foco) — o alvo passa a ser
 * o checkbox `${diaSemana}.ativo`, que é o campo que o usuário precisa acionar primeiro.
 */
function focarPrimeiroCampoInvalido(resultadoValidacao, diasDeFuncionamento) {
  if (resultadoValidacao.duracaoAula) {
    document.getElementById('duracaoAula')?.focus();
    return;
  }

  if (resultadoValidacao.tolerancia) {
    document.getElementById('tolerancia')?.focus();
    return;
  }

  for (const diaSemana of DIAS_ARRAY) {
    const erroDia = resultadoValidacao.diasDeFuncionamento[diaSemana];
    if (!erroDia || (!erroDia.horaInicial && !erroDia.horaFinal)) continue;

    const dia = diasDeFuncionamento.find(d => d.diaSemana === diaSemana);
    if (dia && !dia.ativo) {
      document.getElementById(`${diaSemana}.ativo`)?.focus();
      return;
    }

    const campo = erroDia.horaInicial ? 'horaInicial' : 'horaFinal';
    document.getElementById(`${diaSemana}.${campo}`)?.focus();
    return;
  }
}

/**
 * Normaliza um valor de campo para comparação: o input HTML sempre entrega string
 * (`handleChange`/`handleDiasDeFuncionamentoChange`), mas a API devolve number para
 * `duracaoAula`/`tolerancia` (Prisma Int) e boolean para `ativo`. `String()` iguala os
 * dois lados sem colapsar valores diferentes (ex.: `''` normaliza para `''`, `0` para
 * `'0'` — não viram iguais). Ponto único de normalização para todo campo comparado.
 */
function camposIguais(valorAtual, valorReferencia) {
  return String(valorAtual) === String(valorReferencia);
}

/**
 * Compara os dias de funcionamento por `diaSemana` — nunca por índice. O GET ordena
 * `diasDeFuncionamento` por `diaSemana`, mas o PUT não (COMP-002-004, PLAN-002);
 * comparar por índice casaria dias diferentes entre si quando a ordem muda.
 */
function diasDeFuncionamentoIguais(diasAtual, diasReferencia) {
  if (diasAtual.length !== diasReferencia.length) return false;

  const referenciaPorDia = new Map(
    diasReferencia.map(dia => [dia.diaSemana, dia])
  );

  return diasAtual.every(diaAtual => {
    const diaReferencia = referenciaPorDia.get(diaAtual.diaSemana);
    if (!diaReferencia) return false;
    return CAMPOS_DIA_COMPARADOS.every(campo =>
      camposIguais(diaAtual[campo], diaReferencia[campo])
    );
  });
}

function formDataIgualUltimaLeitura(formData, ultimaLeitura) {
  if (!ultimaLeitura) return true;
  return (
    camposIguais(formData.duracaoAula, ultimaLeitura.duracaoAula) &&
    camposIguais(formData.tolerancia, ultimaLeitura.tolerancia) &&
    diasDeFuncionamentoIguais(
      formData.diasDeFuncionamento,
      ultimaLeitura.diasDeFuncionamento
    )
  );
}

/**
 * Só compara `duracaoAula` (não o formulário inteiro, como `formDataIgualUltimaLeitura`) —
 * decide se `handleSubmit` exibe a confirmação do COMP-002-007. Reaproveita `camposIguais`,
 * o mesmo ponto de normalização number(API)×string(input) do dirty tracking.
 */
function duracaoAulaMudou(formData, ultimaLeitura) {
  if (!ultimaLeitura) return false;
  return !camposIguais(formData.duracaoAula, ultimaLeitura.duracaoAula);
}

export function useConfiguracaoForm({ submit, configuracao = null }) {
  const [formData, setFormData] = useState({
    id: '',
    duracaoAula: '',
    tolerancia: '',
    diasDeFuncionamento: [],
    confirmacao: false,
  });
  const [ultimaLeitura, setUltimaLeitura] = useState(null);
  const [tentouSalvar, setTentouSalvar] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiasDeFuncionamentoChange = e => {
    const { name, value, checked } = e.target;
    const [diaSemana, campo] = name.split('.');
    const diaDeFuncionamento = formData.diasDeFuncionamento.find(
      dia => dia.diaSemana === diaSemana
    );

    if (!diaDeFuncionamento) return;

    setFormData(prev => ({
      ...prev,
      diasDeFuncionamento: prev.diasDeFuncionamento.map(dia =>
        dia.diaSemana === diaSemana
          ? {
              ...diaDeFuncionamento,
              [campo]: campo === 'ativo' ? checked : value,
            }
          : dia
      ),
    }));
  };

  const gravarConfiguracao = () => {
    submit({
      ...formData,
      duracaoAula: Number(formData.duracaoAula),
      tolerancia: Number(formData.tolerancia),
    });
  };

  const { confirmarEGravar } = useConfirmarAlteracaoDuracao({
    duracaoMudou: duracaoAulaMudou(formData, ultimaLeitura),
    onConfirmar: gravarConfiguracao,
  });

  const handleSubmit = async e => {
    e.preventDefault();
    setTentouSalvar(true);
    const resultadoValidacao = validarConfiguracao(formData);

    if (temErroDeValidacao(resultadoValidacao)) {
      focarPrimeiroCampoInvalido(
        resultadoValidacao,
        formData.diasDeFuncionamento
      );
      return;
    }

    await confirmarEGravar();
  };

  const restaurarUltimaLeitura = () => {
    if (!ultimaLeitura) return;
    setFormData({ ...ultimaLeitura, confirmacao: false });
    setTentouSalvar(false);
  };

  useEffect(() => {
    if (configuracao) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ ...configuracao, confirmacao: false });
      setUltimaLeitura(configuracao);
      setTentouSalvar(false);
    }
  }, [configuracao]);

  const isDirty = useMemo(
    () => !formDataIgualUltimaLeitura(formData, ultimaLeitura),
    [formData, ultimaLeitura]
  );

  // Erros derivados do formData atual, não uma foto do momento do submit: editar um
  // campo depois de uma tentativa recusada (ex.: ativar o dia, corrigir a hora) atualiza
  // a mensagem exibida a cada render, sem exigir novo Salvar.
  const errosValidacao = useMemo(
    () =>
      tentouSalvar ? validarConfiguracao(formData) : ERROS_VALIDACAO_VAZIO,
    [tentouSalvar, formData]
  );

  return {
    formData,
    isDirty,
    errosValidacao,
    restaurarUltimaLeitura,
    handleSubmit,
    handleChange,
    handleDiasDeFuncionamentoChange,
    setFormData,
  };
}
