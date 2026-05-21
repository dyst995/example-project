import { RootState } from '..';

export const selectActivityCount = (state: RootState) =>
  state.dashboard.activityCount;
