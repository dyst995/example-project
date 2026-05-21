import { createSlice } from '@reduxjs/toolkit';

import {
  activatePasscodeThunk,
  hydratePasscodeThunk,
  passcodeLoginThunk,
} from './passcode.thunk';

type PasscodeState = {
  isEnabled: boolean;
  isHydrated: boolean;
  isActivating: boolean;
  isUnlocking: boolean;
  error: string | null;
};

const initialState: PasscodeState = {
  isEnabled: false,
  isHydrated: false,
  isActivating: false,
  isUnlocking: false,
  error: null,
};

const passcodeSlice = createSlice({
  name: 'passcode',
  initialState,
  reducers: {
    clearPasscodeError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(hydratePasscodeThunk.pending, state => {
        state.error = null;
      })
      .addCase(hydratePasscodeThunk.fulfilled, (state, action) => {
        state.isEnabled = action.payload;
        state.isHydrated = true;
      })
      .addCase(hydratePasscodeThunk.rejected, state => {
        state.isEnabled = false;
        state.isHydrated = true;
      })
      .addCase(activatePasscodeThunk.pending, state => {
        state.isActivating = true;
        state.error = null;
      })
      .addCase(activatePasscodeThunk.fulfilled, state => {
        state.isActivating = false;
        state.isEnabled = true;
        state.error = null;
      })
      .addCase(activatePasscodeThunk.rejected, (state, action) => {
        state.isActivating = false;
        state.error = action.payload?.message ?? 'Could not activate passcode';
      })
      .addCase(passcodeLoginThunk.pending, state => {
        state.isUnlocking = true;
        state.error = null;
      })
      .addCase(passcodeLoginThunk.fulfilled, state => {
        state.isUnlocking = false;
        state.error = null;
      })
      .addCase(passcodeLoginThunk.rejected, (state, action) => {
        state.isUnlocking = false;
        state.error = action.payload?.message ?? 'Passcode login failed';
      });
  },
});

export const { clearPasscodeError } = passcodeSlice.actions;
export default passcodeSlice.reducer;
