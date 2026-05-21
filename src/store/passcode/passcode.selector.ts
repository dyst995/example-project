import { RootState } from '..';

export const selectPasscodeState = (state: RootState) => state.passcode;

export const selectPasscodeEnabled = (state: RootState) =>
  state.passcode.isEnabled;

export const selectPasscodeHydrated = (state: RootState) =>
  state.passcode.isHydrated;

export const selectShowPasscodeLogin = (state: RootState) =>
  state.passcode.isHydrated &&
  state.passcode.isEnabled &&
  !state.auth.authenticated;
