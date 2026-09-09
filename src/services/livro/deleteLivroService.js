import { LivroApi } from '@/store/api/livroApi';

export class DeleteLivroService {
  constructor(livroApi) {
    this.livroApi = livroApi;
  }

  async execute(id) {
    return await this.livroApi.delete(id);
  }

  static async handle(id) {
    const livroApi = new LivroApi();
    const service = new DeleteLivroService(livroApi);

    return await service.execute(id);
  }
}
