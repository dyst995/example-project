import { createAsyncThunk } from '@reduxjs/toolkit';

import { SessionStorage } from '../../shared/security/session.storage';
import { signOut } from './auth.slice';

export const hydrateSessionThunk = createAsyncThunk(
  'auth/hydrateSession',
  async () => SessionStorage.load(),
);

export const signOutThunk = createAsyncThunk('auth/signOut', async (_, { dispatch }) => {
  SessionStorage.clear();
  dispatch(signOut());
});
