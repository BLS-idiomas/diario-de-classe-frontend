import { LivroApi } from '@/store/api/livroApi';

export class GetLivroByIdService {
  constructor(livroApi) {
    this.livroApi = livroApi;
  }

  async execute(id) {
    return await this.livroApi.getById(id);
  }

  static async handle(id) {
    const livroApi = new LivroApi();
    const service = new GetLivroByIdService(livroApi);

    return await service.execute(id);
  }
}
