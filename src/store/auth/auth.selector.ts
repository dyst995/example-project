import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '..';

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthSession = (state: RootState) => state.auth.session;

export const selectAccessToken = createSelector(
  selectAuthSession,
  session => session?.accessToken ?? null,
);

export const selectRefreshToken = createSelector(
  selectAuthSession,
  session => session?.refreshToken ?? null,
);

export const selectIsAuthenticated = (state: RootState) => state.auth.authenticated;

export const selectAuthHydrated = (state: RootState) => state.auth.isHydrated;

export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

export const selectAuthError = (state: RootState) => state.auth.error;
