import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AuthSession } from '../../domain/models/session';
import type { ApiError } from '../../network/core/types';
import { isApiError } from '../../network/utils/normalizeApiError';
import { authApi } from './auth.api';
import { hydrateSessionThunk } from './auth.thunk';

export type AuthState = {
  session: AuthSession | null;
  authenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
};

const initialState: AuthState = {
  session: null,
  authenticated: false,
  isLoading: false,
  error: null,
  isHydrated: false,
};

const applySession = (state: AuthState, session: AuthSession) => {
  state.session = session;
  state.authenticated = true;
  state.error = null;
};

const clearSession = (state: AuthState) => {
  state.session = null;
  state.authenticated = false;
  state.error = null;
  state.isLoading = false;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      clearSession(state);
    },
    setSession(state, action: PayloadAction<AuthSession>) {
      applySession(state, action.payload);
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateSessionThunk.pending, state => {
        state.error = null;
      })
      .addCase(hydrateSessionThunk.fulfilled, (state, action) => {
        state.isHydrated = true;
        if (action.payload) {
          applySession(state, action.payload);
        } else {
          clearSession(state);
        }
      })
      .addCase(hydrateSessionThunk.rejected, state => {
        state.isHydrated = true;
        clearSession(state);
      })
      .addMatcher(authApi.endpoints.login.matchPending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        applySession(state, action.payload);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        clearSession(state);
        const payload = action.payload as ApiError | undefined;
        state.error =
          (payload && isApiError(payload) ? payload.message : undefined) ??
          action.error.message ??
          'Login failed';
      })
      .addMatcher(authApi.endpoints.refreshSession.matchFulfilled, (state, action) => {
        applySession(state, action.payload);
      })
      .addMatcher(authApi.endpoints.refreshSession.matchRejected, state => {
        clearSession(state);
      });
  },
});

export const { signOut, setSession } = authSlice.actions;
export default authSlice.reducer;
