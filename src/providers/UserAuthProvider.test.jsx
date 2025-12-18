import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { UserAuthProvider, useUserAuth } from './UserAuthProvider';

beforeAll(() => {
  const localStorageMock = (function () {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      removeItem(key) {
        delete store[key];
      },
      clear() {
        store = {};
      },
    };
  })();
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
  });
});

function TestComponent() {
  const {
    currentUser,
    refreshToken,
    settings,
    authenticate,
    isAuthenticated,
    isAdmin,
    removeAuthenticate,
  } = useUserAuth();
  const [isLogin, setIsLogin] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const authenticated = await isAuthenticated();
      setIsLogin(authenticated);
    })();
  }, [currentUser, isAuthenticated]);
  return (
    <div>
      <span data-testid="user">{currentUser ? currentUser.nome : 'none'}</span>
      <span data-testid="refreshToken">{refreshToken || 'none'}</span>
      <span data-testid="isUserLogin">{isLogin ? 'true' : 'false'}</span>
      <span data-testid="isAdmin">{isAdmin() ? 'true' : 'false'}</span>
      <span data-testid="duracaoAula">{settings?.duracaoAula || 'none'}</span>
      <span data-testid="tolerancia">{settings?.tolerancia || 'none'}</span>
      <span data-testid="diasDeFuncionamento">
        {settings?.diasDeFuncionamento?.length || 0}
      </span>
      <button
        data-testid="save"
        onClick={() =>
          authenticate({
            accessToken: 'token',
            refreshToken: 'refresh',
            tokenType: 'Bearer',
            expiresIn: 3600,
            currentUser: { nome: 'Marcos', permissao: 'admin' },
            duracaoAula: 60,
            tolerancia: 10,
            diasDeFuncionamento: [1, 2, 3, 4, 5],
          })
        }
      >
        Save
      </button>
      <button data-testid="remove" onClick={removeAuthenticate}>
        Remove
      </button>
    </div>
  );
}

describe('UserAuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide default values', async () => {
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    expect(getByTestId('user').textContent).toBe('none');
    expect(getByTestId('refreshToken').textContent).toBe('none');
    expect(getByTestId('duracaoAula').textContent).toBe('none');
    expect(getByTestId('tolerancia').textContent).toBe('none');
    expect(getByTestId('diasDeFuncionamento').textContent).toBe('0');
    await waitFor(() => {
      expect(getByTestId('isUserLogin').textContent).toBe('false');
    });
    expect(getByTestId('isAdmin').textContent).toBe('false');
  });

  it('should save token and settings and update user', async () => {
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    await act(async () => {
      getByTestId('save').click();
    });
    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('Marcos');
      expect(getByTestId('isUserLogin').textContent).toBe('true');
      expect(getByTestId('isAdmin').textContent).toBe('true');
      expect(getByTestId('duracaoAula').textContent).toBe('60');
      expect(getByTestId('tolerancia').textContent).toBe('10');
      expect(getByTestId('diasDeFuncionamento').textContent).toBe('5');
    });
  });

  it('should remove token and reset user', async () => {
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    await act(async () => {
      getByTestId('save').click();
    });
    await act(async () => {
      getByTestId('remove').click();
    });
    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('none');
      expect(getByTestId('isUserLogin').textContent).toBe('false');
    });
    expect(getByTestId('isAdmin').textContent).toBe('false');
  });

  it('should persist token in localStorage', async () => {
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    await act(async () => {
      getByTestId('save').click();
    });
    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('Marcos');
    });
    const tokenData = JSON.parse(localStorage.getItem('token'));
    expect(tokenData).toEqual({
      accessToken: 'token',
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      expiresIn: 3600,
      currentUser: { nome: 'Marcos', permissao: 'admin' },
    });
  });

  it('should persist settings in localStorage', async () => {
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    await act(async () => {
      getByTestId('save').click();
    });
    await waitFor(() => {
      expect(getByTestId('duracaoAula').textContent).toBe('60');
    });
    const settingsData = JSON.parse(localStorage.getItem('settings'));
    expect(settingsData).toEqual({
      duracaoAula: 60,
      tolerancia: 10,
      diasDeFuncionamento: [1, 2, 3, 4, 5],
    });
  });

  it('should load token from localStorage on mount', () => {
    localStorage.setItem(
      'token',
      JSON.stringify({
        accessToken: 'stored-token',
        refreshToken: 'stored-refresh',
        tokenType: 'Bearer',
        expiresIn: 7200,
        currentUser: { nome: 'João', permissao: 'user' },
      })
    );
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    expect(getByTestId('user').textContent).toBe('João');
    expect(getByTestId('refreshToken').textContent).toBe('stored-refresh');
    expect(getByTestId('isAdmin').textContent).toBe('false');
  });

  it('should load settings from localStorage on mount', () => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        duracaoAula: 90,
        tolerancia: 15,
        diasDeFuncionamento: [2, 4, 6],
      })
    );
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    expect(getByTestId('duracaoAula').textContent).toBe('90');
    expect(getByTestId('tolerancia').textContent).toBe('15');
    expect(getByTestId('diasDeFuncionamento').textContent).toBe('3');
  });
});
