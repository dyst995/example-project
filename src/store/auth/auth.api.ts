import type { AuthSession } from '../../domain/models/session';
import type { ApiError } from '../../network/core/types';
import { AuthRoutes } from '../../network/services/auth/routes';
import { toAuthSession } from '../../network/services/auth/mappers/auth.mapper';
import type {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
} from '../../network/services/auth/types/login.types';
import { KeychainStorage } from '../../shared/security/keychain.storage';
import { SessionStorage } from '../../shared/security/session.storage';
import { baseApi } from '../api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthSession, LoginRequestDto>({
      query: credentials => ({
        url: AuthRoutes.login,
        method: 'POST',
        data: credentials,
      }),
      transformResponse: (response: LoginResponseDto) => toAuthSession(response),
      transformErrorResponse: (error: ApiError) => error,
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
      query: body => ({
        url: AuthRoutes.refresh,
        method: 'POST',
        data: body,
      }),
      transformResponse: (response: LoginResponseDto) => toAuthSession(response),
      transformErrorResponse: (error: ApiError) => error,
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
