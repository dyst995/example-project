import * as Keychain from 'react-native-keychain';
import { KeychainStorage } from '../keychain.storage';

const mockedKeychain = Keychain as jest.Mocked<typeof Keychain>;

describe('KeychainStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves credentials to keychain', async () => {
    await KeychainStorage.saveCredentials('user', 'secret');

    expect(mockedKeychain.setGenericPassword).toHaveBeenCalledWith(
      'user',
      'secret',
      expect.objectContaining({ service: 'detoxtestproject.credentials' }),
    );
  });

  it('returns credentials from keychain', async () => {
    mockedKeychain.getGenericPassword.mockResolvedValueOnce({
      username: 'user',
      password: 'secret',
      service: 'detoxtestproject.credentials',
      storage: 'KeystoreAESGCM_NoAuth',
    } as Keychain.UserCredentials);

    await expect(KeychainStorage.getCredentials()).resolves.toEqual({
      username: 'user',
      password: 'secret',
    });
  });

  it('returns null when credentials are missing', async () => {
    mockedKeychain.getGenericPassword.mockResolvedValueOnce(false);

    await expect(KeychainStorage.getCredentials()).resolves.toBeNull();
  });

  it('saves and reads passcode', async () => {
    mockedKeychain.getGenericPassword.mockResolvedValueOnce({
      username: 'passcode',
      password: '1234',
      service: 'detoxtestproject.passcode',
      storage: 'KeystoreAESGCM_NoAuth',
    } as Keychain.UserCredentials);

    await KeychainStorage.savePasscode('1234');

    await expect(KeychainStorage.getPasscode()).resolves.toBe('1234');
  });
});
