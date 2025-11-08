import { BaseApi } from './baseApi';

export class AuthenticatedApi extends BaseApi {
  constructor() {
    super();
    this.addTokenInterceptor();
  }

  addTokenInterceptor() {
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  isAuthenticated() {
    const token = localStorage.getItem('token') || true; // TODO implementar verificação correta do token
    return !!token;
  }
}
