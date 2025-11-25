import { AulaApi } from '../aulaApi';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do axios
const mockAxiosInstance = {
  defaults: {
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Mock do axios create
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
}));

describe.skip('AulaApi', () => {
  let aulaApi;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');

    aulaApi = new AulaApi();
  });

  describe('constructor and inheritance', () => {
    it('should extend AbstractEntityApi correctly', () => {
      expect(aulaApi).toBeInstanceOf(AulaApi);
      expect(aulaApi.api).toBe(mockAxiosInstance);
    });

    it('should set correct endpoint for aulas', () => {
      expect(aulaApi.baseEndpoint).toBe('/aulas');
      expect(aulaApi.getEndpoint()).toBe('/aulas');
    });

    it('should inherit all CRUD methods from AbstractEntityApi', () => {
      expect(typeof aulaApi.getAll).toBe('function');
      expect(typeof aulaApi.getById).toBe('function');
      expect(typeof aulaApi.create).toBe('function');
      expect(typeof aulaApi.update).toBe('function');
      expect(typeof aulaApi.delete).toBe('function');
    });
  });

  describe('aula-specific operations', () => {
    it('should get all aulas', async () => {
      const mockAulas = {
        data: [
          {
            id: 1,
            titulo: 'Introdução ao Inglês',
            data: '2024-11-08',
            horarioInicio: '08:00',
            horarioFim: '09:30',
            professorId: 1,
            turmaId: 1,
            sala: 'A101',
          },
          {
            id: 2,
            titulo: 'Verbos Irregulares',
            data: '2024-11-09',
            horarioInicio: '10:00',
            horarioFim: '11:30',
            professorId: 1,
            turmaId: 1,
            sala: 'A102',
          },
        ],
      };

      mockAxiosInstance.get.mockResolvedValue(mockAulas);

      const result = await aulaApi.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/aulas', {
        params: {},
      });
      expect(result).toEqual(mockAulas);
    });

    it('should get aula by id with complete details', async () => {
      const mockAula = {
        data: {
          id: 1,
          titulo: 'Introdução ao Inglês',
          descricao: 'Aula introdutória sobre os fundamentos da língua inglesa',
          data: '2024-11-08',
          horarioInicio: '08:00',
          horarioFim: '09:30',
          professorId: 1,
          professor: {
            id: 1,
            nome: 'Prof. Ana Silva',
          },
          turmaId: 1,
          turma: {
            id: 1,
            nome: 'Inglês Básico - Turma A',
            codigo: 'IB-2024-A',
          },
          sala: 'A101',
          conteudoProgramatico: [
            'Alfabeto inglês',
            'Números de 1 a 100',
            'Cumprimentos básicos',
          ],
          materiaisNecessarios: ['Livro didático', 'Caderno', 'Dicionário'],
          objetivos: [
            'Apresentar o alfabeto inglês',
            'Ensinar números básicos',
            'Praticar cumprimentos',
          ],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockAula);

      const result = await aulaApi.getById(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/aulas/1', {
        params: {},
      });
      expect(result).toEqual(mockAula);
      expect(result.data.conteudoProgramatico).toHaveLength(3);
    });

    it('should create new aula with schedule validation', async () => {
      const novaAula = {
        titulo: 'Present Simple Tense',
        descricao: 'Aula sobre o tempo verbal Present Simple',
        data: '2024-11-15',
        horarioInicio: '14:00',
        horarioFim: '15:30',
        professorId: 2,
        turmaId: 2,
        sala: 'B203',
        conteudoProgramatico: [
          'Estrutura do Present Simple',
          'Verbos regulares e irregulares',
          'Exercícios práticos',
        ],
      };

      const mockResponse = {
        data: { id: 3, ...novaAula },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await aulaApi.create(novaAula);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/aulas', novaAula);
      expect(result).toEqual(mockResponse);
      expect(result.data.titulo).toBe('Present Simple Tense');
    });

    it('should update existing aula', async () => {
      const aulaAtualizada = {
        titulo: 'Introdução ao Inglês - Revisada',
        horarioInicio: '08:30',
        horarioFim: '10:00',
        observacoes: 'Aula estendida para melhor compreensão',
      };

      const mockResponse = {
        data: {
          id: 1,
          ...aulaAtualizada,
          data: '2024-11-08',
          professorId: 1,
          sala: 'A101',
        },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await aulaApi.update(1, aulaAtualizada);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/aulas/1',
        aulaAtualizada
      );
      expect(result).toEqual(mockResponse);
    });

    it('should cancel/delete aula', async () => {
      const mockResponse = {
        data: {
          message: 'Aula cancelada com sucesso',
          aulaId: 1,
          status: 'cancelada',
        },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await aulaApi.remove(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/aulas/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('aula scheduling and business rules', () => {
    it('should handle scheduling conflict error', async () => {
      const aulaComConflito = {
        titulo: 'Aula com Conflito',
        data: '2024-11-08',
        horarioInicio: '08:00',
        horarioFim: '09:30',
        professorId: 1,
        sala: 'A101', // Mesma sala, mesmo horário
      };

      const mockError = new Error(
        'Conflito de horário: Sala A101 já está ocupada neste horário'
      );
      mockError.status = 409;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(aulaApi.create(aulaComConflito)).rejects.toThrow(
        'Conflito de horário'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/aulas',
        aulaComConflito
      );
    });

    it('should handle professor unavailability error', async () => {
      const aulaComProfessorIndisponivel = {
        titulo: 'Aula Test',
        data: '2024-11-08',
        horarioInicio: '08:00',
        horarioFim: '09:30',
        professorId: 999, // Professor inexistente
      };

      const mockError = new Error('Professor não encontrado ou indisponível');
      mockError.status = 404;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(
        aulaApi.create(aulaComProfessorIndisponivel)
      ).rejects.toThrow('Professor não encontrado');
    });

    it('should handle past date validation', async () => {
      const aulaNoPassado = {
        titulo: 'Aula no Passado',
        data: '2023-01-01', // Data no passado
        horarioInicio: '08:00',
        horarioFim: '09:30',
        professorId: 1,
      };

      const mockError = new Error(
        'Não é possível agendar aula para data passada'
      );
      mockError.status = 400;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(aulaApi.create(aulaNoPassado)).rejects.toThrow(
        'data passada'
      );
    });

    it('should handle weekend scheduling with restrictions', async () => {
      const aulaNoFimDeSemana = {
        titulo: 'Aula de Sábado',
        data: '2024-11-16', // Sábado
        horarioInicio: '08:00',
        horarioFim: '09:30',
        professorId: 1,
        observacoes: 'Aula especial de fim de semana',
      };

      const mockResponse = {
        data: {
          id: 4,
          ...aulaNoFimDeSemana,
          status: 'agendada',
          taxaAdicional: 50.0, // Taxa adicional para fim de semana
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await aulaApi.create(aulaNoFimDeSemana);

      expect(result.data.taxaAdicional).toBe(50.0);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/aulas',
        aulaNoFimDeSemana
      );
    });
  });

  describe('aula content and materials management', () => {
    it('should handle aula with multimedia content', async () => {
      const aulaComMultimidia = {
        titulo: 'Listening Practice',
        conteudoMultimidia: [
          {
            tipo: 'audio',
            url: '/media/audio/lesson1.mp3',
            duracao: '05:30',
          },
          {
            tipo: 'video',
            url: '/media/video/grammar_explanation.mp4',
            duracao: '10:15',
          },
          {
            tipo: 'presentation',
            url: '/media/slides/lesson1.pdf',
            paginas: 25,
          },
        ],
        data: '2024-11-20',
        horarioInicio: '15:00',
        horarioFim: '16:30',
      };

      const mockResponse = {
        data: { id: 5, ...aulaComMultimidia },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await aulaApi.create(aulaComMultimidia);

      expect(result.data.conteudoMultimidia).toHaveLength(3);
      expect(result.data.conteudoMultimidia[0].tipo).toBe('audio');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/aulas',
        aulaComMultimidia
      );
    });

    it('should handle aula with homework assignments', async () => {
      const aulaComTarefas = {
        titulo: 'Grammar Review',
        tarefasDeCasa: [
          {
            titulo: 'Complete the sentences',
            descricao: 'Fill in the blanks with the correct verb form',
            prazoEntrega: '2024-11-22',
            pontuacao: 10,
          },
          {
            titulo: 'Reading comprehension',
            descricao: 'Read the text and answer the questions',
            prazoEntrega: '2024-11-25',
            pontuacao: 15,
          },
        ],
        data: '2024-11-18',
        horarioInicio: '09:00',
        horarioFim: '10:30',
      };

      const mockResponse = {
        data: { id: 6, ...aulaComTarefas },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await aulaApi.create(aulaComTarefas);

      expect(result.data.tarefasDeCasa).toHaveLength(2);
      expect(result.data.tarefasDeCasa[0].pontuacao).toBe(10);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/aulas',
        aulaComTarefas
      );
    });
  });

  describe('aula attendance and progress tracking', () => {
    it('should handle aula with attendance list', async () => {
      const aulaComPresenca = {
        id: 1,
        titulo: 'Introdução ao Inglês',
        listaPresenca: [
          { alunoId: 1, presente: true, horarioChegada: '08:00' },
          { alunoId: 2, presente: true, horarioChegada: '08:05' },
          { alunoId: 3, presente: false, justificativa: 'Doente' },
          { alunoId: 4, presente: true, horarioChegada: '08:10' },
        ],
        totalAlunos: 4,
        totalPresentes: 3,
        percentualPresenca: 75,
      };

      const mockResponse = {
        data: aulaComPresenca,
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await aulaApi.update(1, {
        listaPresenca: aulaComPresenca.listaPresenca,
      });

      expect(result.data.totalPresentes).toBe(3);
      expect(result.data.percentualPresenca).toBe(75);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/aulas/1', {
        listaPresenca: aulaComPresenca.listaPresenca,
      });
    });

    it('should handle aula completion and feedback', async () => {
      const aulaFinalizada = {
        status: 'concluida',
        feedbackProfessor: 'Aula transcorreu muito bem, alunos participativos',
        pontosPrincipais: [
          'Introdução bem recebida pelos alunos',
          'Necessário revisar pronúncia na próxima aula',
          'Exercícios práticos foram eficazes',
        ],
        proximosPassos: 'Focar em exercícios de conversação',
        avaliacaoAula: 4.5,
        dataFinalizacao: '2024-11-08T09:30:00Z',
      };

      const mockResponse = {
        data: {
          id: 1,
          titulo: 'Introdução ao Inglês',
          ...aulaFinalizada,
        },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await aulaApi.update(1, aulaFinalizada);

      expect(result.data.status).toBe('concluida');
      expect(result.data.avaliacaoAula).toBe(4.5);
      expect(result.data.pontosPrincipais).toHaveLength(3);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/aulas/1',
        aulaFinalizada
      );
    });
  });

  describe('aula integration with school calendar', () => {
    it('should handle recurring aula creation', async () => {
      const aulaRecorrente = {
        titulo: 'Conversação Semanal',
        data: '2024-11-08',
        horarioInicio: '19:00',
        horarioFim: '20:30',
        professorId: 1,
        turmaId: 1,
        recorrencia: {
          tipo: 'semanal',
          diasDaSemana: ['sexta'],
          dataFim: '2024-12-20',
          excecoes: ['2024-12-25'], // Natal
        },
      };

      const mockResponse = {
        data: {
          aulaPrincipal: { id: 7, ...aulaRecorrente },
          aulasGeradas: [
            { id: 7, data: '2024-11-08' },
            { id: 8, data: '2024-11-15' },
            { id: 9, data: '2024-11-22' },
            { id: 10, data: '2024-11-29' },
            { id: 11, data: '2024-12-06' },
            { id: 12, data: '2024-12-13' },
            { id: 13, data: '2024-12-20' },
          ],
          totalAulasGeradas: 7,
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await aulaApi.create(aulaRecorrente);

      expect(result.data.totalAulasGeradas).toBe(7);
      expect(result.data.aulasGeradas).toHaveLength(7);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/aulas',
        aulaRecorrente
      );
    });

    it('should handle holiday and vacation periods', async () => {
      const aulaEmFeriado = {
        titulo: 'Aula Especial',
        data: '2024-12-25', // Natal
        horarioInicio: '10:00',
        horarioFim: '11:30',
      };

      const mockError = new Error(
        'Não é possível agendar aula em feriado nacional'
      );
      mockError.status = 400;
      mockError.code = 'HOLIDAY_RESTRICTION';
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(aulaApi.create(aulaEmFeriado)).rejects.toThrow(
        'feriado nacional'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/aulas',
        aulaEmFeriado
      );
    });
  });
});
