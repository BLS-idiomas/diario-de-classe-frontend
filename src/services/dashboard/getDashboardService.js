import { DashboardApi } from '@/store/api/dashboardApi';

export class GetDashboardService {
  constructor(dashboardApi) {
    this.dashboardApi = dashboardApi;
  }

  async execute(searchParam) {
    return await this.dashboardApi.getAll({ q: searchParam });
  }

  static async handle(searchParam) {
    const dashboardApi = new DashboardApi();
    const service = new GetDashboardService(dashboardApi);

    return await service.execute(searchParam);
  }
}
