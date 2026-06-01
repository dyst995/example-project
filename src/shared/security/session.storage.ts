import { createMMKV } from 'react-native-mmkv';

import type { AuthSession } from '../../domain/models/session';

const storage = createMMKV({ id: 'auth-session' });

const SESSION_KEY = 'session';

export const SessionStorage = {
  save(session: AuthSession): void {
    storage.set(SESSION_KEY, JSON.stringify(session));
  },

  load(): AuthSession | null {
    const raw = storage.getString(SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  clear(): void {
    storage.remove(SESSION_KEY);
  },
};
