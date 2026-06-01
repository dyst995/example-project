import { act, renderHook } from '@testing-library/react-native';
import {
  mockedUseAppSelector,
  setupStoreHooksMock,
} from '../../../../test/storeHooksMock';
import { useLoginScreen } from '../useLoginScreen';

const mockLogin = jest.fn();

jest.mock('../../../../store/auth', () => ({
  useLoginMutation: () => [mockLogin, {}],
}));

const authState = {
  isLoading: false,
  error: null as string | null,
  authenticated: false,
  session: null,
  isHydrated: true,
};

describe('useLoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupStoreHooksMock();
    mockedUseAppSelector.mockImplementation(selector =>
      selector({ auth: authState } as never),
    );
    mockLogin.mockResolvedValue(undefined);
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
    mockedUseAppSelector.mockImplementation(selector =>
      selector({
        auth: { ...authState, isLoading: true },
      } as never),
    );

    const { result } = renderHook(() => useLoginScreen());

    act(() => {
      result.current.onUsernameChange('john');
      result.current.onPasswordChange('secret');
    });

    expect(result.current.isDisabled).toBe(true);
  });

  it('does not call login when form is disabled', async () => {
    const { result } = renderHook(() => useLoginScreen());

    await act(async () => {
      await result.current.onLogin();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login mutation with trimmed username', async () => {
    const { result } = renderHook(() => useLoginScreen());

    act(() => {
      result.current.onUsernameChange('  john  ');
      result.current.onPasswordChange('secret');
    });

    await act(async () => {
      await result.current.onLogin();
    });

    expect(mockLogin).toHaveBeenCalledWith({
      username: 'john',
      password: 'secret',
    });
  });
});
