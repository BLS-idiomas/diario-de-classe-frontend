import { AbstractEntityApi } from './abstractEntityApi';

export class AlunoApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/dias-aulas';
  }
}
