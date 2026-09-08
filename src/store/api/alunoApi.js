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

  async getCronogramaByAluno(id) {
    return this.get(`${this.baseEndpoint}/${id}/cronograma`);
  }

  async createCronogramaByAluno(id, data) {
    return this.post(`${this.baseEndpoint}/${id}/cronograma`, data);
  }

  async downloadCronogramaExcel(id) {
    // responseType blob: a resposta e um xlsx binario, nao JSON. Sem isso o
    // axios tenta interpretar como texto e corrompe o arquivo.
    return await this.api.get(`${this.baseEndpoint}/${id}/cronograma/excel`, {
      responseType: 'blob',
    });
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
