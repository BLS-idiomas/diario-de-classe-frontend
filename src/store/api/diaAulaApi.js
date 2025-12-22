import { AbstractEntityApi } from './abstractEntityApi';

export class DiaAulaApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/dias-aulas';
  }
}
