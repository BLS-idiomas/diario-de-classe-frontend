import { AulaApi } from '@/store/api/aulaApi';

export class UpdateConteudoAulaService {
  constructor(aulaApi) {
    this.aulaApi = aulaApi;
  }

  async execute(id, idConteudo) {
    return await this.aulaApi.updateConteudo(id, idConteudo);
  }

  static async handle(id, idConteudo) {
    const aulaApi = new AulaApi();
    const service = new UpdateConteudoAulaService(aulaApi);

    return await service.execute(id, idConteudo);
  }
}
