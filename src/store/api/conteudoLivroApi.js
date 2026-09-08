import { AbstractEntityApi } from './abstractEntityApi';

export class ConteudoLivroApi extends AbstractEntityApi {
  constructor() {
    super();
  }

  getEndpoint() {
    return '/conteudos';
  }
}
