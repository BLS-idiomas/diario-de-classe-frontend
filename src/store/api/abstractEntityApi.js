import { AuthenticatedApi } from './authenticatedApi';

export class AbstractEntityApi extends AuthenticatedApi {
  constructor() {
    super();
    this.baseEndpoint = this.getEndpoint();
  }

  getEndpoint() {
    throw new Error('getEndpoint() must be implemented in subclass');
  }

  async getAll(params = {}) {
    return this.get(`${this.baseEndpoint}`, params);
  }

  async getById(id) {
    return this.get(`${this.baseEndpoint}/${id}`);
  }

  async create(data) {
    return this.post(`${this.baseEndpoint}`, data);
  }

  async update(id, data) {
    return this.put(`${this.baseEndpoint}/${id}`, data);
  }

  async delete(id) {
    return this.destroy(`${this.baseEndpoint}/${id}`);
  }
}
