import { BaseApi } from './baseApi';

export class AuthApi extends BaseApi {
  constructor() {
    super();
  }

  async login(credentials) {
    return await this.api.post('/auth/login', credentials);
  }

  async logout(refreshToken) {
    return await this.api.post('/auth/logout', { refreshToken });
  }

  async refreshToken() {
    return await this.api.post('/auth/refresh-token');
  }
}
