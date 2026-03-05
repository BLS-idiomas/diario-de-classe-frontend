import { ConfiguracaoApi } from '@/store/api/configuracaoApi';

export class UpdateConfiguracaoService {
  constructor(configuracaoApi) {
    this.configuracaoApi = configuracaoApi;
  }

  async execute(data) {
    return await this.configuracaoApi.update(data);
  }

  static async handle(data) {
    const configuracaoApi = new ConfiguracaoApi();
    const service = new UpdateConfiguracaoService(configuracaoApi);

    return await service.execute(data);
  }
}
