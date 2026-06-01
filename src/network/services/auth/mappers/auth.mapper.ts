import type { AuthSession } from '../../../../domain/models/session';
import type { LoginCredentials } from '../../../../domain/models/loginCredentials';
import type { LoginRequestDto, LoginResponseDto } from '../types/login.types';

export const toLoginRequestDto = (credentials: LoginCredentials): LoginRequestDto => ({
  username: credentials.username,
  password: credentials.password,
});

export const toAuthSession = (dto: LoginResponseDto): AuthSession => ({
  accessToken: dto.accessToken,
  refreshToken: dto.refreshToken,
});
