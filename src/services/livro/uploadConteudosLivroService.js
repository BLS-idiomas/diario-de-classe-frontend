import { LivroApi } from '@/store/api/livroApi';

export class UploadConteudosLivroService {
  constructor(livroApi) {
    this.livroApi = livroApi;
  }

  async execute(id, file) {
    return await this.livroApi.uploadConteudos(id, file);
  }

  static async handle(id, file) {
    const livroApi = new LivroApi();
    const service = new UploadConteudosLivroService(livroApi);

    return await service.execute(id, file);
  }
}
