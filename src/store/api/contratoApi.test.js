import { ContratoApi } from './contratoApi';

describe('ContratoApi', () => {
  let api;

  beforeEach(() => {
    api = new ContratoApi();
  });

  it('should create an instance of ContratoApi', () => {
    expect(api).toBeInstanceOf(ContratoApi);
  });

  it('should inherit from AbstractEntityApi', () => {
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
    expect(api.put).toBeDefined();
    expect(api.destroy).toBeDefined();
  });

  it('should have getAll method', () => {
    expect(api.getAll).toBeDefined();
    expect(typeof api.getAll).toBe('function');
  });

  it('should have getById method', () => {
    expect(api.getById).toBeDefined();
    expect(typeof api.getById).toBe('function');
  });

  it('should have create method', () => {
    expect(api.create).toBeDefined();
    expect(typeof api.create).toBe('function');
  });

  it('should have update method', () => {
    expect(api.update).toBeDefined();
    expect(typeof api.update).toBe('function');
  });

  it('should have delete method', () => {
    expect(api.delete).toBeDefined();
    expect(typeof api.delete).toBe('function');
  });

  it('should call getAll with correct params', async () => {
    const params = { page: 1, limit: 10 };
    api.get = jest.fn().mockResolvedValue({ data: [] });

    await api.getAll(params);

    expect(api.get).toHaveBeenCalledWith(api.baseEndpoint, params);
  });

  it('should call getById with correct id', async () => {
    const testId = 123;
    api.get = jest.fn().mockResolvedValue({ data: { id: testId } });

    await api.getById(testId);

    expect(api.get).toHaveBeenCalledWith(`${api.baseEndpoint}/${testId}`);
  });

  it('should call create with correct data', async () => {
    const testData = {
      numero: 'CONT-001',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      valor: 1000,
    };
    api.post = jest.fn().mockResolvedValue({ data: testData });

    await api.create(testData);

    expect(api.post).toHaveBeenCalledWith(api.baseEndpoint, testData);
  });

  it('should call update with correct id and data', async () => {
    const testId = 456;
    const testData = {
      numero: 'CONT-002',
      valor: 2000,
    };
    api.put = jest.fn().mockResolvedValue({ data: testData });

    await api.update(testId, testData);

    expect(api.put).toHaveBeenCalledWith(
      `${api.baseEndpoint}/${testId}`,
      testData
    );
  });

  it('should call delete with correct id', async () => {
    const testId = 789;
    api.destroy = jest.fn().mockResolvedValue({ success: true });

    await api.delete(testId);

    expect(api.destroy).toHaveBeenCalledWith(`${api.baseEndpoint}/${testId}`);
  });

  it('should handle getAll with empty params', async () => {
    api.get = jest.fn().mockResolvedValue({ data: [] });

    await api.getAll();

    expect(api.get).toHaveBeenCalled();
  });

  it('should handle getById with string id', async () => {
    const testId = 'abc123';
    api.get = jest.fn().mockResolvedValue({ data: { id: testId } });

    await api.getById(testId);

    expect(api.get).toHaveBeenCalledWith(`${api.baseEndpoint}/${testId}`);
  });

  it('should handle create with minimal data', async () => {
    const minimalData = { numero: 'CONT-MIN' };
    api.post = jest.fn().mockResolvedValue({ data: minimalData });

    await api.create(minimalData);

    expect(api.post).toHaveBeenCalledWith(api.baseEndpoint, minimalData);
  });

  it('should handle update with partial data', async () => {
    const testId = 999;
    const partialData = { valor: 5000 };
    api.put = jest.fn().mockResolvedValue({ data: partialData });

    await api.update(testId, partialData);

    expect(api.put).toHaveBeenCalledWith(
      `${api.baseEndpoint}/${testId}`,
      partialData
    );
  });

  it('should handle errors from getAll', async () => {
    const error = new Error('Network error');
    api.get = jest.fn().mockRejectedValue(error);

    await expect(api.getAll()).rejects.toThrow('Network error');
  });

  it('should handle errors from getById', async () => {
    const error = new Error('Not found');
    api.get = jest.fn().mockRejectedValue(error);

    await expect(api.getById(123)).rejects.toThrow('Not found');
  });

  it('should handle errors from create', async () => {
    const error = new Error('Validation error');
    api.post = jest.fn().mockRejectedValue(error);

    await expect(api.create({})).rejects.toThrow('Validation error');
  });

  it('should handle errors from update', async () => {
    const error = new Error('Update failed');
    api.put = jest.fn().mockRejectedValue(error);

    await expect(api.update(123, {})).rejects.toThrow('Update failed');
  });

  it('should handle errors from delete', async () => {
    const error = new Error('Delete failed');
    api.destroy = jest.fn().mockRejectedValue(error);

    await expect(api.delete(123)).rejects.toThrow('Delete failed');
  });

  it('should return response from getAll', async () => {
    const mockResponse = {
      data: [
        { id: 1, numero: 'CONT-001' },
        { id: 2, numero: 'CONT-002' },
      ],
    };
    api.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.getAll();

    expect(result).toEqual(mockResponse);
  });

  it('should return response from getById', async () => {
    const mockResponse = {
      data: {
        id: 1,
        numero: 'CONT-001',
        valor: 1000,
      },
    };
    api.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.getById(1);

    expect(result).toEqual(mockResponse);
  });

  it('should return response from create', async () => {
    const inputData = { numero: 'CONT-NEW', valor: 3000 };
    const mockResponse = {
      data: {
        id: 100,
        ...inputData,
      },
    };
    api.post = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.create(inputData);

    expect(result).toEqual(mockResponse);
    expect(result.data.id).toBe(100);
  });

  it('should return response from update', async () => {
    const inputData = { valor: 4000 };
    const mockResponse = {
      data: {
        id: 50,
        numero: 'CONT-050',
        ...inputData,
      },
    };
    api.put = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.update(50, inputData);

    expect(result).toEqual(mockResponse);
  });

  it('should return response from delete', async () => {
    const mockResponse = { success: true, message: 'Deleted' };
    api.destroy = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.delete(999);

    expect(result).toEqual(mockResponse);
  });

  it('should work with multiple consecutive calls', async () => {
    api.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { id: 1 } })
      .mockResolvedValueOnce({ data: { id: 2 } })
      .mockResolvedValueOnce({ data: { id: 3 } });

    const result1 = await api.getById(1);
    const result2 = await api.getById(2);
    const result3 = await api.getById(3);

    expect(result1.data.id).toBe(1);
    expect(result2.data.id).toBe(2);
    expect(result3.data.id).toBe(3);
    expect(api.get).toHaveBeenCalledTimes(3);
  });

  it('should handle concurrent calls', async () => {
    api.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { id: 1 } })
      .mockResolvedValueOnce({ data: { id: 2 } })
      .mockResolvedValueOnce({ data: { id: 3 } });

    const [result1, result2, result3] = await Promise.all([
      api.getById(1),
      api.getById(2),
      api.getById(3),
    ]);

    expect(result1.data.id).toBe(1);
    expect(result2.data.id).toBe(2);
    expect(result3.data.id).toBe(3);
  });

  it('should handle complex contrato data', async () => {
    const complexData = {
      numero: 'CONT-2024-001',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      valor: 15000.5,
      status: 'ativo',
      modalidade: 'presencial',
      cargaHoraria: 120,
      observacoes: 'Contrato de curso intensivo',
      alunoId: 123,
      professorId: 456,
    };
    api.post = jest.fn().mockResolvedValue({ data: complexData });

    const result = await api.create(complexData);

    expect(result.data).toEqual(complexData);
    expect(api.post).toHaveBeenCalledWith(api.baseEndpoint, complexData);
  });

  it('should handle zero as id', async () => {
    api.get = jest.fn().mockResolvedValue({ data: { id: 0 } });

    await api.getById(0);

    expect(api.get).toHaveBeenCalledWith(`${api.baseEndpoint}/0`);
  });

  it('should handle negative id', async () => {
    api.get = jest.fn().mockResolvedValue({ data: { id: -1 } });

    await api.getById(-1);

    expect(api.get).toHaveBeenCalledWith(`${api.baseEndpoint}/-1`);
  });

  it('should preserve baseEndpoint value', () => {
    const firstCheck = api.baseEndpoint;
    api.getAll();
    const secondCheck = api.baseEndpoint;

    expect(firstCheck).toBe(secondCheck);
  });

  // Testes para métodos específicos de ContratoApi

  it('should have getDiasAulasByContrato method', () => {
    expect(api.getDiasAulasByContrato).toBeDefined();
    expect(typeof api.getDiasAulasByContrato).toBe('function');
  });

  it('should call getDiasAulasByContrato with correct id', async () => {
    const testId = 123;
    api.get = jest.fn().mockResolvedValue({ data: [] });

    await api.getDiasAulasByContrato(testId);

    expect(api.get).toHaveBeenCalledWith(
      `${api.baseEndpoint}/${testId}/dias-aulas`
    );
  });

  it('should have createManyDiasAulas method', () => {
    expect(api.createManyDiasAulas).toBeDefined();
    expect(typeof api.createManyDiasAulas).toBe('function');
  });

  it('should call createManyDiasAulas with correct id and data', async () => {
    const testId = 456;
    const testData = [
      { diaSemana: 1, horaInicio: '09:00', horaFim: '10:00' },
      { diaSemana: 3, horaInicio: '14:00', horaFim: '15:00' },
    ];
    api.post = jest.fn().mockResolvedValue({ data: testData });

    await api.createManyDiasAulas(testId, testData);

    expect(api.post).toHaveBeenCalledWith(
      `${api.baseEndpoint}/${testId}/dias-aulas`,
      testData
    );
  });

  it('should have getAulasByContrato method', () => {
    expect(api.getAulasByContrato).toBeDefined();
    expect(typeof api.getAulasByContrato).toBe('function');
  });

  it('should call getAulasByContrato with correct id', async () => {
    const testId = 789;
    api.get = jest.fn().mockResolvedValue({ data: [] });

    await api.getAulasByContrato(testId);

    expect(api.get).toHaveBeenCalledWith(`${api.baseEndpoint}/${testId}/aulas`);
  });

  it('should have createManyAulas method', () => {
    expect(api.createManyAulas).toBeDefined();
    expect(typeof api.createManyAulas).toBe('function');
  });

  it('should call createManyAulas with correct id and data', async () => {
    const testId = 101;
    const testData = [
      { data: '2024-01-15', horaInicio: '09:00', horaFim: '10:00' },
      { data: '2024-01-17', horaInicio: '14:00', horaFim: '15:00' },
    ];
    api.post = jest.fn().mockResolvedValue({ data: testData });

    await api.createManyAulas(testId, testData);

    expect(api.post).toHaveBeenCalledWith(
      `${api.baseEndpoint}/${testId}/aulas`,
      testData
    );
  });

  it('should have generateAulas method', () => {
    expect(api.generateAulas).toBeDefined();
    expect(typeof api.generateAulas).toBe('function');
  });

  it('should call generateAulas with correct id and data', async () => {
    const testId = 202;
    const testData = { startDate: '2024-01-01', endDate: '2024-12-31' };
    api.get = jest.fn().mockResolvedValue({ data: [] });

    await api.generateAulas(testId, testData);

    expect(api.get).toHaveBeenCalledWith(
      `${api.baseEndpoint}/${testId}/aulas/generate`,
      testData
    );
  });

  it('should have validateContrato method', () => {
    expect(api.validateContrato).toBeDefined();
    expect(typeof api.validateContrato).toBe('function');
  });

  it('should call validateContrato with correct id', async () => {
    const testId = 303;
    api.get = jest.fn().mockResolvedValue({ data: { valid: true } });

    await api.validateContrato(testId);

    expect(api.get).toHaveBeenCalledWith(
      `${api.baseEndpoint}/${testId}/validate`
    );
  });

  it('should handle errors from getDiasAulasByContrato', async () => {
    const error = new Error('Failed to get dias aulas');
    api.get = jest.fn().mockRejectedValue(error);

    await expect(api.getDiasAulasByContrato(123)).rejects.toThrow(
      'Failed to get dias aulas'
    );
  });

  it('should handle errors from createManyDiasAulas', async () => {
    const error = new Error('Failed to create dias aulas');
    api.post = jest.fn().mockRejectedValue(error);

    await expect(api.createManyDiasAulas(123, [])).rejects.toThrow(
      'Failed to create dias aulas'
    );
  });

  it('should handle errors from getAulasByContrato', async () => {
    const error = new Error('Failed to get aulas');
    api.get = jest.fn().mockRejectedValue(error);

    await expect(api.getAulasByContrato(123)).rejects.toThrow(
      'Failed to get aulas'
    );
  });

  it('should handle errors from createManyAulas', async () => {
    const error = new Error('Failed to create aulas');
    api.post = jest.fn().mockRejectedValue(error);

    await expect(api.createManyAulas(123, [])).rejects.toThrow(
      'Failed to create aulas'
    );
  });

  it('should handle errors from generateAulas', async () => {
    const error = new Error('Failed to generate aulas');
    api.get = jest.fn().mockRejectedValue(error);

    await expect(api.generateAulas(123, {})).rejects.toThrow(
      'Failed to generate aulas'
    );
  });

  it('should handle errors from validateContrato', async () => {
    const error = new Error('Validation failed');
    api.get = jest.fn().mockRejectedValue(error);

    await expect(api.validateContrato(123)).rejects.toThrow(
      'Validation failed'
    );
  });

  it('should return response from getDiasAulasByContrato', async () => {
    const mockResponse = {
      data: [
        { id: 1, diaSemana: 1, horaInicio: '09:00', horaFim: '10:00' },
        { id: 2, diaSemana: 3, horaInicio: '14:00', horaFim: '15:00' },
      ],
    };
    api.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.getDiasAulasByContrato(1);

    expect(result).toEqual(mockResponse);
  });

  it('should return response from createManyDiasAulas', async () => {
    const inputData = [{ diaSemana: 2, horaInicio: '10:00', horaFim: '11:00' }];
    const mockResponse = {
      data: [{ id: 5, ...inputData[0] }],
    };
    api.post = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.createManyDiasAulas(1, inputData);

    expect(result).toEqual(mockResponse);
  });

  it('should return response from getAulasByContrato', async () => {
    const mockResponse = {
      data: [
        { id: 1, data: '2024-01-15', status: 'agendada' },
        { id: 2, data: '2024-01-17', status: 'realizada' },
      ],
    };
    api.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.getAulasByContrato(1);

    expect(result).toEqual(mockResponse);
  });

  it('should return response from createManyAulas', async () => {
    const inputData = [
      { data: '2024-01-20', horaInicio: '09:00', horaFim: '10:00' },
    ];
    const mockResponse = {
      data: [{ id: 10, ...inputData[0], status: 'agendada' }],
    };
    api.post = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.createManyAulas(1, inputData);

    expect(result).toEqual(mockResponse);
  });

  it('should return response from generateAulas', async () => {
    const inputData = { startDate: '2024-01-01', endDate: '2024-01-31' };
    const mockResponse = {
      data: [
        { id: 1, data: '2024-01-15' },
        { id: 2, data: '2024-01-17' },
      ],
    };
    api.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.generateAulas(1, inputData);

    expect(result).toEqual(mockResponse);
  });

  it('should return response from validateContrato', async () => {
    const mockResponse = {
      data: {
        valid: true,
        errors: [],
        warnings: [],
      },
    };
    api.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await api.validateContrato(1);

    expect(result).toEqual(mockResponse);
    expect(result.data.valid).toBe(true);
  });
});
