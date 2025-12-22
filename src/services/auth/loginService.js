import { AuthApi } from '@/store/api/authApi';

export class LoiginService {
  constructor(authApi) {
    this.authApi = authApi;
  }

  async execute(data) {
    return await this.authApi.login(data);
  }

  static async handle(data) {
    const authApi = new AuthApi();
    const service = new LoiginService(authApi);

    return await service.execute(data);
  }
}
