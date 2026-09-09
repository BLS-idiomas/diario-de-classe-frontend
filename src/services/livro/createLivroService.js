import { LivroApi } from '@/store/api/livroApi';

export class CreateLivroService {
  constructor(livroApi) {
    this.livroApi = livroApi;
  }

  async execute(data) {
    return await this.livroApi.create(data);
  }

  static async handle(data) {
    const livroApi = new LivroApi();
    const service = new CreateLivroService(livroApi);

    return await service.execute(data);
  }
}
