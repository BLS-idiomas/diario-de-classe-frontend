import { ContratoApi } from '@/store/api/contratoApi';

export class GetDiasAulasByContratoService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(id) {
    return await this.contratoApi.getDiasAulasByContrato(id);
  }

  static async handle(id) {
    const contratoApi = new ContratoApi();
    const service = new GetDiasAulasByContratoService(contratoApi);

    return await service.execute(id);
  }
}
