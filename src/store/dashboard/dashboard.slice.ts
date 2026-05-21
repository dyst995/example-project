import { createSlice } from '@reduxjs/toolkit';

type DashboardState = {
  activityCount: number;
};

const initialState: DashboardState = {
  activityCount: 0,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    incrementActivity(state) {
      state.activityCount += 1;
    },
    resetActivity(state) {
      state.activityCount = 0;
    },
  },
});

export const { incrementActivity, resetActivity } = dashboardSlice.actions;
export default dashboardSlice.reducer;
