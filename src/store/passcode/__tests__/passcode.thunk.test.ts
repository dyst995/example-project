import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../auth/auth.slice';
import passcodeReducer from '../passcode.slice';
import {
  activatePasscodeThunk,
  hydratePasscodeThunk,
  passcodeLoginThunk,
} from '../passcode.thunk';
import { KeychainStorage } from '../../../shared/security/keychain.storage';
import { passcodePreferences } from '../../../shared/storage/passcodePreferences';
jest.mock('../../../network/services/auth/auth.service', () => ({
  AuthService: {
    login: jest.fn(),
  },
}));

jest.mock('../../../shared/security/keychain.storage', () => ({
  KeychainStorage: {
    saveCredentials: jest.fn(),
    getCredentials: jest.fn(),
    savePasscode: jest.fn(),
    getPasscode: jest.fn(),
    clearPasscode: jest.fn(),
  },
}));

jest.mock('../../../shared/storage/passcodePreferences', () => ({
  passcodePreferences: {
    isEnabled: jest.fn(),
    setEnabled: jest.fn(),
  },
}));

import { AuthService } from '../../../network/services/auth/auth.service';

const mockedKeychain = KeychainStorage as jest.Mocked<typeof KeychainStorage>;
const mockedPreferences = passcodePreferences as jest.Mocked<
  typeof passcodePreferences
>;
const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      passcode: passcodeReducer,
    },
  });

describe('passcode thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPreferences.isEnabled.mockReturnValue(false);
    mockedAuthService.login.mockResolvedValue({
      data: { accessToken: 'token-123' },
    } as any);
  });

  it('hydrates passcode enabled flag from preferences', async () => {
    mockedPreferences.isEnabled.mockReturnValue(true);
    const store = createStore();

    await store.dispatch(hydratePasscodeThunk());

    expect(store.getState().passcode.isEnabled).toBe(true);
    expect(store.getState().passcode.isHydrated).toBe(true);
  });

  it('rejects activation when passcodes do not match', async () => {
    const store = createStore();

    const result = await store.dispatch(
      activatePasscodeThunk({ passcode: '1234', confirmPasscode: '9999' }),
    );

    expect(activatePasscodeThunk.rejected.match(result)).toBe(true);
    expect(store.getState().passcode.error).toBe('Passcodes do not match');
  });

  it('activates passcode when credentials exist', async () => {
    mockedKeychain.getCredentials.mockResolvedValue({
      username: 'user',
      password: 'secret',
    });
    const store = createStore();

    const result = await store.dispatch(
      activatePasscodeThunk({ passcode: '1234', confirmPasscode: '1234' }),
    );

    expect(activatePasscodeThunk.fulfilled.match(result)).toBe(true);
    expect(mockedKeychain.savePasscode).toHaveBeenCalledWith('1234');
    expect(mockedPreferences.setEnabled).toHaveBeenCalledWith(true);
    expect(store.getState().passcode.isEnabled).toBe(true);
  });

  it('rejects passcode login for incorrect passcode', async () => {
    mockedKeychain.getPasscode.mockResolvedValue('1234');
    const store = createStore();

    const result = await store.dispatch(
      passcodeLoginThunk({ passcode: '0000' }),
    );

    expect(passcodeLoginThunk.rejected.match(result)).toBe(true);
    expect(store.getState().passcode.error).toBe('Incorrect passcode');
  });

  it('logs in with keychain credentials after valid passcode', async () => {
    mockedKeychain.getPasscode.mockResolvedValue('1234');
    mockedKeychain.getCredentials.mockResolvedValue({
      username: 'user',
      password: 'secret',
    });

    const store = createStore();

    const result = await store.dispatch(passcodeLoginThunk({ passcode: '1234' }));

    expect(passcodeLoginThunk.fulfilled.match(result)).toBe(true);
    expect(mockedAuthService.login).toHaveBeenCalledWith({
      username: 'user',
      password: 'secret',
    });
    expect(store.getState().auth.authenticated).toBe(true);
    expect(store.getState().auth.token).toBe('token-123');
  });
});
