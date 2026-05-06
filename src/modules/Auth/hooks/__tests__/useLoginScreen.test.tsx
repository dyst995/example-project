import { act, renderHook } from '@testing-library/react-native';
import {
  mockedUseAppSelector,
  setupStoreHooksMock,
} from '../../../../test/storeHooksMock';
import { useLoginScreen } from '../useLoginScreen';
import { loginThunk } from '../../../../store/auth/auth.thunk';

jest.mock('../../../../store/auth/auth.thunk', () => ({
  loginThunk: jest.fn(),
}));

const mockedLoginThunk = loginThunk as jest.MockedFunction<typeof loginThunk>;

describe('useLoginScreen', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = setupStoreHooksMock({
      selectorState: { isLoading: false },
    }).dispatch;
    mockedLoginThunk.mockReturnValue({ type: 'auth/login/pending' } as any);
    dispatchMock.mockResolvedValue(undefined);
  });

  it('has initial empty state and disabled submit', () => {
    const { result } = renderHook(() => useLoginScreen());

    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isDisabled).toBe(true);
  });

  it('updates username and password', () => {
    const { result } = renderHook(() => useLoginScreen());

    act(() => {
      result.current.onUsernameChange('john');
      result.current.onPasswordChange('secret');
    });

    expect(result.current.username).toBe('john');
    expect(result.current.password).toBe('secret');
    expect(result.current.isDisabled).toBe(false);
  });

  it('keeps submit disabled when loading', () => {
    mockedUseAppSelector.mockReturnValue({ isLoading: true } as any);
    const { result } = renderHook(() => useLoginScreen());

    act(() => {
      result.current.onUsernameChange('john');
      result.current.onPasswordChange('secret');
    });

    expect(result.current.isDisabled).toBe(true);
  });

  it('does not dispatch login when form is disabled', async () => {
    const { result } = renderHook(() => useLoginScreen());

    await act(async () => {
      await result.current.onLogin();
    });

    expect(mockedLoginThunk).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('dispatches login thunk with trimmed username', async () => {
    const { result } = renderHook(() => useLoginScreen());

    act(() => {
      result.current.onUsernameChange('  john  ');
      result.current.onPasswordChange('secret');
    });

    await act(async () => {
      await result.current.onLogin();
    });

    expect(mockedLoginThunk).toHaveBeenCalledWith({
      username: 'john',
      password: 'secret',
    });
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'auth/login/pending' });
  });
});
