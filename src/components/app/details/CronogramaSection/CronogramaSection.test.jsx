import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CronogramaSection } from '.';
import { useCronograma } from '@/hooks/cronogramas/useCronograma';
import { useMatricularLivro } from '@/hooks/cronogramas/useMatricularLivro';
import { useDownloadCronograma } from '@/hooks/cronogramas/useDownloadCronograma';

jest.mock('@/hooks/cronogramas/useCronograma', () => ({
  useCronograma: jest.fn(),
}));
jest.mock('@/hooks/cronogramas/useMatricularLivro', () => ({
  useMatricularLivro: jest.fn(),
}));
jest.mock('@/hooks/cronogramas/useLancarConteudo', () => ({
  useLancarConteudo: jest.fn(() => ({ handleLancarConteudo: jest.fn() })),
}));
jest.mock('@/hooks/cronogramas/useDownloadCronograma', () => ({
  useDownloadCronograma: jest.fn(),
}));
jest.mock('@/hooks/cronogramas/useCronogramaList', () => ({
  useCronogramaList: jest.fn(() => ({ columns: [], data: [] })),
}));
jest.mock('@/hooks/useFormater', () => ({
  useFormater: () => ({ dataFormatter: v => v }),
}));

jest.mock('@/components', () => ({
  Section: ({ children }) => <section>{children}</section>,
  SectionTitle: ({ children }) => <h3>{children}</h3>,
  Badge: ({ text }) => <span data-testid="badge">{text}</span>,
  BadgeGroup: ({ children }) => <div>{children}</div>,
  Table: ({ notFoundMessage }) => (
    <div data-testid="tabela">{notFoundMessage}</div>
  ),
}));

const aluno = { id: 'aluno-1', nome: 'João', nomeCompleto: 'João Silva' };

const estadoCronograma = (overrides = {}) => ({
  cronograma: null,
  livro: null,
  linhas: [],
  conteudosNaoAgendados: [],
  conteudoOptions: [],
  resumo: null,
  isLoading: false,
  hasCronograma: false,
  recarregar: jest.fn(),
  ...overrides,
});

describe('CronogramaSection', () => {
  let handleMatricular;
  let handleDownload;

  beforeEach(() => {
    jest.clearAllMocks();
    handleMatricular = jest.fn();
    handleDownload = jest.fn();
    useMatricularLivro.mockReturnValue({ handleMatricular });
    useDownloadCronograma.mockReturnValue({
      isDownloading: false,
      handleDownload,
    });
    useCronograma.mockReturnValue(estadoCronograma());
  });

  describe('aluno sem livro em curso', () => {
    it('convida a matricular em vez de mostrar erro', () => {
      render(<CronogramaSection aluno={aluno} />);

      expect(screen.getByTestId('cronograma-vazio')).toBeInTheDocument();
      expect(
        screen.getByText('Este aluno ainda não foi matriculado em um livro.')
      ).toBeInTheDocument();
    });

    it('dispara a matrícula sem passar lista de livros', () => {
      // O catálogo é buscado dentro do handler, não no mount.
      render(<CronogramaSection aluno={aluno} />);

      fireEvent.click(screen.getByTestId('cronograma-matricular'));

      expect(handleMatricular).toHaveBeenCalledWith(
        expect.any(Object) // o evento do clique
      );
    });

    it('não renderiza a tabela sem cronograma', () => {
      render(<CronogramaSection aluno={aluno} />);

      expect(screen.queryByTestId('tabela')).not.toBeInTheDocument();
    });
  });

  describe('aluno com livro em curso', () => {
    const comCronograma = (overrides = {}) =>
      useCronograma.mockReturnValue(
        estadoCronograma({
          hasCronograma: true,
          cronograma: { id: 'cron-1' },
          livro: { id: 'livro-1', nome: 'Interchange', idioma: 'INGLES' },
          resumo: {
            totalConteudos: 10,
            conteudosVinculados: 4,
            conteudosRestantes: 0,
            aulasSemConteudo: 0,
          },
          ...overrides,
        })
      );

    it('mostra o livro e o progresso', () => {
      comCronograma();
      render(<CronogramaSection aluno={aluno} />);

      const badges = screen.getAllByTestId('badge').map(b => b.textContent);
      expect(badges).toContain('Interchange — Inglês');
      expect(badges).toContain('4 de 10 conteúdos agendados');
    });

    it('alerta quando o livro não termina dentro do contrato', () => {
      comCronograma({
        resumo: {
          totalConteudos: 10,
          conteudosVinculados: 4,
          conteudosRestantes: 6,
          aulasSemConteudo: 0,
        },
      });
      render(<CronogramaSection aluno={aluno} />);

      expect(screen.getAllByTestId('badge').map(b => b.textContent)).toContain(
        '6 conteúdo(s) sem aula'
      );
    });

    it('alerta quando o livro acabou antes do contrato', () => {
      comCronograma({
        resumo: {
          totalConteudos: 4,
          conteudosVinculados: 4,
          conteudosRestantes: 0,
          aulasSemConteudo: 3,
        },
      });
      render(<CronogramaSection aluno={aluno} />);

      expect(screen.getAllByTestId('badge').map(b => b.textContent)).toContain(
        '3 aula(s) sem conteúdo'
      );
    });

    it('não mostra alerta quando livro e contrato fecham juntos', () => {
      comCronograma();
      render(<CronogramaSection aluno={aluno} />);

      const badges = screen.getAllByTestId('badge').map(b => b.textContent);
      expect(badges.some(t => t.includes('sem aula'))).toBe(false);
      expect(badges.some(t => t.includes('sem conteúdo'))).toBe(false);
    });

    it('baixa a planilha com o nome do aluno', () => {
      comCronograma();
      render(<CronogramaSection aluno={aluno} />);

      fireEvent.click(screen.getByTestId('cronograma-download'));

      expect(handleDownload).toHaveBeenCalledWith('Cronograma - João Silva');
    });

    it('oferece trocar de livro', () => {
      comCronograma();
      render(<CronogramaSection aluno={aluno} />);

      fireEvent.click(screen.getByTestId('cronograma-trocar-livro'));

      expect(handleMatricular).toHaveBeenCalled();
    });

    it('lista os conteúdos que não caberão no contrato', () => {
      comCronograma({
        conteudosNaoAgendados: [
          { id: 'c-9', ordem: 9, titulo: 'Unit 9' },
          { id: 'c-10', ordem: 10, titulo: 'Unit 10' },
        ],
      });
      render(<CronogramaSection aluno={aluno} />);

      expect(
        screen.getByTestId('cronograma-nao-agendados')
      ).toBeInTheDocument();
      expect(screen.getByText('9. Unit 9')).toBeInTheDocument();
      expect(screen.getByText('10. Unit 10')).toBeInTheDocument();
    });

    it('não mostra a lista de sobras quando não há nenhuma', () => {
      comCronograma();
      render(<CronogramaSection aluno={aluno} />);

      expect(
        screen.queryByTestId('cronograma-nao-agendados')
      ).not.toBeInTheDocument();
    });
  });
});
