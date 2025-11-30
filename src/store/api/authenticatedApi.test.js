import axios from 'axios';
jest.mock('axios');
jest.mock('./baseApi', () => {
  return {
    BaseApi: class {
      constructor() {
        this.api = axios.create();
      }
    },
  };
});

describe('AuthenticatedApi', () => {
  let apiInstance;
  let mockLocalStorage;
  let interceptorFn;
  let interceptors;

  beforeEach(() => {
    mockLocalStorage = {};
    global.localStorage = {
      getItem: jest.fn(key => {
        if (mockLocalStorage.hasOwnProperty(key)) {
          // Retorna string se definido
          return typeof mockLocalStorage[key] === 'string'
            ? mockLocalStorage[key]
            : null;
        }
        return null;
      }),
      setItem: jest.fn((key, value) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: jest.fn(key => {
        delete mockLocalStorage[key];
      }),
    };
    interceptors = {
      request: {
        use: jest.fn(fn => {
          interceptorFn = fn;
        }),
      },
    };
    axios.create.mockReturnValue({ interceptors });
    // Força o require da classe após definir o mock do localStorage
    jest.resetModules();
  });

  it('deve adicionar o interceptor de token no construtor', () => {
    apiInstance = new (require('./authenticatedApi').AuthenticatedApi)();
    expect(interceptorFn).toBeInstanceOf(Function);
  });

  it('deve adicionar Authorization se houver token', () => {
    global.localStorage.setItem(
      'token',
      JSON.stringify({ accessToken: 'abc123' })
    );
    const { AuthenticatedApi } = require('./authenticatedApi');
    apiInstance = new AuthenticatedApi();
    const config = { headers: {} };
    const result = interceptorFn(config);
    expect(apiInstance.token).toBe('abc123');
    expect(result.headers.Authorization).toBe('Bearer abc123');
  });

  it('não adiciona Authorization se não houver token', () => {
    global.localStorage.removeItem('token'); // Garante remoção
    const { AuthenticatedApi } = require('./authenticatedApi');
    apiInstance = new AuthenticatedApi();
    const config = { headers: {} };
    const result = interceptorFn(config);
    expect(result.headers.Authorization).toBeUndefined();
    expect(apiInstance.token).toBeUndefined();
  });

  it('isAuthenticated retorna true se houver token', () => {
    global.localStorage.setItem(
      'token',
      JSON.stringify({ accessToken: 'tokenzinho' })
    );
    const { AuthenticatedApi } = require('./authenticatedApi');
    apiInstance = new AuthenticatedApi();
    expect(apiInstance.token).toBe('tokenzinho');
    expect(apiInstance.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated retorna false se não houver token', () => {
    global.localStorage.removeItem('token'); // Garante remoção
    const { AuthenticatedApi } = require('./authenticatedApi');
    apiInstance = new AuthenticatedApi();
    expect(apiInstance.token).toBeUndefined();
    expect(apiInstance.isAuthenticated()).toBe(false);
  });
});
