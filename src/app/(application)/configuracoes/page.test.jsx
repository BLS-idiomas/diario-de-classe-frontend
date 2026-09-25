import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import Configuracao from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import {
  useUnsavedChangesGuard,
  UnsavedChangesGuardProvider,
} from '@/providers/UnsavedChangesGuardProvider';
import { useConfiguracao } from '@/hooks/configuracoes/useConfiguracao';
import { useConfiguracaoForm } from '@/hooks/configuracoes/useConfiguracaoForm';
import useSweetAlert from '@/hooks/useSweetAlert';
import { STATUS } from '@/constants';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));
jest.mock('@/providers/UserAuthProvider');
// `UnsavedChangesGuardProvider` (componente) fica real: o teste do padrão
// "nega se o diálogo falhar" precisa do merge/`liberarSeFalhar`
// reais, não de um duplo (mock) do próprio provider. `useUnsavedChangesGuard`
// continua um jest.fn — provider real mantido para o teste do padrão "nega",
// que reinstala o hook real via mockImplementation.
jest.mock('@/providers/UnsavedChangesGuardProvider', () => {
  const real = jest.requireActual('@/providers/UnsavedChangesGuardProvider');
  return {
    ...real,
    useUnsavedChangesGuard: jest.fn(real.useUnsavedChangesGuard),
  };
});
jest.mock('@/hooks/useSweetAlert', () => jest.fn());
jest.mock('@/hooks/configuracoes/useConfiguracao');
// O mock envolve a implementação real, e quem depende dela a reaplica.
// Testes que precisam da lógica real (validação/foco/derivação de erro do formData
// atual) não chamam `mockReturnValue` e usam a implementação real por baixo; os demais
// continuam sobrescrevendo com `mockReturnValue` como antes.
jest.mock('@/hooks/configuracoes/useConfiguracaoForm', () => {
  const real = jest.requireActual('@/hooks/configuracoes/useConfiguracaoForm');
  return {
    useConfiguracaoForm: jest.fn(real.useConfiguracaoForm),
  };
});

const { notFound } = require('next/navigation');

// Ordem deliberadamente embaralhada: prova que a exibição ordena por
// diaSemana (SEGUNDA → DOMINGO) independentemente da ordem recebida — o PUT
// devolve os dias sem ordenar, só o GET ordena.
// Valores distintos por dia (nenhum par de horaInicial/horaFinal repetido
// entre os dias preenchidos): prova que cada dia exibe o próprio estado, não
// o de outro dia por índice. QUARTA é inativa com hora preenchida — estado
// residual plausível (dia foi desativado sem limpar o horário).
const DIAS_DE_FUNCIONAMENTO_EMBARALHADOS = [
  {
    diaSemana: 'QUARTA',
    ativo: false,
    horaInicial: '09:30',
    horaFinal: '13:30',
  },
  { diaSemana: 'DOMINGO', ativo: false, horaInicial: '', horaFinal: '' },
  {
    diaSemana: 'SEGUNDA',
    ativo: true,
    horaInicial: '07:00',
    horaFinal: '11:00',
  },
  { diaSemana: 'SABADO', ativo: false, horaInicial: '', horaFinal: '' },
  {
    diaSemana: 'SEXTA',
    ativo: true,
    horaInicial: '11:15',
    horaFinal: '15:15',
  },
  {
    diaSemana: 'TERCA',
    ativo: true,
    horaInicial: '08:15',
    horaFinal: '12:15',
  },
  {
    diaSemana: 'QUINTA',
    ativo: true,
    horaInicial: '10:45',
    horaFinal: '14:45',
  },
];

const ERROS_VALIDACAO_VAZIO = {
  duracaoAula: undefined,
  tolerancia: undefined,
  diasDeFuncionamento: {},
};

const ORDEM_CANONICA_LABELS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

describe('Configuracao Page', () => {
  let setGuard;
  let clearGuard;

  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: () => true,
    });

    useConfiguracao.mockReturnValue({
      configuracao: { id: 1, diasTrabalho: 5 },
      isLoading: false,
      isNotFound: false,
    });

    useConfiguracaoForm.mockReturnValue({
      formData: {
        duracaoAula: 40,
        tolerancia: 10,
        diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
      },
      isDirty: false,
      errosValidacao: ERROS_VALIDACAO_VAZIO,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      handleDiasDeFuncionamentoChange: jest.fn(),
      restaurarUltimaLeitura: jest.fn(),
      isLoading: false,
    });

    setGuard = jest.fn();
    clearGuard = jest.fn();
    useUnsavedChangesGuard.mockReturnValue({
      setGuard,
      clearGuard,
      confirmNavigation: () => true,
    });
  });

  it('renders configuracao page', () => {
    render(<Configuracao />);
    expect(useUserAuth).toHaveBeenCalled();
  });

  it('calls notFound when configuracao not found', () => {
    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: () => false,
    });

    useConfiguracao.mockReturnValue({
      configuracao: null,
      isLoading: false,
      isNotFound: true,
    });

    render(<Configuracao />);
    expect(notFound).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useConfiguracao.mockReturnValue({
      configuracao: null,
      isLoading: true,
      isNotFound: false,
    });

    render(<Configuracao />);
    expect(useConfiguracao).toHaveBeenCalled();
  });

  describe('seções nomeadas (AC-001-001)', () => {
    it('agrupa duração da aula e tolerância dentro da seção "Aulas"', () => {
      render(<Configuracao />);
      const secaoAulas = screen.getByText('Aulas').closest('section');

      expect(
        within(secaoAulas).getByLabelText(/Duração da Aula/i)
      ).toBeInTheDocument();
      expect(
        within(secaoAulas).getByLabelText(/Tolerância de Atraso/i)
      ).toBeInTheDocument();
    });

    it('agrupa os 7 dias dentro da seção "Horário de funcionamento"', () => {
      render(<Configuracao />);
      const secaoHorario = screen
        .getByText('Horário de funcionamento')
        .closest('section');

      ORDEM_CANONICA_LABELS.forEach(label => {
        expect(within(secaoHorario).getByText(label)).toBeInTheDocument();
      });
    });

    it('não inclui os campos de "Aulas" dentro da seção de horário', () => {
      render(<Configuracao />);
      const secaoHorario = screen
        .getByText('Horário de funcionamento')
        .closest('section');

      expect(
        within(secaoHorario).queryByLabelText(/Duração da Aula/i)
      ).not.toBeInTheDocument();
    });

    it('rotula os campos de minutos com a unidade visível no label', () => {
      render(<Configuracao />);

      expect(
        screen.getByLabelText('Duração da Aula (minutos) *')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Tolerância de Atraso (minutos) *')
      ).toBeInTheDocument();
    });

    it('tem 7 checkboxes "Ativo" e 7 campos de "Hora inicial"/"Hora final" dentro da seção de horário', () => {
      render(<Configuracao />);
      const secaoHorario = screen
        .getByText('Horário de funcionamento')
        .closest('section');

      expect(within(secaoHorario).getAllByLabelText('Ativo')).toHaveLength(7);
      expect(
        within(secaoHorario).getAllByLabelText('Hora inicial')
      ).toHaveLength(7);
      expect(within(secaoHorario).getAllByLabelText('Hora final')).toHaveLength(
        7
      );
    });
  });

  describe('texto de apoio honesto (AC-001-002)', () => {
    it('a duração da aula tem as três afirmações como descrição acessível do próprio campo, dentro da seção "Aulas"', () => {
      render(<Configuracao />);
      const secaoAulas = screen.getByText('Aulas').closest('section');
      const campoDuracao =
        within(secaoAulas).getByLabelText(/Duração da Aula/i);

      expect(campoDuracao).toHaveAccessibleDescription(/sugerir a hora final/i);
      expect(campoDuracao).toHaveAccessibleDescription(
        /não muda a duração de aulas, dias de aula/i
      );
      expect(campoDuracao).toHaveAccessibleDescription(
        /só vale para quem entrar no sistema depois da mudança/i
      );
    });

    it('a tolerância tem as duas afirmações como descrição acessível do próprio campo, dentro da seção "Aulas"', () => {
      render(<Configuracao />);
      const secaoAulas = screen.getByText('Aulas').closest('section');
      const campoTolerancia =
        within(secaoAulas).getByLabelText(/Tolerância de Atraso/i);

      expect(campoTolerancia).toHaveAccessibleDescription(/armazenado/i);
      expect(campoTolerancia).toHaveAccessibleDescription(
        /não é aplicado automaticamente/i
      );
    });

    it('o horário de funcionamento tem as duas afirmações dentro da própria seção', () => {
      render(<Configuracao />);
      const secaoHorario = screen
        .getByText('Horário de funcionamento')
        .closest('section');

      expect(within(secaoHorario).getByText(/registrado/i)).toBeInTheDocument();
      expect(
        within(secaoHorario).getByText(/não restringe o lançamento de aulas/i)
      ).toBeInTheDocument();
    });
  });

  it('exibe os 7 dias em ordem estável por diaSemana, independente da ordem recebida', () => {
    render(<Configuracao />);

    const titulosDosDias = screen
      .getAllByRole('heading', { level: 4 })
      .map(elemento => elemento.textContent);

    expect(titulosDosDias).toEqual(ORDEM_CANONICA_LABELS);
  });

  it('o cabeçalho de cada dia usa text-base (menor que o text-lg do SectionTitle da seção)', () => {
    render(<Configuracao />);

    screen.getAllByRole('heading', { level: 4 }).forEach(titulo => {
      expect(titulo).toHaveClass(
        'text-base',
        'font-semibold',
        'text-main',
        'mb-2'
      );
      expect(titulo).not.toHaveClass('text-xl');
    });
  });

  describe('valores por dia não vazam entre dias (AC-001-008)', () => {
    it('cada um dos 7 dias exibe o próprio ativo/horaInicial/horaFinal, nunca o de outro dia', () => {
      const { container } = render(<Configuracao />);

      DIAS_DE_FUNCIONAMENTO_EMBARALHADOS.forEach(
        ({ diaSemana, ativo, horaInicial, horaFinal }) => {
          const inputAtivo = container.querySelector(
            `input[name="${diaSemana}.ativo"]`
          );
          const inputHoraInicial = container.querySelector(
            `input[name="${diaSemana}.horaInicial"]`
          );
          const inputHoraFinal = container.querySelector(
            `input[name="${diaSemana}.horaFinal"]`
          );

          expect(inputAtivo.checked).toBe(ativo);
          expect(inputHoraInicial.disabled).toBe(!ativo);
          expect(inputHoraFinal.disabled).toBe(!ativo);
          expect(inputHoraInicial.value).toBe(horaInicial);
          expect(inputHoraFinal.value).toBe(horaFinal);
        }
      );
    });
  });

  describe('AC-001-005: guard de navegação registrado a partir de isDirty', () => {
    const mockUseConfiguracaoForm = isDirty => ({
      formData: {
        duracaoAula: 40,
        tolerancia: 10,
        diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
      },
      isDirty,
      errosValidacao: ERROS_VALIDACAO_VAZIO,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      handleDiasDeFuncionamentoChange: jest.fn(),
      isLoading: false,
    });

    it('registra o guard refletindo isDirty a cada mudança, e limpa no cleanup do efeito e no unmount', () => {
      useConfiguracaoForm.mockReturnValue(mockUseConfiguracaoForm(false));

      const { rerender, unmount } = render(<Configuracao />);

      expect(setGuard).toHaveBeenCalledTimes(1);
      expect(setGuard.mock.calls[0][0]()).toBe(false);
      expect(clearGuard).not.toHaveBeenCalled();

      useConfiguracaoForm.mockReturnValue(mockUseConfiguracaoForm(true));
      rerender(<Configuracao />);

      expect(clearGuard).toHaveBeenCalledTimes(1);
      expect(setGuard).toHaveBeenCalledTimes(2);
      expect(setGuard.mock.calls[1][0]()).toBe(true);
      // Prova a ordem (não só a contagem): o cleanup do efeito anterior roda
      // antes do novo `setGuard` — nunca deixa o guard antigo (isDirty
      // obsoleto) apontado.
      expect(clearGuard.mock.invocationCallOrder[0]).toBeLessThan(
        setGuard.mock.invocationCallOrder[1]
      );

      unmount();
      expect(clearGuard).toHaveBeenCalledTimes(2);
    });
  });

  describe('erro junto ao campo/dia (TASK-002-006)', () => {
    const errosValidacaoVazio = ERROS_VALIDACAO_VAZIO;

    it('exibe a mensagem de erro de validação junto ao campo duracaoAula, sem afetar tolerancia (AC-001-006)', () => {
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: '',
          tolerancia: 10,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: {
          ...errosValidacaoVazio,
          duracaoAula: 'Campo obrigatório',
        },
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      render(<Configuracao />);

      expect(
        screen.getByLabelText(/Duração da Aula/i)
      ).toHaveAccessibleDescription(/Campo obrigatório/);
      expect(
        screen.getByLabelText(/Tolerância de Atraso/i)
      ).not.toHaveAccessibleDescription(/Campo obrigatório/);
    });

    it('exibe a mensagem de erro junto ao dia específico, sem indicar outro dia (AC-001-007)', () => {
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: 40,
          tolerancia: 10,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: {
          ...errosValidacaoVazio,
          diasDeFuncionamento: {
            TERCA: {
              horaInicial: undefined,
              horaFinal: 'A hora final deve ser maior que a hora inicial.',
            },
          },
        },
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      const { container } = render(<Configuracao />);

      const horaFinalTerca = container.querySelector(
        'input[name="TERCA.horaFinal"]'
      );
      expect(horaFinalTerca).toHaveAccessibleDescription(
        /A hora final deve ser maior que a hora inicial/
      );

      // sem indicar outro dia: nenhum outro dos 7 dias recebe a mensagem
      DIAS_DE_FUNCIONAMENTO_EMBARALHADOS.filter(
        ({ diaSemana }) => diaSemana !== 'TERCA'
      ).forEach(({ diaSemana }) => {
        const horaInicial = container.querySelector(
          `input[name="${diaSemana}.horaInicial"]`
        );
        const horaFinal = container.querySelector(
          `input[name="${diaSemana}.horaFinal"]`
        );
        expect(horaInicial).not.toHaveAccessibleDescription(
          /A hora final deve ser maior que a hora inicial/
        );
        expect(horaFinal).not.toHaveAccessibleDescription(
          /A hora final deve ser maior que a hora inicial/
        );
      });
    });

    it('exibe a orientação de ativar o dia quando a inconsistência ocorre num dia inativo (FR-001-017)', () => {
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: 40,
          tolerancia: 10,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: {
          ...errosValidacaoVazio,
          diasDeFuncionamento: {
            DOMINGO: {
              horaInicial: undefined,
              horaFinal: 'Ative o dia para corrigir as horas.',
            },
          },
        },
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      const { container } = render(<Configuracao />);

      const horaFinalDomingo = container.querySelector(
        'input[name="DOMINGO.horaFinal"]'
      );
      expect(horaFinalDomingo).toHaveAccessibleDescription(
        /Ative o dia para corrigir as horas/
      );
    });

    it('mapeia erro do servidor (duracaoAula: mensagem) para o campo quando não há erro de validação client-side', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        message: 'Erro de validação',
        errors: ['duracaoAula: Deve ser um número positivo'],
      });
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: -5,
          tolerancia: 10,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: errosValidacaoVazio,
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      render(<Configuracao />);

      expect(
        screen.getByLabelText(/Duração da Aula/i)
      ).toHaveAccessibleDescription(/Deve ser um número positivo/);
    });

    it('erro de diasDeFuncionamento do servidor sem indicação de dia permanece só no FormError genérico (regressão)', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        message: 'Erro de validação',
        errors: ['diasDeFuncionamento: Contém horaInicial inválido'],
      });
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: 40,
          tolerancia: 10,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: errosValidacaoVazio,
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      render(<Configuracao />);

      // continua aparecendo no FormError genérico (topo)
      expect(screen.getByTestId('form-error')).toHaveTextContent(
        'Contém horaInicial inválido'
      );
      // nenhum campo/dia específico recebe essa mensagem
      DIAS_DE_FUNCIONAMENTO_EMBARALHADOS.forEach(({ diaSemana }) => {
        const horaInicial = document.querySelector(
          `input[name="${diaSemana}.horaInicial"]`
        );
        expect(horaInicial).not.toHaveAccessibleDescription(
          /Contém horaInicial inválido/
        );
      });
    });

    it('erro de horaInicial de um dia aparece na descrição acessível do próprio input, sem aparecer na horaFinal do mesmo dia', () => {
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: 40,
          tolerancia: 10,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: {
          ...errosValidacaoVazio,
          diasDeFuncionamento: {
            SEGUNDA: {
              horaInicial: 'Informe um horário no formato HH:MM.',
              horaFinal: undefined,
            },
          },
        },
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      const { container } = render(<Configuracao />);

      const horaInicialSegunda = container.querySelector(
        'input[name="SEGUNDA.horaInicial"]'
      );
      const horaFinalSegunda = container.querySelector(
        'input[name="SEGUNDA.horaFinal"]'
      );
      expect(horaInicialSegunda).toHaveAccessibleDescription(
        /Informe um horário no formato HH:MM/
      );
      expect(horaFinalSegunda).not.toHaveAccessibleDescription(
        /Informe um horário no formato HH:MM/
      );
    });

    it('erro client-side de tolerância aparece na tolerância, sem aparecer na duração', () => {
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: 40,
          tolerancia: '',
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: {
          ...errosValidacaoVazio,
          tolerancia: 'Campo obrigatório',
        },
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      render(<Configuracao />);

      expect(
        screen.getByLabelText(/Tolerância de Atraso/i)
      ).toHaveAccessibleDescription(/Campo obrigatório/);
      expect(
        screen.getByLabelText(/Duração da Aula/i)
      ).not.toHaveAccessibleDescription(/Campo obrigatório/);
    });

    it('erro client e servidor no mesmo campo: a mensagem client prevalece', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        message: 'Erro de validação',
        errors: ['duracaoAula: mensagem do servidor'],
      });
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: '',
          tolerancia: 10,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: {
          ...errosValidacaoVazio,
          duracaoAula: 'Campo obrigatório',
        },
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      render(<Configuracao />);

      expect(
        screen.getByLabelText(/Duração da Aula/i)
      ).toHaveAccessibleDescription(/Campo obrigatório/);
      expect(
        screen.getByLabelText(/Duração da Aula/i)
      ).not.toHaveAccessibleDescription(/mensagem do servidor/);
    });

    it('erro de servidor em tolerância (sem erro client) aparece na tolerância', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        message: 'Erro de validação',
        errors: ['tolerancia: Não pode ser zero'],
      });
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: 40,
          tolerancia: 0,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: errosValidacaoVazio,
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
      });

      render(<Configuracao />);

      expect(
        screen.getByLabelText(/Tolerância de Atraso/i)
      ).toHaveAccessibleDescription(/Não pode ser zero/);
    });
  });

  describe('Cancelar (TASK-002-007, AC-001-011)', () => {
    const mockUseConfiguracaoFormComRestaurar = (
      isDirty,
      restaurarUltimaLeitura
    ) => ({
      formData: {
        duracaoAula: 40,
        tolerancia: 10,
        diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
      },
      isDirty,
      errosValidacao: ERROS_VALIDACAO_VAZIO,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      handleDiasDeFuncionamentoChange: jest.fn(),
      restaurarUltimaLeitura,
    });

    it('sem isDirty: clicar em "Cancelar" chama restaurarUltimaLeitura() direto, sem aviso', () => {
      const confirmNavigationMock = jest.fn(() => true);
      const restaurarUltimaLeituraMock = jest.fn();
      useUnsavedChangesGuard.mockReturnValue({
        setGuard: jest.fn(),
        clearGuard: jest.fn(),
        confirmNavigation: confirmNavigationMock,
      });
      useConfiguracaoForm.mockReturnValue(
        mockUseConfiguracaoFormComRestaurar(false, restaurarUltimaLeituraMock)
      );

      render(<Configuracao />);
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      expect(confirmNavigationMock).toHaveBeenCalledTimes(1);
      expect(restaurarUltimaLeituraMock).toHaveBeenCalledTimes(1);
    });

    it('com isDirty confirmado: aviso exibido (confirmNavigation assíncrono) e restaurarUltimaLeitura() é chamada', async () => {
      const confirmNavigationMock = jest.fn(() => Promise.resolve(true));
      const restaurarUltimaLeituraMock = jest.fn();
      useUnsavedChangesGuard.mockReturnValue({
        setGuard: jest.fn(),
        clearGuard: jest.fn(),
        confirmNavigation: confirmNavigationMock,
      });
      useConfiguracaoForm.mockReturnValue(
        mockUseConfiguracaoFormComRestaurar(true, restaurarUltimaLeituraMock)
      );

      render(<Configuracao />);
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      expect(confirmNavigationMock).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(restaurarUltimaLeituraMock).toHaveBeenCalledTimes(1)
      );
    });

    it('com isDirty cancelado: restaurarUltimaLeitura() não é chamada (formData permanece)', async () => {
      const confirmNavigationMock = jest.fn(() => Promise.resolve(false));
      const restaurarUltimaLeituraMock = jest.fn();
      useUnsavedChangesGuard.mockReturnValue({
        setGuard: jest.fn(),
        clearGuard: jest.fn(),
        confirmNavigation: confirmNavigationMock,
      });
      useConfiguracaoForm.mockReturnValue(
        mockUseConfiguracaoFormComRestaurar(true, restaurarUltimaLeituraMock)
      );

      render(<Configuracao />);
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      await waitFor(() =>
        expect(confirmNavigationMock).toHaveBeenCalledTimes(1)
      );
      // flush a resolução da Promise antes de negar a chamada
      await Promise.resolve();
      await Promise.resolve();

      expect(restaurarUltimaLeituraMock).not.toHaveBeenCalled();
    });

    it('chama confirmNavigation com a sobreposição de texto do Cancelar ("Descartar alterações")', () => {
      const confirmNavigationMock = jest.fn(() => true);
      useUnsavedChangesGuard.mockReturnValue({
        setGuard: jest.fn(),
        clearGuard: jest.fn(),
        confirmNavigation: confirmNavigationMock,
      });
      useConfiguracaoForm.mockReturnValue(
        mockUseConfiguracaoFormComRestaurar(false, jest.fn())
      );

      render(<Configuracao />);
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      expect(confirmNavigationMock).toHaveBeenCalledWith({
        title: 'Descartar alterações?',
        text: 'Há alterações não salvas nesta tela. Se você cancelar, elas serão descartadas.',
        confirmButtonText: 'Descartar alterações',
      });
    });

    it('depende do padrão "nega se o diálogo falhar" (liberarSeFalhar não truthy): com o provider real e o diálogo rejeitando, restaurarUltimaLeitura não é chamada', async () => {
      // Sobrepõe o default do beforeEach (mock síncrono `() => true`): este teste precisa
      // do merge real de `confirmNavigation` (UnsavedChangesGuardProvider) para provar que
      // a página não passa `liberarSeFalhar: true`.
      useUnsavedChangesGuard.mockImplementation(
        jest.requireActual('@/providers/UnsavedChangesGuardProvider')
          .useUnsavedChangesGuard
      );
      let rejeitarShowConfirm;
      const showConfirmMock = jest.fn(
        () =>
          new Promise((_resolve, reject) => {
            rejeitarShowConfirm = reject;
          })
      );
      useSweetAlert.mockReturnValue({ showConfirm: showConfirmMock });
      const restaurarUltimaLeituraMock = jest.fn();
      useConfiguracaoForm.mockReturnValue(
        mockUseConfiguracaoFormComRestaurar(true, restaurarUltimaLeituraMock)
      );

      render(
        <UnsavedChangesGuardProvider>
          <Configuracao />
        </UnsavedChangesGuardProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      await waitFor(() => expect(showConfirmMock).toHaveBeenCalledTimes(1));

      await act(async () => {
        rejeitarShowConfirm(new Error('falha ao exibir o diálogo'));
        // flush o encadeamento .catch(() => liberarSeFalhar).then(confirmado => ...)
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(restaurarUltimaLeituraMock).not.toHaveBeenCalled();
    });
  });

  describe('estados de salvar (TASK-002-007, AC-001-004)', () => {
    it('exibe "Salvando..." (não "Criando...") enquanto isSubmitting', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        isSubmitting: true,
      });

      render(<Configuracao />);

      expect(
        screen.getByRole('button', { name: /salvando/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /criando/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('mensagem de falha por ramo (TASK-002-007, AC-001-004/FR-001-019)', () => {
    const REGEX_ORIENTACAO_RECARREGAR = /Recarregue a tela/i;

    it('falha de validação (erro mapeado por campo): sem a frase de gravação parcial somada', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        message: 'Erro de validação',
        errors: ['duracaoAula: Deve ser um número positivo'],
        action: 'updateConfiguracao',
        status: STATUS.FAILED,
        statusError: 400,
      });

      render(<Configuracao />);

      expect(screen.getByTestId('form-error')).not.toHaveTextContent(
        REGEX_ORIENTACAO_RECARREGAR
      );
    });

    it.each([500, undefined])(
      'falha não-validação com status FAILED e statusError=%s (500 ou sem resposta): soma a orientação de recarregar',
      statusError => {
        useConfiguracao.mockReturnValue({
          configuracao: { id: 1, diasTrabalho: 5 },
          isLoading: false,
          isNotFound: false,
          message: 'Erro ao atualizar configuração',
          errors: [],
          action: 'updateConfiguracao',
          status: STATUS.FAILED,
          statusError,
        });

        render(<Configuracao />);

        expect(screen.getByTestId('form-error')).toHaveTextContent(
          REGEX_ORIENTACAO_RECARREGAR
        );
      }
    );

    it('status ainda não FAILED (ex.: SUCCESS), mesmo com action/errors/statusError de uma falha: não soma a orientação', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        // `message` não-nulo: `FormError` só renderiza com `title` truthy — nulo esconderia
        // a orientação por si só, sem exercitar de fato o gate `status === STATUS.FAILED`.
        message: 'Erro ao atualizar configuração',
        errors: [],
        action: 'updateConfiguracao',
        status: STATUS.SUCCESS,
        statusError: 500,
      });

      render(<Configuracao />);

      expect(screen.getByTestId('form-error')).not.toHaveTextContent(
        REGEX_ORIENTACAO_RECARREGAR
      );
    });

    it('401: a tela não soma a orientação de gravação parcial (logout forçado é do layout)', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        message: 'Não autorizado',
        errors: [],
        action: 'updateConfiguracao',
        status: STATUS.FAILED,
        statusError: 401,
      });

      render(<Configuracao />);

      expect(
        screen.queryByText(REGEX_ORIENTACAO_RECARREGAR)
      ).not.toBeInTheDocument();
    });

    it('falha de uma leitura (GET), não de gravação: sem a orientação de recarregar somada (o termo de action isolado)', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        message: 'Erro ao buscar configuração',
        errors: [],
        action: 'getConfiguracao',
        status: STATUS.FAILED,
        statusError: 500,
      });

      render(<Configuracao />);

      expect(
        screen.queryByText(REGEX_ORIENTACAO_RECARREGAR)
      ).not.toBeInTheDocument();
    });

    it('falha não-validação: os valores digitados permanecem no campo (nenhum é limpo)', () => {
      useConfiguracao.mockReturnValue({
        configuracao: { id: 1, diasTrabalho: 5 },
        isLoading: false,
        isNotFound: false,
        message: 'Erro ao atualizar configuração',
        errors: [],
        action: 'updateConfiguracao',
        status: STATUS.FAILED,
        statusError: 500,
      });
      useConfiguracaoForm.mockReturnValue({
        formData: {
          duracaoAula: 999,
          tolerancia: 77,
          diasDeFuncionamento: DIAS_DE_FUNCIONAMENTO_EMBARALHADOS,
        },
        isDirty: true,
        errosValidacao: ERROS_VALIDACAO_VAZIO,
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        handleDiasDeFuncionamentoChange: jest.fn(),
        restaurarUltimaLeitura: jest.fn(),
      });

      render(<Configuracao />);

      expect(screen.getByLabelText(/Duração da Aula/i).value).toBe('999');
      expect(screen.getByLabelText(/Tolerância de Atraso/i).value).toBe('77');
    });
  });
});

describe('Configuracao Page — erros refletem o formData atual, nunca uma foto do submit', () => {
  // Todos os dias válidos, exceto DOMINGO: inativo, com horaFinal <= horaInicial
  // (estado residual plausível — dia foi desativado sem limpar o horário).
  const diasComDomingoInvalido = [
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
      ativo: true,
      horaInicial: '08:00',
      horaFinal: '18:00',
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
    {
      diaSemana: 'SABADO',
      ativo: false,
      horaInicial: '08:00',
      horaFinal: '18:00',
    },
    {
      diaSemana: 'DOMINGO',
      ativo: false,
      horaInicial: '10:00',
      horaFinal: '09:00',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Testes anteriores fixam useConfiguracaoForm.mockReturnValue(...); clearAllMocks()
    // não desfaz a implementação mockada (só limpa calls/results) — força de volta a
    // implementação real para este describe, que depende dela.
    useConfiguracaoForm.mockImplementation(
      jest.requireActual('@/hooks/configuracoes/useConfiguracaoForm')
        .useConfiguracaoForm
    );

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: () => true,
    });

    useUnsavedChangesGuard.mockReturnValue({
      setGuard: jest.fn(),
      clearGuard: jest.fn(),
      confirmNavigation: () => true,
    });
  });

  it('dia inativo com hora inválida → "Ative o dia…"; marcar Ativo → vira formato/ordem; corrigir → some', () => {
    const submitMock = jest.fn();
    useConfiguracao.mockReturnValue({
      configuracao: {
        id: 1,
        duracaoAula: 50,
        tolerancia: 10,
        diasDeFuncionamento: diasComDomingoInvalido,
      },
      isLoading: false,
      isNotFound: false,
      submit: submitMock,
    });

    const { container } = render(<Configuracao />);

    // 1ª tentativa de salvar: dia inativo com hora inválida → orientação de ativar
    fireEvent.submit(container.querySelector('form'));

    const horaFinalDomingo = container.querySelector(
      'input[name="DOMINGO.horaFinal"]'
    );
    expect(horaFinalDomingo).toHaveAccessibleDescription(
      /Ative o dia para corrigir as horas/
    );
    expect(submitMock).not.toHaveBeenCalled();

    // Marca o dia como Ativo (sem submeter de novo): a mensagem é derivada do
    // formData atual, não uma foto do submit anterior — "Ative o dia" some e vira
    // a mensagem de formato/ordem (as horas continuam com horaFinal <= horaInicial)
    fireEvent.click(container.querySelector('input[name="DOMINGO.ativo"]'));

    expect(horaFinalDomingo).not.toHaveAccessibleDescription(
      /Ative o dia para corrigir as horas/
    );
    expect(horaFinalDomingo).toHaveAccessibleDescription(
      /A hora final deve ser maior que a hora inicial/
    );

    // Corrige a hora final: o erro some
    fireEvent.change(horaFinalDomingo, { target: { value: '11:00' } });

    expect(horaFinalDomingo).not.toHaveAccessibleDescription(
      /A hora final deve ser maior que a hora inicial/
    );
    expect(horaFinalDomingo).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('antes do 1º Salvar, digitar um valor inválido não mostra erro (lado legítimo)', () => {
    useConfiguracao.mockReturnValue({
      configuracao: {
        id: 1,
        duracaoAula: 50,
        tolerancia: 10,
        diasDeFuncionamento: diasComDomingoInvalido,
      },
      isLoading: false,
      isNotFound: false,
      submit: jest.fn(),
    });

    render(<Configuracao />);

    fireEvent.change(screen.getByLabelText(/Duração da Aula/i), {
      target: { value: '' },
    });

    expect(
      screen.getByLabelText(/Duração da Aula/i)
    ).not.toHaveAccessibleDescription(/Campo obrigatório/);
  });
});
