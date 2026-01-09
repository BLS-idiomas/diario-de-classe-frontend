import { AbstractEntityApi } from './abstractEntityApi';

export class AlunoApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/alunos';
  }

  async getAulasByAluno(id) {
    return this.get(`${this.baseEndpoint}/${id}/aulas`);
  }

  async getDiasAulasByAluno(id) {
    return this.get(`${this.baseEndpoint}/${id}/dias-aulas`);
  }

  async getContratoByAluno(id) {
    return this.get(`${this.baseEndpoint}/${id}/contrato`);
  }

  async getContratosByAluno(id) {
    return this.get(`${this.baseEndpoint}/${id}/contratos`);
  }

  async uploadAlunoList(file) {
    const originalContentType = this.api.defaults.headers['Content-Type'];
    delete this.api.defaults.headers['Content-Type'];
    try {
      return await this.post(`${this.baseEndpoint}/upload`, file);
    } finally {
      this.api.defaults.headers['Content-Type'] = originalContentType;
    }
  }
}
