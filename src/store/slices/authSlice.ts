import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  authenticated: boolean;
  token: string | null;
};

const initialState: AuthState = {
  authenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<string>) {
      state.authenticated = true;
      state.token = action.payload;
    },
    signOut(state) {
      state.authenticated = false;
      state.token = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
