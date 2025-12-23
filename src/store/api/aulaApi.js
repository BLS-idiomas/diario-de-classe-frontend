import { AbstractEntityApi } from './abstractEntityApi';

export class AulaApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/aulas';
  }

  async updateAndamento(id, data) {
    return this.put(`${this.baseEndpoint}/${id}/andamento`, data);
  }
}
