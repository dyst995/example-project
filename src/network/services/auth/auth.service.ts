import { BaseService } from '../../core';
import { AuthRoutes } from './routes';
import type { LoginRequestDto, LoginResponseDto } from './types/login.types';

export class AuthService extends BaseService {
  public login(data: LoginRequestDto) {
    return this.post<LoginResponseDto>(AuthRoutes.login, data);
  }
}
