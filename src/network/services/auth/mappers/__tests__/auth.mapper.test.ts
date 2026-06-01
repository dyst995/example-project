import { toAuthSession, toLoginRequestDto } from '../auth.mapper';

describe('toLoginRequestDto', () => {
  it('maps domain credentials to login request dto', () => {
    expect(
      toLoginRequestDto({
        username: 'niko',
        password: 'secret',
      }),
    ).toEqual({
      username: 'niko',
      password: 'secret',
    });
  });
});

describe('toAuthSession', () => {
  it('maps login response dto to domain session', () => {
    expect(
      toAuthSession({
        accessToken: 'access',
        refreshToken: 'refresh',
      }),
    ).toEqual({
      accessToken: 'access',
      refreshToken: 'refresh',
    });
  });
});
