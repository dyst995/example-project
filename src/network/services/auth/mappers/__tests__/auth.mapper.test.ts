import { toAuthSession } from '../auth.mapper';

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
