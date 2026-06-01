import type { LoginCredentials } from '../../domain/models/loginCredentials';
import type { AuthSession } from '../../domain/models/session';
import type { StoredCredentials } from '../../shared/security/keychain.storage';
import { isApiError } from '../../network/utils/normalizeApiError';
import type { AppDispatch } from '../storeTypes';
import { authApi } from './auth.api';

export type AuthenticateError = {
  message: string;
};

export const authenticateWithCredentials = async (
  dispatch: AppDispatch,
  credentials: StoredCredentials | LoginCredentials,
): Promise<AuthSession> => {
  try {
    return await dispatch(
      authApi.endpoints.login.initiate({
        username: credentials.username,
        password: credentials.password,
      }),
    ).unwrap();
  } catch (error: unknown) {
    throw {
      message: isApiError(error) ? error.message : 'Login failed',
    } satisfies AuthenticateError;
  }
};
