import { BaseApi } from './baseApi';

export class AuthApi extends BaseApi {
  constructor() {
    super();
  }

  addToken(token) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async login(credentials) {
    return await this.api.post('/auth/login', credentials);
  }

  async logout() {
    return await this.api.post('/auth/logout');
  }

  async refreshToken() {
    return await this.api.post('/auth/refresh-token');
  }
}
