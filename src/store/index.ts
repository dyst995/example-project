import { configureStore } from '@reduxjs/toolkit';

import { setupApiClient } from '../network/core';
import { baseApi } from './api/baseApi';
import { authApi } from './auth/auth.api';
import authReducer from './auth/auth.slice';
import { signOutThunk } from './auth/auth.thunk';
import dashboardReducer from './dashboard/dashboard.slice';
import passcodeReducer from './passcode/passcode.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    passcode: passcodeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

/**
 * Wires store-aware callbacks into API interceptors after store creation.
 */
setupApiClient({
  getAccessToken: () => store.getState().auth.session?.accessToken ?? null,
  getRefreshToken: () => store.getState().auth.session?.refreshToken ?? null,
  refreshAccessToken: async refreshToken => {
    try {
      const session = await store
        .dispatch(authApi.endpoints.refreshSession.initiate({ refreshToken }))
        .unwrap();
      return session.accessToken;
    } catch {
      return null;
    }
  },
  onUnauthorized: () => {
    store.dispatch(signOutThunk());
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
