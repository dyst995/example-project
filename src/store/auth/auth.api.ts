import type { AuthSession } from '../../domain/models/session';
import type { LoginCredentials } from '../../domain/models/loginCredentials';
import { AuthService } from '../../network/services/auth/auth.service';
import {
  toAuthSession,
  toLoginRequestDto,
} from '../../network/services/auth/mappers/auth.mapper';
import type { RefreshTokenRequestDto } from '../../network/services/auth/types/login.types';
import { normalizeApiError } from '../../network/utils/normalizeApiError';
import { KeychainStorage } from '../../shared/security/keychain.storage';
import { SessionStorage } from '../../shared/security/session.storage';
import { baseApi } from '../api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthSession, LoginCredentials>({
      async queryFn(credentials) {
        try {
          const response = await AuthService.login(toLoginRequestDto(credentials));
          return { data: toAuthSession(response.data) };
        } catch (error) {
          return { error: normalizeApiError(error) };
        }
      },
      async onQueryStarted(credentials, { queryFulfilled }) {
        try {
          const { data: session } = await queryFulfilled;
          SessionStorage.save(session);
          await KeychainStorage.saveCredentials(
            credentials.username,
            credentials.password,
          );
        } catch {
          // Slice handles rejected state; avoid throwing from side effects.
        }
      },
      invalidatesTags: ['Auth'],
    }),
    refreshSession: build.mutation<AuthSession, RefreshTokenRequestDto>({
      async queryFn(body) {
        try {
          const response = await AuthService.refreshToken(body);
          return { data: toAuthSession(response.data) };
        } catch (error) {
          return { error: normalizeApiError(error) };
        }
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data: session } = await queryFulfilled;
          SessionStorage.save(session);
        } catch {
          // Caller handles refresh failure.
        }
      },
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRefreshSessionMutation } = authApi;
