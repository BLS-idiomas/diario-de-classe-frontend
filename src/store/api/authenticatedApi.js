import { BaseApi } from './baseApi';

export class AuthenticatedApi extends BaseApi {
  constructor() {
    super();
    this.addTokenInterceptor();
  }

  addTokenInterceptor() {
    const dataString = localStorage.getItem('token');
    const data = dataString ? JSON.parse(dataString) : null;
    this.token = data?.accessToken;

    this.api.interceptors.request.use(config => {
      const token = this.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  isAuthenticated() {
    return Boolean(this.token);
  }
}
