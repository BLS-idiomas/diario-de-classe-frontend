import { ProfessorApi } from '../professorApi';

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

describe.skip('ProfessorApi', () => {
  let professorApi;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');

    professorApi = new ProfessorApi();
  });

  describe('constructor and inheritance', () => {
    it('should extend AbstractEntityApi correctly', () => {
      expect(professorApi).toBeInstanceOf(ProfessorApi);
      expect(professorApi.api).toBe(mockAxiosInstance);
    });

    it('should set correct endpoint for professores', () => {
      expect(professorApi.baseEndpoint).toBe('/professores');
      expect(professorApi.getEndpoint()).toBe('/professores');
    });

    it('should inherit all CRUD methods from AbstractEntityApi', () => {
      expect(typeof professorApi.getAll).toBe('function');
      expect(typeof professorApi.getById).toBe('function');
      expect(typeof professorApi.create).toBe('function');
      expect(typeof professorApi.update).toBe('function');
      expect(typeof professorApi.delete).toBe('function');
    });
  });

  describe('professor-specific operations', () => {
    it('should get all professores', async () => {
      const mockProfessores = {
        data: [
          {
            id: 1,
            nome: 'Ana Silva',
            email: 'ana.silva@escola.com',
            telefone: '(11) 99999-9999',
            especialidade: 'Inglês',
            dataContratacao: '2023-01-15',
            status: 'ativo',
          },
          {
            id: 2,
            nome: 'Carlos Santos',
            email: 'carlos.santos@escola.com',
            telefone: '(11) 88888-8888',
            especialidade: 'Espanhol',
            dataContratacao: '2023-03-20',
            status: 'ativo',
          },
        ],
      };

      mockAxiosInstance.get.mockResolvedValue(mockProfessores);

      const result = await professorApi.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/professores', {
        params: {},
      });
      expect(result).toEqual(mockProfessores);
    });

    it('should get professor by id with detailed information', async () => {
      const mockProfessor = {
        data: {
          id: 1,
          nome: 'Ana Silva',
          email: 'ana.silva@escola.com',
          telefone: '(11) 99999-9999',
          especialidades: ['Inglês', 'Português para Estrangeiros'],
          formacao: [
            {
              instituicao: 'USP',
              curso: 'Letras - Inglês',
              nivel: 'graduacao',
              anoConclusao: 2018,
            },
            {
              instituicao: 'PUC-SP',
              curso: 'Metodologia do Ensino de Línguas',
              nivel: 'especializacao',
              anoConclusao: 2020,
            },
          ],
          certificacoes: [
            { nome: 'Cambridge CELTA', dataObtencao: '2019-06-15' },
            { nome: 'TOEFL ITP', pontuacao: 650, dataObtencao: '2018-12-10' },
          ],
          experiencia: '5 anos',
          dataContratacao: '2023-01-15',
          salario: 5500.0,
          cargaHoraria: 40,
          status: 'ativo',
          endereco: {
            rua: 'Rua das Acácias, 456',
            cidade: 'São Paulo',
            cep: '04567-890',
          },
          contato: {
            telefoneEmergencia: '(11) 77777-7777',
            contatoEmergencia: 'Maria Silva (mãe)',
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockProfessor);

      const result = await professorApi.getById(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/professores/1', {
        params: {},
      });
      expect(result).toEqual(mockProfessor);
      expect(result.data.especialidades).toHaveLength(2);
      expect(result.data.certificacoes).toHaveLength(2);
    });

    it('should create new professor with validation', async () => {
      const novoProfessor = {
        nome: 'Roberto Lima',
        email: 'roberto.lima@escola.com',
        telefone: '(11) 66666-6666',
        especialidades: ['Francês'],
        formacao: [
          {
            instituicao: 'UNESP',
            curso: 'Letras - Francês',
            nivel: 'graduacao',
            anoConclusao: 2020,
          },
        ],
        experiencia: '3 anos',
        dataContratacao: '2024-11-08',
        salario: 4500.0,
        cargaHoraria: 30,
        status: 'ativo',
      };

      const mockResponse = {
        data: { id: 3, ...novoProfessor },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await professorApi.create(novoProfessor);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/professores',
        novoProfessor
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.especialidades[0]).toBe('Francês');
    });

    it('should update professor information', async () => {
      const professorAtualizado = {
        telefone: '(11) 99999-0000',
        salario: 6000.0,
        especialidades: [
          'Inglês',
          'Português para Estrangeiros',
          'Business English',
        ],
      };

      const mockResponse = {
        data: {
          id: 1,
          nome: 'Ana Silva',
          email: 'ana.silva@escola.com',
          ...professorAtualizado,
        },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await professorApi.update(1, professorAtualizado);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/professores/1',
        professorAtualizado
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.salario).toBe(6000.0);
      expect(result.data.especialidades).toHaveLength(3);
    });

    it('should deactivate professor instead of deleting', async () => {
      const mockResponse = {
        data: {
          message: 'Professor desativado com sucesso',
          professorId: 1,
          status: 'inativo',
          dataDesativacao: '2024-11-08',
        },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await professorApi.remove(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/professores/1');
      expect(result).toEqual(mockResponse);
      expect(result.data.status).toBe('inativo');
    });
  });

  describe('professor qualifications and expertise', () => {
    it('should handle professor with multiple language certifications', async () => {
      const professorPoliglota = {
        nome: 'Elena Rodriguez',
        email: 'elena@escola.com',
        especialidades: ['Inglês', 'Espanhol', 'Português'],
        certificacoes: [
          { nome: 'Cambridge CPE', nivel: 'C2', idioma: 'Inglês' },
          { nome: 'DELE C2', nivel: 'C2', idioma: 'Espanhol' },
          { nome: 'Celpe-Bras', nivel: 'Avançado', idioma: 'Português' },
        ],
        idiomasNativos: ['Espanhol'],
        idiomasFluentes: ['Inglês', 'Português'],
        experienciaInternacional: [
          {
            pais: 'Reino Unido',
            duracao: '2 anos',
            atividade: 'Intercâmbio acadêmico',
          },
          {
            pais: 'Brasil',
            duracao: '3 anos',
            atividade: 'Ensino de espanhol',
          },
        ],
      };

      const mockResponse = {
        data: { id: 4, ...professorPoliglota },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await professorApi.create(professorPoliglota);

      expect(result.data.certificacoes).toHaveLength(3);
      expect(result.data.experienciaInternacional).toHaveLength(2);
      expect(result.data.idiomasNativos).toContain('Espanhol');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/professores',
        professorPoliglota
      );
    });

    it('should handle professor specialization in specific age groups', async () => {
      const professorEspecializado = {
        nome: 'Marcos Oliveira',
        email: 'marcos@escola.com',
        especialidades: ['Inglês para Crianças'],
        especializacoes: [
          {
            area: 'Educação Infantil',
            faixaEtaria: '3-8 anos',
            metodologias: ['Lúdica', 'Montessori', 'Waldorf'],
          },
          {
            area: 'Necessidades Especiais',
            condicoes: ['TDAH', 'Autismo', 'Dislexia'],
            formacao: 'Psicopedagogia',
          },
        ],
        materiaisDidaticos: [
          'Jogos educativos',
          'Livros ilustrados',
          'Recursos audiovisuais',
          'Atividades sensoriais',
        ],
      };

      const mockResponse = {
        data: { id: 5, ...professorEspecializado },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await professorApi.create(professorEspecializado);

      expect(result.data.especializacoes).toHaveLength(2);
      expect(result.data.materiaisDidaticos).toHaveLength(4);
      expect(result.data.especializacoes[0].metodologias).toContain('Lúdica');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/professores',
        professorEspecializado
      );
    });
  });

  describe('professor schedule and availability', () => {
    it('should handle professor availability and schedule preferences', async () => {
      const professorComDisponibilidade = {
        nome: 'Julia Costa',
        email: 'julia@escola.com',
        disponibilidade: {
          diasSemana: ['segunda', 'terca', 'quarta', 'quinta'],
          horarios: {
            manha: { inicio: '08:00', fim: '12:00' },
            tarde: { inicio: '14:00', fim: '18:00' },
          },
          preferencias: {
            maximoAulasDia: 6,
            intervaloMinimo: 15, // minutos
            prefereFeriados: false,
            aceitaSubstituicoes: true,
          },
        },
        restricoes: [
          {
            tipo: 'medica',
            descricao: 'Não pode dar aulas muito cedo devido a tratamento',
          },
          {
            tipo: 'familiar',
            descricao: 'Precisa sair mais cedo às sextas-feiras',
          },
        ],
      };

      const mockResponse = {
        data: { id: 6, ...professorComDisponibilidade },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await professorApi.create(professorComDisponibilidade);

      expect(result.data.disponibilidade.diasSemana).toHaveLength(4);
      expect(result.data.disponibilidade.preferencias.maximoAulasDia).toBe(6);
      expect(result.data.restricoes).toHaveLength(2);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/professores',
        professorComDisponibilidade
      );
    });

    it('should handle professor workload and performance metrics', async () => {
      const professorComMetricas = {
        id: 1,
        metricas: {
          aulasMinistradas: 245,
          horasTrabalhadas: 368,
          avaliacaoMedia: 4.7,
          frequenciaAlunos: 92.5,
          taxaAprovacao: 87.3,
          feedbackPositivo: 96.8,
        },
        objetivos: {
          metaAulasAno: 400,
          metaAvaliacaoMinima: 4.5,
          desenvolvimentoProfissional: [
            'Curso de Business English',
            'Certificação IELTS',
            'Workshop de Tecnologia Educacional',
          ],
        },
        ultimaAvaliacao: {
          data: '2024-06-15',
          avaliador: 'Coordenação Pedagógica',
          nota: 4.8,
          observacoes: 'Excelente didática e relacionamento com alunos',
        },
      };

      const mockResponse = {
        data: professorComMetricas,
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await professorApi.update(1, professorComMetricas);

      expect(result.data.metricas.avaliacaoMedia).toBe(4.7);
      expect(result.data.objetivos.desenvolvimentoProfissional).toHaveLength(3);
      expect(result.data.ultimaAvaliacao.nota).toBe(4.8);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/professores/1',
        professorComMetricas
      );
    });
  });

  describe('error handling for professor operations', () => {
    it('should handle duplicate email error', async () => {
      const professorComEmailDuplicado = {
        nome: 'Novo Professor',
        email: 'ana.silva@escola.com', // Email já existente
      };

      const mockError = new Error('Email já está em uso por outro professor');
      mockError.status = 409;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(
        professorApi.create(professorComEmailDuplicado)
      ).rejects.toThrow('Email já está em uso');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/professores',
        professorComEmailDuplicado
      );
    });

    it('should handle invalid certification error', async () => {
      const professorComCertificacaoInvalida = {
        nome: 'Professor Teste',
        email: 'teste@escola.com',
        certificacoes: [
          { nome: 'Certificação Inexistente', dataObtencao: '2025-01-01' }, // Data futura
        ],
      };

      const mockError = new Error(
        'Certificação inválida ou data de obtenção inválida'
      );
      mockError.status = 400;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(
        professorApi.create(professorComCertificacaoInvalida)
      ).rejects.toThrow('Certificação inválida');
    });

    it('should handle professor not found error', async () => {
      const mockError = new Error('Professor não encontrado');
      mockError.status = 404;
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(professorApi.getById(999)).rejects.toThrow(
        'Professor não encontrado'
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/professores/999', {
        params: {},
      });
    });

    it('should handle salary validation error', async () => {
      const professorComSalarioInvalido = {
        nome: 'Professor Teste',
        salario: -1000, // Salário negativo
      };

      const mockError = new Error('Salário deve ser um valor positivo');
      mockError.status = 400;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(
        professorApi.create(professorComSalarioInvalido)
      ).rejects.toThrow('Salário deve ser um valor positivo');
    });
  });

  describe('professor integration with school system', () => {
    it('should handle professor assignment to multiple classes', async () => {
      const professorComTurmas = {
        id: 1,
        turmasAtribuidas: [
          {
            turmaId: 1,
            nome: 'Inglês Básico A',
            horarios: [
              { dia: 'segunda', inicio: '08:00', fim: '09:30' },
              { dia: 'quarta', inicio: '08:00', fim: '09:30' },
            ],
          },
          {
            turmaId: 2,
            nome: 'Inglês Intermediário B',
            horarios: [
              { dia: 'terca', inicio: '14:00', fim: '15:30' },
              { dia: 'quinta', inicio: '14:00', fim: '15:30' },
            ],
          },
        ],
        cargaHorariaTotal: 12, // horas por semana
        totalAlunos: 28,
      };

      const mockResponse = {
        data: professorComTurmas,
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await professorApi.update(1, {
        turmasAtribuidas: professorComTurmas.turmasAtribuidas,
      });

      expect(result.data.turmasAtribuidas).toHaveLength(2);
      expect(result.data.cargaHorariaTotal).toBe(12);
      expect(result.data.totalAlunos).toBe(28);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/professores/1', {
        turmasAtribuidas: professorComTurmas.turmasAtribuidas,
      });
    });

    it('should handle professor substitution scenarios', async () => {
      const substituicao = {
        professorOriginalId: 1,
        professorSubstitutoId: 2,
        aulaId: 15,
        motivo: 'Professor titular em licença médica',
        dataSubstituicao: '2024-11-08',
        observacoes: 'Substituto já está familiarizado com o conteúdo da turma',
      };

      const mockResponse = {
        data: {
          substituicaoId: 1,
          ...substituicao,
          status: 'confirmada',
          notificacoesEnviadas: [
            'coordenacao',
            'alunos',
            'professor_substituto',
          ],
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await professorApi.create(substituicao);

      expect(result.data.status).toBe('confirmada');
      expect(result.data.notificacoesEnviadas).toHaveLength(3);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/professores',
        substituicao
      );
    });

    it('should handle professor performance reports', async () => {
      const relatorioPerformance = {
        professorId: 1,
        periodo: {
          inicio: '2024-01-01',
          fim: '2024-10-31',
        },
        estatisticas: {
          totalAulas: 320,
          aulasMinistradas: 315,
          aulasCanceladas: 5,
          percentualFrequencia: 98.4,
          avaliacaoMediaAlunos: 4.6,
          reclamacoesRecebidas: 1,
          elogiosRecebidos: 27,
        },
        desenvolvimentoProfissional: {
          cursosRealizados: 3,
          horasFormacao: 80,
          certificacoesObtidas: 1,
        },
        recomendacoes: [
          'Continuar com metodologia atual',
          'Participar de workshop sobre novas tecnologias',
          'Candidato a promoção para coordenação',
        ],
      };

      const mockResponse = {
        data: relatorioPerformance,
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await professorApi.getById(1);

      expect(result.data.estatisticas.percentualFrequencia).toBe(98.4);
      expect(result.data.recomendacoes).toHaveLength(3);
      expect(result.data.desenvolvimentoProfissional.cursosRealizados).toBe(3);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/professores/1', {
        params: {},
      });
    });
  });
});
