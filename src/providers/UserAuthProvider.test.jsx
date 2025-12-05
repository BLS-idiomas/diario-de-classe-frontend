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
    authenticate,
    isAuthenticated,
    isAdmin,
    removeAuthenticate,
  } = useUserAuth();
  const [isLogin, setIsLogin] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      setIsLogin(await isAuthenticated());
    })();
  }, [currentUser, isAuthenticated]);
  return (
    <div>
      <span data-testid="user">{currentUser ? currentUser.nome : 'none'}</span>
      <span data-testid="refreshToken">{refreshToken || 'none'}</span>
      <span data-testid="isUserLogin">{isLogin ? 'true' : 'false'}</span>
      <span data-testid="isAdmin">{isAdmin() ? 'true' : 'false'}</span>
      <button
        data-testid="save"
        onClick={() =>
          authenticate({
            accessToken: 'token',
            refreshToken: 'refresh',
            tokenType: 'Bearer',
            expiresIn: 3600,
            currentUser: { nome: 'Marcos', permissao: 'admin' },
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

  it('should provide default values', () => {
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    expect(getByTestId('user').textContent).toBe('none');
    expect(getByTestId('refreshToken').textContent).toBe('none');
    expect(getByTestId('isUserLogin').textContent).toBe('false');
    expect(getByTestId('isAdmin').textContent).toBe('false');
  });

  it('should save token and update user', async () => {
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    act(() => {
      getByTestId('save').click();
    });
    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('Marcos');
      expect(getByTestId('isUserLogin').textContent).toBe('true');
      expect(getByTestId('isAdmin').textContent).toBe('true');
    });
  });

  it('should remove token and reset user', () => {
    const { getByTestId } = render(
      <UserAuthProvider>
        <TestComponent />
      </UserAuthProvider>
    );
    act(() => {
      getByTestId('save').click();
    });
    act(() => {
      getByTestId('remove').click();
    });
    expect(getByTestId('user').textContent).toBe('none');
    expect(getByTestId('isUserLogin').textContent).toBe('false');
    expect(getByTestId('isAdmin').textContent).toBe('false');
  });
});
