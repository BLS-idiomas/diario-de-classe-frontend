import { ValidateContratoService } from './validateContratoService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('ValidateContratoService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new ValidateContratoService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(ValidateContratoService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new ValidateContratoService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.validateContrato with correct id', async () => {
      const id = 123;
      const mockResponse = {
        data: {
          valid: true,
          errors: [],
          warnings: [],
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.validateContrato).toHaveBeenCalledWith(id);
      expect(contratoApi.validateContrato).toHaveBeenCalledTimes(1);
    });

    it('should return validation result from contratoApi.validateContrato', async () => {
      const id = 456;
      const mockResponse = {
        data: {
          valid: true,
          errors: [],
          warnings: [],
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data.valid).toBe(true);
    });

    it('should handle validation with errors', async () => {
      const id = 789;
      const mockResponse = {
        data: {
          valid: false,
          errors: [
            'Data de início não pode ser posterior à data de fim',
            'Valor do contrato deve ser maior que zero',
          ],
          warnings: [],
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data.valid).toBe(false);
      expect(result.data.errors).toHaveLength(2);
    });

    it('should handle validation with warnings', async () => {
      const id = 101;
      const mockResponse = {
        data: {
          valid: true,
          errors: [],
          warnings: [
            'Contrato próximo do vencimento',
            'Total de aulas abaixo do esperado',
          ],
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data.valid).toBe(true);
      expect(result.data.warnings).toHaveLength(2);
    });

    it('should handle validation with both errors and warnings', async () => {
      const id = 202;
      const mockResponse = {
        data: {
          valid: false,
          errors: ['Professor não disponível nas datas do contrato'],
          warnings: ['Aluno possui outro contrato ativo'],
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data.valid).toBe(false);
      expect(result.data.errors).toHaveLength(1);
      expect(result.data.warnings).toHaveLength(1);
    });

    it('should handle complete validation response structure', async () => {
      const id = 303;
      const mockResponse = {
        data: {
          valid: true,
          errors: [],
          warnings: [],
          details: {
            dataInicio: true,
            dataFim: true,
            totalAulas: true,
            professorDisponivel: true,
            alunoAtivo: true,
          },
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveProperty('details');
    });

    it('should handle error from contratoApi.validateContrato', async () => {
      const id = 404;
      const error = new Error('Failed to validate contrato');
      contratoApi.validateContrato.mockRejectedValue(error);

      await expect(service.execute(id)).rejects.toThrow(
        'Failed to validate contrato'
      );
    });

    it('should handle string id', async () => {
      const id = 'abc123';
      const mockResponse = {
        data: {
          valid: true,
          errors: [],
          warnings: [],
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.validateContrato).toHaveBeenCalledWith(id);
    });

    it('should handle numeric zero as id', async () => {
      const id = 0;
      const mockResponse = {
        data: {
          valid: false,
          errors: ['Contrato não encontrado'],
          warnings: [],
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.validateContrato).toHaveBeenCalledWith(0);
    });

    it('should handle validation with empty errors and warnings', async () => {
      const id = 505;
      const mockResponse = {
        data: {
          valid: true,
          errors: [],
          warnings: [],
        },
      };
      contratoApi.validateContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result.data.errors).toEqual([]);
      expect(result.data.warnings).toEqual([]);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const id = 999;
      const mockResponse = {
        data: {
          valid: true,
          errors: [],
          warnings: [],
        },
      };
      ContratoApi.mockImplementation(() => ({
        validateContrato: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await ValidateContratoService.handle(id);

      expect(result).toEqual(mockResponse);
    });

    it('should create new ContratoApi instance', async () => {
      const id = 888;
      ContratoApi.mockImplementation(() => ({
        validateContrato: jest.fn().mockResolvedValue({
          data: { valid: true, errors: [], warnings: [] },
        }),
      }));

      const instancesCountBefore = ContratoApi.mock.instances.length;
      await ValidateContratoService.handle(id);

      expect(ContratoApi.mock.instances.length).toBeGreaterThan(
        instancesCountBefore
      );
    });

    it('should handle errors in static method', async () => {
      const id = 777;
      const error = new Error('Static method error');
      ContratoApi.mockImplementation(() => ({
        validateContrato: jest.fn().mockRejectedValue(error),
      }));

      await expect(ValidateContratoService.handle(id)).rejects.toThrow(
        'Static method error'
      );
    });
  });
});
