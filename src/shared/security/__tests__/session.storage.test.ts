import { SessionStorage } from '../session.storage';

describe('SessionStorage', () => {
  beforeEach(() => {
    SessionStorage.clear();
  });

  it('persists and loads auth session', () => {
    const session = {
      accessToken: 'access',
      refreshToken: 'refresh',
    };

    SessionStorage.save(session);

    expect(SessionStorage.load()).toEqual(session);
  });

  it('clears stored session', () => {
    SessionStorage.save({
      accessToken: 'access',
      refreshToken: 'refresh',
    });
    SessionStorage.clear();

    expect(SessionStorage.load()).toBeNull();
  });
});
