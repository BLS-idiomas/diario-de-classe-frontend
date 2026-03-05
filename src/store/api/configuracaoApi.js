import { AbstractEntityApi } from './abstractEntityApi';

export class ConfiguracaoApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/configuracao';
  }

  async update(data) {
    return this.put(`${this.baseEndpoint}`, data);
  }

  async getById(id, params = {}) {
    throw new Error('Operação de getById não é permitida para Configuração');
  }

  async create(data) {
    throw new Error('Operação de create não é permitida para Configuração');
  }

  async delete(id) {
    throw new Error('Operação de delete não é permitida para Configuração');
  }
}
