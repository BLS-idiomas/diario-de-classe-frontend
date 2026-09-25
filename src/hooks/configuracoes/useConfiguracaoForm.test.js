import { renderHook, act } from '@testing-library/react';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useConfiguracaoForm } from './useConfiguracaoForm';
import { TEXTO_CONFIRMACAO_DURACAO } from './useConfirmarAlteracaoDuracao';

jest.mock('@/hooks/useSweetAlert', () => jest.fn());

// Default: confirma sempre — as suítes que precisam testar cancelamento sobrescrevem
// `showConfirm` no próprio teste (TASK-002-008, COMP-002-007).
beforeEach(() => {
  useSweetAlert.mockReturnValue({
    showConfirm: jest.fn(() => Promise.resolve({ isConfirmed: true })),
  });
});

describe('useConfiguracaoForm', () => {
  const baseConfig = {
    duracaoAula: '50',
    tolerancia: '10',
    diasDeFuncionamento: [
      {
        diaSemana: 'SEG',
        ativo: true,
        horaInicial: '08:00',
        horaFinal: '18:00',
      },
      {
        diaSemana: 'TER',
        ativo: false,
        horaInicial: '08:00',
        horaFinal: '18:00',
      },
    ],
  };

  it('deve inicializar com configuracao passada', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: baseConfig })
    );
    expect(result.current.formData.duracaoAula).toBe('50');
    expect(result.current.formData.diasDeFuncionamento.length).toBe(2);
  });

  it('deve atualizar campo simples com handleChange', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: baseConfig })
    );
    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '60' },
      });
    });
    expect(result.current.formData.duracaoAula).toBe('60');
  });

  it('deve atualizar diasDeFuncionamento corretamente (horaInicial)', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: baseConfig })
    );
    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'SEG.horaInicial', value: '09:00' },
      });
    });
    expect(result.current.formData.diasDeFuncionamento[0].horaInicial).toBe(
      '09:00'
    );
  });

  it('deve atualizar diasDeFuncionamento corretamente (ativo)', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: baseConfig })
    );
    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'TER.ativo', checked: true },
      });
    });
    expect(result.current.formData.diasDeFuncionamento[1].ativo).toBe(true);
  });

  it('deve chamar submit ao submeter', () => {
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: submitMock, configuracao: baseConfig })
    );
    const fakeEvent = { preventDefault: jest.fn() };
    act(() => {
      result.current.handleSubmit(fakeEvent);
    });
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    // duracaoAula/tolerancia convertidos para number no payload (contrato Prisma Int)
    expect(submitMock).toHaveBeenCalledWith({
      ...result.current.formData,
      duracaoAula: 50,
      tolerancia: 10,
    });
  });
});

describe('useConfiguracaoForm - isDirty (rastreamento de alteração pendente)', () => {
  const diasCompletos = [
    {
      id: 'dia-segunda',
      diaSemana: 'SEGUNDA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      id: 'dia-terca',
      diaSemana: 'TERCA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      id: 'dia-quarta',
      diaSemana: 'QUARTA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      id: 'dia-quinta',
      diaSemana: 'QUINTA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      id: 'dia-sexta',
      diaSemana: 'SEXTA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      id: 'dia-sabado',
      diaSemana: 'SABADO',
      ativo: false,
      horaInicial: '',
      horaFinal: '',
    },
    {
      id: 'dia-domingo',
      diaSemana: 'DOMINGO',
      ativo: false,
      horaInicial: '',
      horaFinal: '',
    },
  ];

  // Shape do contrato: duracaoAula/tolerancia number (Prisma Int), como a API devolve —
  // não string, como o input entrega.
  const configInicial = {
    duracaoAula: 50,
    tolerancia: 10,
    diasDeFuncionamento: diasCompletos,
  };

  it('isDirty é false logo após a carga inicial', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configInicial })
    );

    expect(result.current.isDirty).toBe(false);
  });

  it('isDirty vira true após handleChange alterar um campo simples', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configInicial })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '60' },
      });
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('isDirty vira true após alterar um único dia de diasDeFuncionamento', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configInicial })
    );

    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'SEGUNDA.horaInicial', value: '09:00' },
      });
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('isDirty volta a false quando o campo alterado é revertido manualmente ao valor original (A-001-001)', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configInicial })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '15' },
      });
    });
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '10' },
      });
    });
    expect(result.current.isDirty).toBe(false);
  });

  it('isDirty permanece true quando o valor digitado é numericamente diferente da referência (não normaliza demais)', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configInicial })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '11' },
      });
    });

    expect(result.current.isDirty).toBe(true);
  });

  it('isDirty volta a false quando só um diaSemana entre vários é alterado e revertido manualmente (A-001-001)', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configInicial })
    );

    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'QUARTA.ativo', checked: false },
      });
    });
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'QUARTA.ativo', checked: true },
      });
    });
    expect(result.current.isDirty).toBe(false);
  });

  it('restaurarUltimaLeitura() repõe formData para a última leitura e zera isDirty', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configInicial })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '99' },
      });
    });
    expect(result.current.formData.duracaoAula).toBe('99');
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.restaurarUltimaLeitura();
    });

    expect(result.current.formData.duracaoAula).toBe(50);
    expect(result.current.isDirty).toBe(false);
  });

  it('isDirty permanece false quando o formData tem os mesmos 7 dias em ordem diferente da referência (comparação por diaSemana, não por índice)', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configInicial })
    );

    act(() => {
      result.current.setFormData(prev => ({
        ...prev,
        diasDeFuncionamento: [...prev.diasDeFuncionamento].reverse(),
      }));
    });

    expect(result.current.formData.diasDeFuncionamento[0].diaSemana).toBe(
      'DOMINGO'
    );
    expect(result.current.isDirty).toBe(false);
  });

  it('isDirty volta a false após gravação bem-sucedida (rerender com o retorno do PUT com os dias em ordem diferente) e a referência de última leitura passa a ser o novo valor (AC-001-005, parte isDirty)', () => {
    const { result, rerender } = renderHook(
      ({ configuracao }) =>
        useConfiguracaoForm({ submit: jest.fn(), configuracao }),
      { initialProps: { configuracao: configInicial } }
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '20' },
      });
    });
    expect(result.current.isDirty).toBe(true);

    const configuracaoAposPut = {
      ...configInicial,
      tolerancia: 20, // number — a API devolve number (Prisma Int), mesmo valor já digitado
      diasDeFuncionamento: [...diasCompletos].reverse(),
    };

    rerender({ configuracao: configuracaoAposPut });

    expect(result.current.isDirty).toBe(false);
    expect(result.current.formData.tolerancia).toBe(20);

    // a referência de última leitura passou a ser o novo valor: voltar ao valor antigo
    // agora acusa alteração pendente (prova de que a referência foi mesmo atualizada)
    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '10' },
      });
    });
    expect(result.current.isDirty).toBe(true);
  });
});

describe('useConfiguracaoForm — validação client-side no handleSubmit (TASK-002-006)', () => {
  const diasValidos = [
    {
      diaSemana: 'SEGUNDA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      diaSemana: 'TERCA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
  ];

  const configValida = {
    duracaoAula: 50,
    tolerancia: 10,
    diasDeFuncionamento: diasValidos,
  };

  const fakeEvent = () => ({ preventDefault: jest.fn() });

  it('com duracaoAula inválida (vazia) e alterada, handleSubmit não chama submit() e popula errosValidacao.duracaoAula', async () => {
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: submitMock, configuracao: configValida })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '' },
      });
    });

    // duracaoAula mudou (50 -> ''): aguarda o fluxo assíncrono da confirmação do
    // COMP-002-007 (que não deve ser alcançada, porque a validação vem antes) — sem o
    // await, um mutante que removesse a validação só chamaria submit() depois que a
    // asserção já tivesse rodado, e o teste passaria mesmo com o defeito presente.
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(submitMock).not.toHaveBeenCalled();
    expect(result.current.errosValidacao.duracaoAula).toBe('Campo obrigatório');
  });

  it('com um dia com horaFinal <= horaInicial, handleSubmit não chama submit() e popula errosValidacao.diasDeFuncionamento nesse dia', () => {
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: submitMock, configuracao: configValida })
    );

    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'TERCA.horaFinal', value: '07:00' },
      });
    });

    act(() => {
      result.current.handleSubmit(fakeEvent());
    });

    expect(submitMock).not.toHaveBeenCalled();
    expect(
      result.current.errosValidacao.diasDeFuncionamento.TERCA.horaFinal
    ).toBe('A hora final deve ser maior que a hora inicial.');
    // sem indicar outro dia (AC-001-007)
    expect(result.current.errosValidacao.diasDeFuncionamento.SEGUNDA).toEqual({
      horaInicial: undefined,
      horaFinal: undefined,
    });
  });

  it('com todos os dados válidos, handleSubmit chama submit(formData) e não popula erros', () => {
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: submitMock, configuracao: configValida })
    );

    act(() => {
      result.current.handleSubmit(fakeEvent());
    });

    expect(submitMock).toHaveBeenCalledWith(result.current.formData);
    expect(result.current.errosValidacao.duracaoAula).toBeUndefined();
    expect(result.current.errosValidacao.tolerancia).toBeUndefined();
  });

  it('corrigir o erro e submeter de novo limpa errosValidacao e chama submit()', () => {
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: submitMock, configuracao: configValida })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '0' },
      });
    });
    act(() => {
      result.current.handleSubmit(fakeEvent());
    });
    expect(submitMock).not.toHaveBeenCalled();
    expect(result.current.errosValidacao.tolerancia).toBe('Não pode ser zero');

    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '10' },
      });
    });
    act(() => {
      result.current.handleSubmit(fakeEvent());
    });

    expect(submitMock).toHaveBeenCalledTimes(1);
    expect(result.current.errosValidacao.tolerancia).toBeUndefined();
  });

  it('restaurarUltimaLeitura() zera tentouSalvar: sem erro após restaurar, e digitar valor inválido não reaparece antes do próximo Salvar (TASK-002-007)', async () => {
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: submitMock, configuracao: configValida })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '' },
      });
    });
    // duracaoAula mudou (50 -> ''): aguarda o fluxo assíncrono da confirmação do
    // COMP-002-007 (não deve ser alcançada, porque a validação vem antes) — sem o await, um
    // mutante que removesse a validação só chamaria submit() depois da asserção já ter
    // rodado, e o teste passaria mesmo com o defeito presente.
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });
    expect(submitMock).not.toHaveBeenCalled();
    expect(result.current.errosValidacao.duracaoAula).toBe('Campo obrigatório');

    act(() => {
      result.current.restaurarUltimaLeitura();
    });
    expect(result.current.errosValidacao.duracaoAula).toBeUndefined();

    // Prova o reset da flag, não só o valor restaurado: digitar de novo um valor
    // inválido, sem novo Salvar, não deve reacender o erro — se `tentouSalvar`
    // permanecesse `true` (mutante), o erro reapareceria neste passo.
    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '' },
      });
    });
    expect(result.current.errosValidacao.duracaoAula).toBeUndefined();
  });

  it('nova leitura (rerender com outra configuracao) zera tentouSalvar: sem erro após a nova leitura, e digitar valor inválido não reaparece antes do próximo Salvar', async () => {
    const submitMock = jest.fn();
    const { result, rerender } = renderHook(
      ({ configuracao }) =>
        useConfiguracaoForm({ submit: submitMock, configuracao }),
      { initialProps: { configuracao: configValida } }
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '' },
      });
    });
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });
    expect(submitMock).not.toHaveBeenCalled();
    expect(result.current.errosValidacao.duracaoAula).toBe('Campo obrigatório');

    const configuracaoAposNovaLeitura = {
      ...configValida,
      tolerancia: 15,
    };
    rerender({ configuracao: configuracaoAposNovaLeitura });

    expect(result.current.errosValidacao.duracaoAula).toBeUndefined();

    // Prova o reset da flag, não só o valor da nova leitura: digitar de novo um valor
    // inválido, sem novo Salvar, não deve reacender o erro — se `tentouSalvar`
    // permanecesse `true` (mutante), o erro reapareceria neste passo.
    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '' },
      });
    });
    expect(result.current.errosValidacao.duracaoAula).toBeUndefined();
  });

  it.each([
    [
      'só horaInicial inválida',
      { target: { name: 'TERCA.horaInicial', value: '8:00' } },
    ],
    [
      'só horaFinal inválida',
      { target: { name: 'TERCA.horaFinal', value: '25:00' } },
    ],
  ])(
    'com %s em um dia, handleSubmit não chama submit()',
    (_descricao, evento) => {
      const submitMock = jest.fn();
      const { result } = renderHook(() =>
        useConfiguracaoForm({ submit: submitMock, configuracao: configValida })
      );

      act(() => {
        result.current.handleDiasDeFuncionamentoChange(evento);
      });
      act(() => {
        result.current.handleSubmit(fakeEvent());
      });

      expect(submitMock).not.toHaveBeenCalled();
    }
  );

  it('converte duracaoAula/tolerancia para number no payload de submit, mantendo o resto do formData igual', async () => {
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: submitMock, configuracao: configValida })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '55' },
      });
    });
    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '20' },
      });
    });
    // duracaoAula mudou (50 -> 55): passa pela confirmação do COMP-002-007 (beforeEach do
    // topo do arquivo, confirma) antes de gravar — por isso o submit é assíncrono.
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(submitMock).toHaveBeenCalledWith({
      ...result.current.formData,
      duracaoAula: 55,
      tolerancia: 20,
    });
    expect(typeof submitMock.mock.calls[0][0].duracaoAula).toBe('number');
    expect(typeof submitMock.mock.calls[0][0].tolerancia).toBe('number');
  });
});

describe('useConfiguracaoForm — foco no primeiro campo inválido', () => {
  const diasCompletosParaFoco = [
    {
      diaSemana: 'SEGUNDA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      diaSemana: 'TERCA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      diaSemana: 'QUARTA',
      ativo: false,
      horaInicial: '10:00',
      horaFinal: '09:00',
    },
    {
      diaSemana: 'QUINTA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      diaSemana: 'SEXTA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    { diaSemana: 'SABADO', ativo: false, horaInicial: '', horaFinal: '' },
    { diaSemana: 'DOMINGO', ativo: false, horaInicial: '', horaFinal: '' },
  ];

  const configComFoco = {
    duracaoAula: 50,
    tolerancia: 10,
    diasDeFuncionamento: diasCompletosParaFoco,
  };

  const fakeEvent = () => ({ preventDefault: jest.fn() });

  function montarInputsNoDom() {
    document.body.innerHTML = `
      <input id="duracaoAula" />
      <input id="tolerancia" />
      <input id="QUARTA.ativo" type="checkbox" />
      <input id="TERCA.horaInicial" />
      <input id="TERCA.horaFinal" />
    `;
  }

  beforeEach(() => {
    montarInputsNoDom();
  });

  it('duracaoAula inválida move o foco para #duracaoAula', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configComFoco })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '' },
      });
    });
    act(() => {
      result.current.handleSubmit(fakeEvent());
    });

    expect(document.activeElement).toBe(document.getElementById('duracaoAula'));
  });

  it('hora inválida de um dia ativo move o foco para o input de hora desse dia', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configComFoco })
    );

    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'TERCA.horaFinal', value: '07:00' },
      });
    });
    act(() => {
      result.current.handleSubmit(fakeEvent());
    });

    expect(document.activeElement).toBe(
      document.getElementById('TERCA.horaFinal')
    );
  });

  it('hora inválida de um dia inativo move o foco para o checkbox "ativo" desse dia', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configComFoco })
    );

    act(() => {
      result.current.handleSubmit(fakeEvent());
    });

    expect(document.activeElement).toBe(
      document.getElementById('QUARTA.ativo')
    );
  });

  it('erro só na tolerância (duração e dias válidos) move o foco para #tolerancia', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configComFoco })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '0' },
      });
    });
    act(() => {
      result.current.handleSubmit(fakeEvent());
    });

    expect(document.activeElement).toBe(document.getElementById('tolerancia'));
  });

  it('horaInicial e horaFinal inválidas no mesmo dia ativo movem o foco para horaInicial (antes de horaFinal)', () => {
    const { result } = renderHook(() =>
      useConfiguracaoForm({ submit: jest.fn(), configuracao: configComFoco })
    );

    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'TERCA.horaInicial', value: '8:00' },
      });
    });
    act(() => {
      result.current.handleDiasDeFuncionamentoChange({
        target: { name: 'TERCA.horaFinal', value: '25:00' },
      });
    });
    act(() => {
      result.current.handleSubmit(fakeEvent());
    });

    expect(document.activeElement).toBe(
      document.getElementById('TERCA.horaInicial')
    );
  });
});

describe('useConfiguracaoForm — confirmação de alteração de duração (TASK-002-008, COMP-002-007)', () => {
  const diasValidos = [
    {
      diaSemana: 'SEGUNDA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      diaSemana: 'TERCA',
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
  ];

  // Shape do contrato: duracaoAula/tolerancia number, como a leitura da API entrega
  // (Prisma Int) — o input converte para string ao digitar.
  const configuracaoBase = {
    duracaoAula: 50,
    tolerancia: 10,
    diasDeFuncionamento: diasValidos,
  };

  const fakeEvent = () => ({ preventDefault: jest.fn() });

  it('duracaoAula alterado + Salvar: showConfirm é chamado com o texto fixo, e só ele (sem outra chave, ex. html)', async () => {
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: true })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({
        submit: submitMock,
        configuracao: configuracaoBase,
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '60' },
      });
    });
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(showConfirmMock).toHaveBeenCalledWith({
      title: 'Alterar a duração da aula?',
      text: TEXTO_CONFIRMACAO_DURACAO,
      confirmButtonText: 'Salvar',
    });
    expect(showConfirmMock.mock.calls[0][0]).not.toHaveProperty('html');
  });

  it('confirmado: submit() é chamado com o payload já convertido, gravando a alteração', async () => {
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: true })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({
        submit: submitMock,
        configuracao: configuracaoBase,
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '60' },
      });
    });
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(submitMock).toHaveBeenCalledWith({
      ...result.current.formData,
      duracaoAula: 60,
      tolerancia: 10,
    });
  });

  it('cancelado: submit() não é chamado e todos os campos digitados permanecem — inclusive tolerância, que não dependia de confirmação', async () => {
    // Controle positivo: mock que de fato resolve isConfirmed: false — não um mock que
    // nunca resolve, nem um que sempre resolve true (sem esse controle, um bug que
    // sempre grava passaria despercebido).
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: false })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({
        submit: submitMock,
        configuracao: configuracaoBase,
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '60' },
      });
    });
    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '25' },
      });
    });
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(submitMock).not.toHaveBeenCalled();
    expect(result.current.formData.duracaoAula).toBe('60');
    expect(result.current.formData.tolerancia).toBe('25');
  });

  it('duracaoAula não alterado (mesmo com tolerância alterada) + Salvar: grava direto, sem exibir a confirmação', async () => {
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: true })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({
        submit: submitMock,
        configuracao: configuracaoBase,
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'tolerancia', value: '25' },
      });
    });
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(showConfirmMock).not.toHaveBeenCalled();
    expect(submitMock).toHaveBeenCalledWith({
      ...result.current.formData,
      duracaoAula: 50,
      tolerancia: 25,
    });
  });

  it('inválido + duração alterada: handleSubmit não exibe diálogo nem chama submit (validação vem antes da confirmação)', async () => {
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: true })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({
        submit: submitMock,
        configuracao: configuracaoBase,
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '' },
      });
    });
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(showConfirmMock).not.toHaveBeenCalled();
    expect(submitMock).not.toHaveBeenCalled();
  });

  it('leitura 50 (number da API) x input "50" (string, mesmo valor): não mudou — sem diálogo, grava direto (fixture no tipo do contrato; mutante === estrito deixaria este caso vermelho)', async () => {
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: true })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({
        submit: submitMock,
        configuracao: configuracaoBase,
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '50' },
      });
    });
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(showConfirmMock).not.toHaveBeenCalled();
    expect(submitMock).toHaveBeenCalledWith({
      ...result.current.formData,
      duracaoAula: 50,
      tolerancia: 10,
    });
  });

  it('input "60" x leitura 50 (number): mudou — exibe diálogo', async () => {
    const showConfirmMock = jest.fn(() =>
      Promise.resolve({ isConfirmed: true })
    );
    useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
    const submitMock = jest.fn();
    const { result } = renderHook(() =>
      useConfiguracaoForm({
        submit: submitMock,
        configuracao: configuracaoBase,
      })
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'duracaoAula', value: '60' },
      });
    });
    await act(async () => {
      await result.current.handleSubmit(fakeEvent());
    });

    expect(showConfirmMock).toHaveBeenCalledTimes(1);
  });
});
