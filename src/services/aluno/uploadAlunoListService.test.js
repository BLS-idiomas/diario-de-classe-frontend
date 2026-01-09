import { UploadAlunoListService } from './uploadAlunoListService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock da AlunoApi
jest.mock('@/store/api/alunoApi');

describe('UploadAlunoListService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      uploadAlunoList: jest.fn(),
    };

    // Mock do constructor do AlunoApi
    AlunoApi.mockImplementation(() => mockApi);

    service = new UploadAlunoListService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided alunoApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { uploadAlunoList: jest.fn() };
      const customService = new UploadAlunoListService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should upload file and return response with alunos list', async () => {
      const mockFile = new FormData();
      mockFile.append('file', 'alunos.csv');

      const mockResponse = {
        data: [
          {
            id: 1,
            nome: 'João',
            sobrenome: 'Silva',
            email: 'joao.silva@aluno.com',
            telefone: '(11) 99999-9999',
            status: 'ativo',
          },
          {
            id: 2,
            nome: 'Maria',
            sobrenome: 'Santos',
            email: 'maria.santos@aluno.com',
            telefone: '(11) 98888-8888',
            status: 'ativo',
          },
        ],
      };

      mockApi.uploadAlunoList.mockResolvedValue(mockResponse);

      const result = await service.execute(mockFile);

      expect(mockApi.uploadAlunoList).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(2);
    });

    it('should handle empty file response', async () => {
      const mockFile = new FormData();
      mockFile.append('file', 'empty.csv');

      const mockResponse = {
        data: [],
      };

      mockApi.uploadAlunoList.mockResolvedValue(mockResponse);

      const result = await service.execute(mockFile);

      expect(mockApi.uploadAlunoList).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(0);
    });

    it('should handle API errors during upload', async () => {
      const mockFile = new FormData();
      mockFile.append('file', 'invalid.csv');

      const mockError = new Error('Invalid file format');
      mockApi.uploadAlunoList.mockRejectedValue(mockError);

      await expect(service.execute(mockFile)).rejects.toThrow(
        'Invalid file format'
      );
      expect(mockApi.uploadAlunoList).toHaveBeenCalledWith(mockFile);
    });

    it('should handle validation errors from API', async () => {
      const mockFile = new FormData();
      mockFile.append('file', 'invalid-data.csv');

      const mockError = {
        response: {
          status: 422,
          data: {
            message: 'Validation failed',
            errors: [
              { row: 1, field: 'email', message: 'Invalid email format' },
              { row: 2, field: 'telefone', message: 'Invalid phone number' },
            ],
          },
        },
      };

      mockApi.uploadAlunoList.mockRejectedValue(mockError);

      await expect(service.execute(mockFile)).rejects.toEqual(mockError);
      expect(mockApi.uploadAlunoList).toHaveBeenCalledWith(mockFile);
    });

    it('should handle network errors', async () => {
      const mockFile = new FormData();
      mockFile.append('file', 'alunos.csv');

      const mockError = new Error('Network Error');
      mockApi.uploadAlunoList.mockRejectedValue(mockError);

      await expect(service.execute(mockFile)).rejects.toThrow('Network Error');
      expect(mockApi.uploadAlunoList).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('handle', () => {
    it('should create instances and call execute with file', async () => {
      const mockFile = new FormData();
      mockFile.append('file', 'alunos.csv');

      const mockResponse = {
        data: [
          {
            id: 1,
            nome: 'Test',
            sobrenome: 'User',
            email: 'test@aluno.com',
          },
        ],
      };

      mockApi.uploadAlunoList.mockResolvedValue(mockResponse);

      const result = await UploadAlunoListService.handle(mockFile);

      expect(AlunoApi).toHaveBeenCalled();
      expect(mockApi.uploadAlunoList).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockResponse);
    });

    it('should create new instances on each call', async () => {
      const mockFile1 = new FormData();
      mockFile1.append('file', 'file1.csv');

      const mockFile2 = new FormData();
      mockFile2.append('file', 'file2.csv');

      const mockResponse1 = { data: [{ id: 1 }] };
      const mockResponse2 = { data: [{ id: 2 }] };

      mockApi.uploadAlunoList
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const result1 = await UploadAlunoListService.handle(mockFile1);
      const result2 = await UploadAlunoListService.handle(mockFile2);

      expect(AlunoApi).toHaveBeenCalledTimes(2);
      expect(result1).toEqual(mockResponse1);
      expect(result2).toEqual(mockResponse2);
    });

    it('should propagate errors from execute', async () => {
      const mockFile = new FormData();
      mockFile.append('file', 'error.csv');

      const mockError = new Error('Upload failed');
      mockApi.uploadAlunoList.mockRejectedValue(mockError);

      await expect(UploadAlunoListService.handle(mockFile)).rejects.toThrow(
        'Upload failed'
      );
    });
  });
});
