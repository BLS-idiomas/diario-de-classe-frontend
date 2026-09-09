import { ConteudoLivroApi } from '@/store/api/conteudoLivroApi';

export class UpdateConteudoLivroService {
  constructor(conteudoLivroApi) {
    this.conteudoLivroApi = conteudoLivroApi;
  }

  async execute(id, data) {
    return await this.conteudoLivroApi.update(id, data);
  }

  static async handle(id, data) {
    const conteudoLivroApi = new ConteudoLivroApi();
    const service = new UpdateConteudoLivroService(conteudoLivroApi);

    return await service.execute(id, data);
  }
}
