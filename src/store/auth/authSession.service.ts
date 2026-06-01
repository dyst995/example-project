import type { AuthSession } from '../../domain/models/session';
import type { LoginRequestDto } from '../../network/services/auth/types/login.types';
import type { StoredCredentials } from '../../shared/security/keychain.storage';
import { isApiError } from '../../network/utils/normalizeApiError';
import type { AppDispatch } from '../storeTypes';
import { authApi } from './auth.api';

export type AuthenticateError = {
  message: string;
};

export const authenticateWithCredentials = async (
  dispatch: AppDispatch,
  credentials: StoredCredentials | LoginRequestDto,
): Promise<AuthSession> => {
  try {
    return await dispatch(authApi.endpoints.login.initiate(credentials)).unwrap();
  } catch (error: unknown) {
    throw {
      message: isApiError(error) ? error.message : 'Login failed',
    } satisfies AuthenticateError;
  }
};
