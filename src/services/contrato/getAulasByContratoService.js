import { ContratoApi } from '@/store/api/contratoApi';

export class GetAulasByContratoService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(id) {
    return await this.contratoApi.getAulasByContrato(id);
  }

  static async handle(id) {
    const contratoApi = new ContratoApi();
    const service = new GetAulasByContratoService(contratoApi);

    return await service.execute(id);
  }
}
