import { act, renderHook } from '@testing-library/react-native';
import { useLoginScreen } from '../useLoginScreen';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { loginThunk } from '../../../../store/auth/auth.thunk';

jest.mock('../../../../store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../../../../store/auth/auth.thunk', () => ({
  loginThunk: jest.fn(),
}));

const mockedUseAppDispatch = useAppDispatch as jest.MockedFunction<
  typeof useAppDispatch
>;
const mockedUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>;
const mockedLoginThunk = loginThunk as jest.MockedFunction<typeof loginThunk>;

describe('useLoginScreen', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAppDispatch.mockReturnValue(dispatchMock);
    mockedUseAppSelector.mockReturnValue({ isLoading: false } as any);
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
