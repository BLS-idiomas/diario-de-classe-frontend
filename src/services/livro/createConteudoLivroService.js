import { LivroApi } from '@/store/api/livroApi';

export class CreateConteudoLivroService {
  constructor(livroApi) {
    this.livroApi = livroApi;
  }

  async execute(id, data) {
    return await this.livroApi.createConteudo(id, data);
  }

  static async handle(id, data) {
    const livroApi = new LivroApi();
    const service = new CreateConteudoLivroService(livroApi);

    return await service.execute(id, data);
  }
}
