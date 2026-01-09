import { AlunoApi } from './alunoApi';

describe('AlunoApi', () => {
  let api;

  beforeEach(() => {
    api = new AlunoApi();
  });

  it('should set baseEndpoint to /alunos', () => {
    expect(api.baseEndpoint).toBe('/alunos');
  });

  it('should call getAll with correct endpoint and params', async () => {
    const params = { foo: 'bar' };
    api.get = jest.fn();
    await api.getAll(params);
    expect(api.get).toHaveBeenCalledWith('/alunos', params);
  });

  it('should call getById with correct endpoint', async () => {
    api.get = jest.fn();
    await api.getById(123);
    expect(api.get).toHaveBeenCalledWith('/alunos/123', {});
  });

  it('should call create with correct endpoint and data', async () => {
    const data = { name: 'foo' };
    api.post = jest.fn();
    await api.create(data);
    expect(api.post).toHaveBeenCalledWith('/alunos', data);
  });

  it('should call update with correct endpoint and data', async () => {
    const data = { name: 'bar' };
    api.put = jest.fn();
    await api.update(456, data);
    expect(api.put).toHaveBeenCalledWith('/alunos/456', data);
  });

  it('should call delete with correct endpoint', async () => {
    api.destroy = jest.fn();
    await api.delete(789);
    expect(api.destroy).toHaveBeenCalledWith('/alunos/789');
  });

  it('should call getAulasByAluno with correct endpoint', async () => {
    api.get = jest.fn();
    await api.getAulasByAluno(1);
    expect(api.get).toHaveBeenCalledWith('/alunos/1/aulas');
  });

  it('should call getDiasAulasByAluno with correct endpoint', async () => {
    api.get = jest.fn();
    await api.getDiasAulasByAluno(2);
    expect(api.get).toHaveBeenCalledWith('/alunos/2/dias-aulas');
  });

  it('should call getContratoByAluno with correct endpoint', async () => {
    api.get = jest.fn();
    await api.getContratoByAluno(3);
    expect(api.get).toHaveBeenCalledWith('/alunos/3/contrato');
  });

  it('should call getContratosByAluno with correct endpoint', async () => {
    api.get = jest.fn();
    await api.getContratosByAluno(4);
    expect(api.get).toHaveBeenCalledWith('/alunos/4/contratos');
  });

  it('should call uploadAlunoList with correct endpoint and file', async () => {
    const file = new FormData();
    file.append('file', 'test.csv');

    // Mock dos headers e defaults
    api.api = {
      defaults: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    };

    api.post = jest.fn().mockResolvedValue({ data: [] });

    await api.uploadAlunoList(file);

    // Verifica se o post foi chamado corretamente
    expect(api.post).toHaveBeenCalledWith('/alunos/upload', file);

    // Verifica se o Content-Type foi restaurado após o upload
    expect(api.api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should restore Content-Type even when upload fails', async () => {
    const file = new FormData();
    file.append('file', 'test.csv');

    // Mock dos headers e defaults
    api.api = {
      defaults: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    };

    api.post = jest.fn().mockRejectedValue(new Error('Upload failed'));

    await expect(api.uploadAlunoList(file)).rejects.toThrow('Upload failed');

    // Verifica se o Content-Type foi restaurado mesmo após erro
    expect(api.api.defaults.headers['Content-Type']).toBe('application/json');
  });
});
