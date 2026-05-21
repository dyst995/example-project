import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import dashboardReducer from './dashboard/dashboard.slice';
import { signOut } from './auth/auth.slice';
import { setupApiClient } from '../network/core';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});

/**
 * Wires store-aware callbacks into API interceptors after store creation.
 */
setupApiClient({
  getAccessToken: () => store.getState().auth.token,
  onUnauthorized: () => {
    store.dispatch(signOut());
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
