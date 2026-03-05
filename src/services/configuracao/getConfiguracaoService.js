import { ConfiguracaoApi } from '@/store/api/configuracaoApi';

export class GetConfiguracaoService {
  constructor(configuracaoApi) {
    this.configuracaoApi = configuracaoApi;
  }

  async execute() {
    return await this.configuracaoApi.getAll();
  }

  static async handle() {
    const configuracaoApi = new ConfiguracaoApi();
    const service = new GetConfiguracaoService(configuracaoApi);

    return await service.execute();
  }
}
