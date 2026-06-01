import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

import { baseApi } from './api/baseApi';
import type { AuthState } from './auth/auth.slice';
import type dashboardReducer from './dashboard/dashboard.slice';
import type passcodeReducer from './passcode/passcode.slice';

export type RootReducerState = {
  auth: AuthState;
  dashboard: ReturnType<typeof dashboardReducer>;
  passcode: ReturnType<typeof passcodeReducer>;
  api: ReturnType<typeof baseApi.reducer>;
};

export type AppDispatch = ThunkDispatch<RootReducerState, unknown, UnknownAction>;
