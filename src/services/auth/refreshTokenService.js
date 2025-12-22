import { AuthApi } from '@/store/api/authApi';

export class RefreshTokenService {
  constructor(authApi) {
    this.authApi = authApi;
  }

  async execute(data) {
    return await this.authApi.refreshToken(data);
  }

  static async handle(data) {
    const authApi = new AuthApi();
    const service = new RefreshTokenService(authApi);

    return await service.execute(data);
  }
}
