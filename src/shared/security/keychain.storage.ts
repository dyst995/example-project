import * as Keychain from 'react-native-keychain';

const CREDENTIALS_SERVICE = 'detoxtestproject.credentials';
const PASSCODE_SERVICE = 'detoxtestproject.passcode';

export type StoredCredentials = {
  username: string;
  password: string;
};

export const KeychainStorage = {
  async saveCredentials(username: string, password: string): Promise<void> {
    await Keychain.setGenericPassword(username, password, {
      service: CREDENTIALS_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
  },

  async getCredentials(): Promise<StoredCredentials | null> {
    const result = await Keychain.getGenericPassword({
      service: CREDENTIALS_SERVICE,
    });

    if (!result) {
      return null;
    }

    return {
      username: result.username,
      password: result.password,
    };
  },

  async savePasscode(passcode: string): Promise<void> {
    await Keychain.setGenericPassword('passcode', passcode, {
      service: PASSCODE_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
  },

  async getPasscode(): Promise<string | null> {
    const result = await Keychain.getGenericPassword({
      service: PASSCODE_SERVICE,
    });

    if (!result) {
      return null;
    }

    return result.password;
  },

  async clearPasscode(): Promise<void> {
    await Keychain.resetGenericPassword({ service: PASSCODE_SERVICE });
  },
};
