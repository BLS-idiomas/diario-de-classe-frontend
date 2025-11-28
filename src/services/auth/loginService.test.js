const mockLogin = jest.fn().mockResolvedValue('static-result');
jest.mock('@/store/api/authApi', () => ({
  AuthApi: jest.fn().mockImplementation(() => ({ login: mockLogin })),
}));

import { LoiginService } from './loginService';

describe('LoiginService', () => {
  it('should call authApi.login with data when execute is called', async () => {
    const mockApi = { login: jest.fn().mockResolvedValue('result') };
    const service = new LoiginService(mockApi);
    const data = { user: 'foo', pass: 'bar' };
    const result = await service.execute(data);
    expect(mockApi.login).toHaveBeenCalledWith(data);
    expect(result).toBe('result');
  });

  it('static handle should instantiate AuthApi and call execute', async () => {
    const data = { user: 'bar', pass: 'baz' };
    const result = await LoiginService.handle(data);
    expect(mockLogin).toHaveBeenCalledWith(data);
    expect(result).toBe('static-result');
  });
});
