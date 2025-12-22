import { BaseApi } from './baseApi';
import axios from 'axios';

jest.mock('axios');

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

describe('BaseApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.create.mockReturnValue(mockAxiosInstance);
  });

  it('deve criar a instância do axios com baseURL correto', () => {
    new BaseApi();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('deve chamar get corretamente', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: 'ok' });
    const api = new BaseApi();
    const result = await api.get('/test', { foo: 'bar' });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
      params: { foo: 'bar' },
    });
    expect(result).toEqual({ data: 'ok' });
  });

  it('deve chamar post corretamente', async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: 'created' });
    const api = new BaseApi();
    const result = await api.post('/test', { foo: 'bar' });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', {
      foo: 'bar',
    });
    expect(result).toEqual({ data: 'created' });
  });

  it('deve chamar put corretamente', async () => {
    mockAxiosInstance.put.mockResolvedValue({ data: 'updated' });
    const api = new BaseApi();
    const result = await api.put('/test', { foo: 'bar' });
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', { foo: 'bar' });
    expect(result).toEqual({ data: 'updated' });
  });

  it('deve chamar destroy corretamente', async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: 'deleted' });
    const api = new BaseApi();
    const result = await api.destroy('/test');
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test');
    expect(result).toEqual({ data: 'deleted' });
  });
});
