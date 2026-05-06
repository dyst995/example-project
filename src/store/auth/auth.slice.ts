import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { loginThunk } from './auth.thunk';

type AuthState = {
  authenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  authenticated: false,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<string>) {
      state.authenticated = true;
      state.token = action.payload;
      state.error = null;
    },
    signOut(state) {
      state.authenticated = false;
      state.token = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authenticated = true;
        state.token = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.authenticated = false;
        state.token = null;
        state.error = action.payload?.message ?? 'Login failed';
      });
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
