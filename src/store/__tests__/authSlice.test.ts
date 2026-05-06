import authReducer, { signIn, signOut } from '../auth/auth.slice';

describe('authSlice', () => {
  it('return initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      authenticated: false,
      token: null,
    });
  });

  it('handle sign in', () => {
    const prevState = {
      authenticated: false,
      token: null,
    };

    const state = authReducer(prevState, signIn('token-123'));

    expect(state).toEqual({
      authenticated: true,
      token: 'token-123',
    });
  });

  it('handle sign out', () => {
    const prevState = {
      authenticated: true,
      token: 'token-123',
    };

    const state = authReducer(prevState, signOut());
    expect(state).toEqual({
      authenticated: false,
      token: null,
    });
  });
});
