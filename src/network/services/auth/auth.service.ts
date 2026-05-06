import { BaseService } from '../../core';
import { AuthRoutes } from './routes';
import type { LoginRequestDto, LoginResponseDto } from './types/login.types';

class AuthServiceClass extends BaseService {
  constructor() {
    super();
  }

  public login(data: LoginRequestDto) {
    return this.post<LoginResponseDto>(AuthRoutes.login, data);
  }
}

export const AuthService = new AuthServiceClass();
