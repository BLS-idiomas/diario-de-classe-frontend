import { LivroApi } from '@/store/api/livroApi';

export class UpdateLivroService {
  constructor(livroApi) {
    this.livroApi = livroApi;
  }

  async execute(id, data) {
    return await this.livroApi.update(id, data);
  }

  static async handle(id, data) {
    const livroApi = new LivroApi();
    const service = new UpdateLivroService(livroApi);

    return await service.execute(id, data);
  }
}
