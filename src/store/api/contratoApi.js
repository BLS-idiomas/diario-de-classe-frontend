import { AbstractEntityApi } from './abstractEntityApi';

export class ContratoApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/contratos';
  }

  async getDiasAulasByContrato(id) {
    return this.get(`${this.baseEndpoint}/${id}/dias-aulas`);
  }

  async createManyDiasAulas(id, data) {
    return this.post(`${this.baseEndpoint}/${id}/dias-aulas`, data);
  }

  async getAulasByContrato(id) {
    return this.get(`${this.baseEndpoint}/${id}/aulas`);
  }

  async createManyAulas(id, data) {
    return this.post(`${this.baseEndpoint}/${id}/aulas`, data);
  }

  async generateAulas(id, data) {
    return this.get(`${this.baseEndpoint}/${id}/aulas/generate`, data);
  }

  async validateContrato(id) {
    return this.get(`${this.baseEndpoint}/${id}/validate`);
  }
}
