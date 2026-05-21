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
    mockedUseAppSelector.mockImplementation(selector =>
      selector({
        dashboard: { activityCount: 0 },
        passcode: { isEnabled: false },
      } as never),
    );
  });

  it('exposes activity count and passcode flag from selectors', () => {
    mockedUseAppSelector.mockImplementation(selector =>
      selector({
        dashboard: { activityCount: 4 },
        passcode: { isEnabled: true },
      } as never),
    );

    const { result } = renderHook(() => useDashboard());

    expect(result.current.activityCount).toBe(4);
    expect(result.current.passcodeEnabled).toBe(true);
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
