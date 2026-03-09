import { AbstractEntityApi } from './abstractEntityApi';

export class RelatorioApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/relatorios';
  }

  async getByReport(report, params = {}) {
    return this.get(`${this.baseEndpoint}/${report}`, params);
  }

  async getById(id, params = {}) {
    throw new Error('Operação de getById não é permitida para Relatório');
  }

  async update(data) {
    throw new Error('Operação de update não é permitida para Relatório');
  }

  async create(data) {
    throw new Error('Operação de create não é permitida para Relatório');
  }

  async delete(id) {
    throw new Error('Operação de delete não é permitida para Relatório');
  }
}
