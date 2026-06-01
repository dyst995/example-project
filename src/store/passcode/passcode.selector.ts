import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import { selectIsAuthenticated } from '../auth';

export const selectPasscodeState = (state: RootState) => state.passcode;

export const selectPasscodeEnabled = (state: RootState) =>
  state.passcode.isEnabled;

export const selectPasscodeHydrated = (state: RootState) =>
  state.passcode.isHydrated;

export const selectShowPasscodeLogin = createSelector(
  [
    (state: RootState) => state.passcode.isHydrated,
    (state: RootState) => state.passcode.isEnabled,
    selectIsAuthenticated,
  ],
  (isHydrated, isEnabled, isAuthenticated) =>
    isHydrated && isEnabled && !isAuthenticated,
);
