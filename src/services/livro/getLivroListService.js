import { LivroApi } from '@/store/api/livroApi';

export class GetLivroListService {
  constructor(livroApi) {
    this.livroApi = livroApi;
  }

  async execute(searchParam) {
    return await this.livroApi.getAll({ q: searchParam });
  }

  static async handle(searchParam) {
    const livroApi = new LivroApi();
    const service = new GetLivroListService(livroApi);

    return await service.execute(searchParam);
  }
}
