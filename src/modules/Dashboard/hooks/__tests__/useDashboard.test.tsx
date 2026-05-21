import { act, renderHook } from '@testing-library/react-native';
import {
  mockedUseAppSelector,
  setupStoreHooksMock,
} from '../../../../test/storeHooksMock';
import { useDashboard } from '../useDashboard';
import {
  incrementActivity,
  resetActivity,
} from '../../../../store/dashboard/dashboard.slice';
import { signOut } from '../../../../store/auth/auth.slice';

describe('useDashboard', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = setupStoreHooksMock({
      selectorState: 0,
    }).dispatch;
    mockedUseAppSelector.mockImplementation(
      (selector: (state: { dashboard: { activityCount: number } }) => number) =>
        selector({ dashboard: { activityCount: 0 } }),
    );
  });

  it('exposes activity count from selector', () => {
    mockedUseAppSelector.mockImplementation(
      (selector: (state: { dashboard: { activityCount: number } }) => number) =>
        selector({ dashboard: { activityCount: 4 } }),
    );

    const { result } = renderHook(() => useDashboard());

    expect(result.current.activityCount).toBe(4);
  });

  it('dispatches incrementActivity', () => {
    const { result } = renderHook(() => useDashboard());

    act(() => {
      result.current.onIncrement();
    });

    expect(dispatchMock).toHaveBeenCalledWith(incrementActivity());
  });

  it('dispatches resetActivity', () => {
    const { result } = renderHook(() => useDashboard());

    act(() => {
      result.current.onReset();
    });

    expect(dispatchMock).toHaveBeenCalledWith(resetActivity());
  });

  it('dispatches signOut on logout', () => {
    const { result } = renderHook(() => useDashboard());

    act(() => {
      result.current.onLogout();
    });

    expect(dispatchMock).toHaveBeenCalledWith(signOut());
  });
});
