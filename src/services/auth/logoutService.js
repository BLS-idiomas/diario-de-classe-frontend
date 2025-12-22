import { AuthApi } from '@/store/api/authApi';

export class LogoutService {
  constructor(authApi) {
    this.authApi = authApi;
  }

  async execute(refreshToken) {
    return await this.authApi.logout(refreshToken);
  }

  static async handle(refreshToken) {
    const authApi = new AuthApi();
    const service = new LogoutService(authApi);

    return await service.execute(refreshToken);
  }
}
