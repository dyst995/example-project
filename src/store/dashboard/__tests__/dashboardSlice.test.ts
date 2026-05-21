import dashboardReducer, {
  incrementActivity,
  resetActivity,
} from '../dashboard.slice';

describe('dashboardSlice', () => {
  it('returns initial state', () => {
    const state = dashboardReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({ activityCount: 0 });
  });

  it('increments activity count', () => {
    const state = dashboardReducer(
      { activityCount: 2 },
      incrementActivity(),
    );

    expect(state.activityCount).toBe(3);
  });

  it('resets activity count', () => {
    const state = dashboardReducer({ activityCount: 5 }, resetActivity());

    expect(state.activityCount).toBe(0);
  });
});
