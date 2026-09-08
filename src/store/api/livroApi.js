import { AbstractEntityApi } from './abstractEntityApi';

export class LivroApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/livros';
  }

  async createConteudo(id, data) {
    return this.post(`${this.baseEndpoint}/${id}/conteudos`, data);
  }

  async uploadConteudos(id, file) {
    // O multipart precisa que o axios monte o boundary; com o Content-Type
    // padrao de JSON o backend recebe o corpo vazio.
    const originalContentType = this.api.defaults.headers['Content-Type'];
    delete this.api.defaults.headers['Content-Type'];
    try {
      return await this.post(
        `${this.baseEndpoint}/${id}/conteudos/upload`,
        file
      );
    } finally {
      this.api.defaults.headers['Content-Type'] = originalContentType;
    }
  }
}
