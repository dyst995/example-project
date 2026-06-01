import { createAsyncThunk } from '@reduxjs/toolkit';

import { PASSCODE_PIN_LENGTH } from '../../shared/constants/passcode';
import { KeychainStorage } from '../../shared/security/keychain.storage';
import { passcodePreferences } from '../../shared/storage/passcodePreferences';
import {
  authenticateWithCredentials,
  type AuthenticateError,
} from '../auth/authSession.service';
import type { AppDispatch } from '../storeTypes';

type PasscodeThunkError = {
  message: string;
};

export const hydratePasscodeThunk = createAsyncThunk<boolean>(
  'passcode/hydrate',
  async () => passcodePreferences.isEnabled(),
);

type ActivatePasscodePayload = {
  passcode: string;
  confirmPasscode: string;
};

export const activatePasscodeThunk = createAsyncThunk<
  void,
  ActivatePasscodePayload,
  { rejectValue: PasscodeThunkError }
>(
  'passcode/activate',
  async ({ passcode, confirmPasscode }, { rejectWithValue }) => {
    const trimmedPasscode = passcode.trim();

    if (trimmedPasscode.length < PASSCODE_PIN_LENGTH) {
      return rejectWithValue({
        message: `Passcode must be ${PASSCODE_PIN_LENGTH} digits`,
      });
    }

    if (trimmedPasscode !== confirmPasscode.trim()) {
      return rejectWithValue({ message: 'Passcodes do not match' });
    }

    const credentials = await KeychainStorage.getCredentials();
    if (!credentials) {
      return rejectWithValue({
        message: 'Log in once with username and password before activating passcode',
      });
    }

    await KeychainStorage.savePasscode(trimmedPasscode);
    passcodePreferences.setEnabled(true);
  },
);

type PasscodeLoginPayload = {
  passcode: string;
};

export const passcodeLoginThunk = createAsyncThunk<
  void,
  PasscodeLoginPayload,
  { rejectValue: PasscodeThunkError; dispatch: AppDispatch }
>(
  'passcode/login',
  async ({ passcode }, { dispatch, rejectWithValue }) => {
    const trimmedPasscode = passcode.trim();

    if (!trimmedPasscode) {
      return rejectWithValue({ message: 'Enter your passcode' });
    }

    const storedPasscode = await KeychainStorage.getPasscode();
    if (!storedPasscode || storedPasscode !== trimmedPasscode) {
      return rejectWithValue({ message: 'Incorrect passcode' });
    }

    const credentials = await KeychainStorage.getCredentials();
    if (!credentials) {
      return rejectWithValue({
        message: 'Saved credentials not found. Log in with password first.',
      });
    }

    try {
      await authenticateWithCredentials(dispatch, credentials);
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as AuthenticateError).message === 'string'
          ? (error as AuthenticateError).message
          : 'Login failed';

      return rejectWithValue({ message });
    }
  },
);
