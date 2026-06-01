import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { baseApi } from './api/baseApi';
import authReducer from './auth/auth.slice';
import dashboardReducer from './dashboard/dashboard.slice';
import passcodeReducer from './passcode/passcode.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  passcode: passcodeReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type TestRootState = ReturnType<typeof rootReducer>;

export const createTestStore = (preloadedState?: Partial<TestRootState>) =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState,
  });
