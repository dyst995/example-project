import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'passcode-preferences' });

const PASSCODE_ENABLED_KEY = 'passcodeEnabled';

export const passcodePreferences = {
  isEnabled(): boolean {
    return storage.getBoolean(PASSCODE_ENABLED_KEY) ?? false;
  },

  setEnabled(enabled: boolean): void {
    storage.set(PASSCODE_ENABLED_KEY, enabled);
  },
};
