import { AlunoApi } from '../alunoApi';

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

describe.skip('AlunoApi', () => {
  let alunoApi;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');

    alunoApi = new AlunoApi();
  });

  describe('constructor and inheritance', () => {
    it('should extend AbstractEntityApi correctly', () => {
      expect(alunoApi).toBeInstanceOf(AlunoApi);
      expect(alunoApi.api).toBe(mockAxiosInstance);
    });

    it('should set correct endpoint for alunos', () => {
      expect(alunoApi.baseEndpoint).toBe('/alunos');
      expect(alunoApi.getEndpoint()).toBe('/alunos');
    });

    it('should inherit all CRUD methods from AbstractEntityApi', () => {
      expect(typeof alunoApi.getAll).toBe('function');
      expect(typeof alunoApi.getById).toBe('function');
      expect(typeof alunoApi.create).toBe('function');
      expect(typeof alunoApi.update).toBe('function');
      expect(typeof alunoApi.delete).toBe('function');
    });
  });

  describe('aluno-specific operations', () => {
    it('should get all alunos', async () => {
      const mockAlunos = {
        data: [
          {
            id: 1,
            nome: 'João Silva',
            email: 'joao@exemplo.com',
            telefone: '(11) 99999-9999',
            dataMatricula: '2024-01-15',
          },
          {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria@exemplo.com',
            telefone: '(11) 88888-8888',
            dataMatricula: '2024-01-20',
          },
        ],
      };

      mockAxiosInstance.get.mockResolvedValue(mockAlunos);

      const result = await alunoApi.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/alunos', {
        params: {},
      });
      expect(result).toEqual(mockAlunos);
    });

    it('should get aluno by id', async () => {
      const mockAluno = {
        data: {
          id: 1,
          nome: 'João Silva',
          email: 'joao@exemplo.com',
          telefone: '(11) 99999-9999',
          dataMatricula: '2024-01-15',
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'São Paulo',
            cep: '01234-567',
          },
          responsavel: {
            nome: 'José Silva',
            telefone: '(11) 77777-7777',
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockAluno);

      const result = await alunoApi.getById(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/alunos/1', {
        params: {},
      });
      expect(result).toEqual(mockAluno);
    });

    it('should create new aluno', async () => {
      const novoAluno = {
        nome: 'Pedro Costa',
        email: 'pedro@exemplo.com',
        telefone: '(11) 66666-6666',
        dataMatricula: '2024-11-08',
        endereco: {
          rua: 'Av. Paulista, 1000',
          cidade: 'São Paulo',
          cep: '01310-100',
        },
      };

      const mockResponse = {
        data: { id: 3, ...novoAluno },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await alunoApi.create(novoAluno);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/alunos', novoAluno);
      expect(result).toEqual(mockResponse);
    });

    it('should update existing aluno', async () => {
      const alunoAtualizado = {
        nome: 'João Silva Santos',
        email: 'joao.santos@exemplo.com',
        telefone: '(11) 99999-0000',
      };

      const mockResponse = {
        data: { id: 1, ...alunoAtualizado },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await alunoApi.update(1, alunoAtualizado);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/alunos/1',
        alunoAtualizado
      );
      expect(result).toEqual(mockResponse);
    });

    it('should delete aluno', async () => {
      const mockResponse = {
        data: { message: 'Aluno removido com sucesso' },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await alunoApi.remove(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/alunos/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling for aluno operations', () => {
    it('should handle validation error when creating aluno with missing required fields', async () => {
      const alunoInvalido = {
        email: 'email-sem-nome@exemplo.com',
        // nome é obrigatório
      };

      const mockError = new Error('Nome é obrigatório');
      mockError.status = 400;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(alunoApi.create(alunoInvalido)).rejects.toThrow(
        'Nome é obrigatório'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/alunos',
        alunoInvalido
      );
    });

    it('should handle duplicate email error', async () => {
      const alunoComEmailDuplicado = {
        nome: 'Novo Aluno',
        email: 'joao@exemplo.com', // Email já existente
      };

      const mockError = new Error('Email já está em uso');
      mockError.status = 409;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(alunoApi.create(alunoComEmailDuplicado)).rejects.toThrow(
        'Email já está em uso'
      );
    });

    it('should handle aluno not found error', async () => {
      const mockError = new Error('Aluno não encontrado');
      mockError.status = 404;
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(alunoApi.getById(999)).rejects.toThrow(
        'Aluno não encontrado'
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/alunos/999', {
        params: {},
      });
    });
  });

  describe('aluno business rules and edge cases', () => {
    it('should handle aluno with special characters in name', async () => {
      const alunoComCaracteresEspeciais = {
        nome: 'José María Ñuñez',
        email: 'jose.maria@exemplo.com',
        telefone: '(11) 55555-5555',
      };

      const mockResponse = {
        data: { id: 4, ...alunoComCaracteresEspeciais },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await alunoApi.create(alunoComCaracteresEspeciais);

      expect(result.data.nome).toBe('José María Ñuñez');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/alunos',
        alunoComCaracteresEspeciais
      );
    });

    it('should handle aluno with multiple phone numbers', async () => {
      const alunoComMultiplosTelefones = {
        nome: 'Ana Paula',
        email: 'ana@exemplo.com',
        telefones: [
          { tipo: 'residencial', numero: '(11) 3333-3333' },
          { tipo: 'celular', numero: '(11) 99999-9999' },
          { tipo: 'trabalho', numero: '(11) 4444-4444' },
        ],
      };

      const mockResponse = {
        data: { id: 5, ...alunoComMultiplosTelefones },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await alunoApi.create(alunoComMultiplosTelefones);

      expect(result.data.telefones).toHaveLength(3);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/alunos',
        alunoComMultiplosTelefones
      );
    });

    it('should handle aluno update with partial data', async () => {
      const atualizacaoParcial = {
        telefone: '(11) 99999-0000', // Apenas atualizando telefone
      };

      const mockResponse = {
        data: {
          id: 1,
          nome: 'João Silva', // Dados originais mantidos
          email: 'joao@exemplo.com',
          telefone: '(11) 99999-0000', // Apenas telefone atualizado
        },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await alunoApi.update(1, atualizacaoParcial);

      expect(result.data.telefone).toBe('(11) 99999-0000');
      expect(result.data.nome).toBe('João Silva'); // Nome mantido
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/alunos/1',
        atualizacaoParcial
      );
    });
  });

  describe('integration with school system', () => {
    it('should handle aluno with enrollment date and academic info', async () => {
      const alunoComInfoAcademica = {
        nome: 'Carlos Eduardo',
        email: 'carlos@exemplo.com',
        dataMatricula: '2024-11-08',
        curso: 'Inglês Básico',
        turma: 'IB-2024-02',
        nivel: 'Iniciante',
        observacoes: 'Aluno dedicado, boa participação em aula',
      };

      const mockResponse = {
        data: { id: 6, ...alunoComInfoAcademica },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await alunoApi.create(alunoComInfoAcademica);

      expect(result.data.curso).toBe('Inglês Básico');
      expect(result.data.turma).toBe('IB-2024-02');
      expect(result.data.nivel).toBe('Iniciante');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/alunos',
        alunoComInfoAcademica
      );
    });

    it('should handle search/filter operations', async () => {
      // Simular busca por alunos de uma turma específica
      const mockAlunosDaTurma = {
        data: [
          { id: 1, nome: 'João Silva', turma: 'IB-2024-02' },
          { id: 2, nome: 'Maria Santos', turma: 'IB-2024-02' },
          { id: 3, nome: 'Pedro Costa', turma: 'IB-2024-02' },
        ],
      };

      mockAxiosInstance.get.mockResolvedValue(mockAlunosDaTurma);

      // Mesmo endpoint, mas com query parameters (simulado)
      const result = await alunoApi.getAll();

      expect(result.data).toHaveLength(3);
      expect(result.data.every(aluno => aluno.turma === 'IB-2024-02')).toBe(
        true
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/alunos', {
        params: {},
      });
    });
  });
});
