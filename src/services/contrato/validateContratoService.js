import { ContratoApi } from '@/store/api/contratoApi';

export class ValidateContratoService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(id) {
    return await this.contratoApi.validateContrato(id);
  }

  static async handle(id) {
    const contratoApi = new ContratoApi();
    const service = new ValidateContratoService(contratoApi);

    return await service.execute(id);
  }
}
