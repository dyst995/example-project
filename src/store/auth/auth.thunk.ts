import { createAsyncThunk } from '@reduxjs/toolkit';

import { AuthService } from '../../network/services/auth/auth.service';
import { KeychainStorage } from '../../shared/security/keychain.storage';
import type { LoginRequestDto } from '../../network/services/auth/types/login.types';

type LoginThunkError = {
  message: string;
};

export const loginThunk = createAsyncThunk<
  string,
  LoginRequestDto,
  { rejectValue: LoginThunkError }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await AuthService.login(payload);
    await KeychainStorage.saveCredentials(payload.username, payload.password);
    return response.data.accessToken;
  } catch (error: unknown) {
    const message =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Login failed';

    return rejectWithValue({ message });
  }
});
