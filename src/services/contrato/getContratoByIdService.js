import { ContratoApi } from '@/store/api/contratoApi';

export class GetContratoByIdService {
  constructor(contratoApi, withRelations) {
    this.contratoApi = contratoApi;
    this.withRelations = withRelations;
  }

  async execute(id) {
    const params = { withRelations: this.withRelations };
    return await this.contratoApi.getById(id, params);
  }

  static async handle(id, withRelations) {
    const contratoApi = new ContratoApi();
    const service = new GetContratoByIdService(contratoApi, withRelations);

    return await service.execute(id);
  }
}
