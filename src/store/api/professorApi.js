import { AbstractEntityApi } from './abstractEntityApi';

export class ProfessorApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/professores';
  }

  async getAulasByProfessor(id) {
    return this.get(`${this.baseEndpoint}/${id}/aulas`);
  }

  async getAlunosByProfessor(id) {
    return this.get(`${this.baseEndpoint}/${id}/alunos`);
  }

  async updateDisponibilidade(id, data) {
    return this.put(`${this.baseEndpoint}/${id}/disponibilidade`, data);
  }
}
