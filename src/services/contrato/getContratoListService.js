import { ContratoApi } from '@/store/api/contratoApi';

export class GetContratoListService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(searchParam) {
    return await this.contratoApi.getAll({ q: searchParam });
  }

  static async handle(searchParam) {
    const contratoApi = new ContratoApi();
    const service = new GetContratoListService(contratoApi);

    return await service.execute(searchParam);
  }
}
