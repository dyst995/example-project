import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ProfileState = {
  fullName: string;
};

const initialState: ProfileState = {
  fullName: '',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setFullName(state, action: PayloadAction<string>) {
      state.fullName = action.payload;
    },
  },
});

export const { setFullName } = profileSlice.actions;
export default profileSlice.reducer;
