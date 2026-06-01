import type { AuthSession } from '../../../../domain/models/session';
import type { LoginResponseDto } from '../types/login.types';

export const toAuthSession = (dto: LoginResponseDto): AuthSession => ({
  accessToken: dto.accessToken,
  refreshToken: dto.refreshToken,
});
