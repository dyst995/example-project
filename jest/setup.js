// Include this line for mocking react-native-gesture-handler
// import 'react-native-gesture-handler/jestSetup';

// Include this section for mocking react-native-reanimated
// import { setUpTests } from 'react-native-reanimated';

// setUpTests();

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
import { jest } from '@jest/globals';

try {
  jest.mock('react-native/src/private/animated/NativeAnimatedHelper');
} catch {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
}

jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: { WHEN_UNLOCKED: 'WHEN_UNLOCKED' },
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('react-native-mmkv', () => {
  const stores = new Map();

  return {
    createMMKV: jest.fn(({ id }) => {
      if (!stores.has(id)) {
        stores.set(id, new Map());
      }
      const store = stores.get(id);

      return {
        getBoolean: jest.fn(key => store.get(key) ?? false),
        getString: jest.fn(key => {
          const value = store.get(key);
          return typeof value === 'string' ? value : undefined;
        }),
        set: jest.fn((key, value) => {
          store.set(key, value);
        }),
        remove: jest.fn(key => {
          store.delete(key);
        }),
      };
    }),
  };
});
