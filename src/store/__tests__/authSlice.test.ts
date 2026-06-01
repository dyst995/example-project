import authReducer, { setSession, signOut } from '../auth/auth.slice';
import { hydrateSessionThunk } from '../auth/auth.thunk';

const session = {
  accessToken: 'token-123',
  refreshToken: 'refresh-123',
};

describe('authSlice', () => {
  it('returns initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      session: null,
      authenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false,
    });
  });

  it('handles setSession', () => {
    const prevState = {
      session: null,
      authenticated: false,
      isLoading: false,
      error: null,
      isHydrated: true,
    };

    const state = authReducer(prevState, setSession(session));

    expect(state).toEqual({
      session,
      authenticated: true,
      isLoading: false,
      error: null,
      isHydrated: true,
    });
  });

  it('handles sign out', () => {
    const prevState = {
      session,
      authenticated: true,
      isLoading: false,
      error: null,
      isHydrated: true,
    };

    const state = authReducer(prevState, signOut());

    expect(state).toEqual({
      session: null,
      authenticated: false,
      isLoading: false,
      error: null,
      isHydrated: true,
    });
  });

  it('hydrates persisted session', () => {
    const state = authReducer(
      authReducer(undefined, hydrateSessionThunk.pending),
      hydrateSessionThunk.fulfilled(session, '', undefined),
    );

    expect(state.session).toEqual(session);
    expect(state.authenticated).toBe(true);
    expect(state.isHydrated).toBe(true);
  });
});
