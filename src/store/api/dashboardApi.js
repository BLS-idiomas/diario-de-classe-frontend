import { AuthenticatedApi } from './authenticatedApi';

export class DashboardApi extends AuthenticatedApi {
  constructor() {
    super();
    this.baseEndpoint = '/dashboard';
  }

  async getAll(params = {}) {
    return this.get(`${this.baseEndpoint}`, params);
  }
}
