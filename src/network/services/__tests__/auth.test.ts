import { AuthService } from '../auth/auth.service';
import { AuthRoutes } from '../auth/routes';
import type {
  LoginRequestDto,
  LoginResponseDto,
} from '../auth/types/login.types';

describe('AuthService', () => {
  const service = AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls post with login route and payload', async () => {
    const payload: LoginRequestDto = {
      username: 'niko',
      password: 'secret',
    };

    const postSpy = jest
      .spyOn(service as any, 'post')
      .mockResolvedValue({ data: { accessToken: 'a', refreshToken: 'r' } });

    await service.login(payload);

    expect(postSpy).toHaveBeenCalledWith(AuthRoutes.login, payload);
  });

  it('returns login response from base service', async () => {
    const payload: LoginRequestDto = {
      username: 'niko',
      password: 'secret',
    };

    const baseResponse = {
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      } as LoginResponseDto,
      status: 200,
      message: 'ok',
      headers: undefined,
    };

    jest.spyOn(service as any, 'post').mockResolvedValue(baseResponse);

    const result = await service.login(payload);

    expect(result).toEqual(baseResponse);
  });
});
