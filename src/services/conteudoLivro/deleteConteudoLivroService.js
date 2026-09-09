import { ConteudoLivroApi } from '@/store/api/conteudoLivroApi';

export class DeleteConteudoLivroService {
  constructor(conteudoLivroApi) {
    this.conteudoLivroApi = conteudoLivroApi;
  }

  async execute(id) {
    return await this.conteudoLivroApi.delete(id);
  }

  static async handle(id) {
    const conteudoLivroApi = new ConteudoLivroApi();
    const service = new DeleteConteudoLivroService(conteudoLivroApi);

    return await service.execute(id);
  }
}
