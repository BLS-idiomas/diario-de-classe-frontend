import { AuthApi } from '@/store/api/authApi';

export class LogoutService {
  constructor(authApi) {
    this.authApi = authApi;
  }

  async execute() {
    return await this.authApi.logout();
  }

  static async handle() {
    const authApi = new AuthApi();
    const service = new LogoutService(authApi);

    return await service.execute();
  }
}
