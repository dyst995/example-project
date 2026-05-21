import { act, renderHook } from '@testing-library/react-native';
import { setupStoreHooksMock } from '../../../../test/storeHooksMock';
import { usePasscodeLoginScreen } from '../usePasscodeLoginScreen';
import { passcodeLoginThunk } from '../../../../store/passcode/passcode.thunk';

jest.mock('../../../../store/passcode/passcode.thunk', () => ({
  passcodeLoginThunk: jest.fn(),
}));

const mockedPasscodeLoginThunk = passcodeLoginThunk as jest.MockedFunction<
  typeof passcodeLoginThunk
>;

describe('usePasscodeLoginScreen', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = setupStoreHooksMock({
      selectorState: {
        isUnlocking: false,
        error: null,
      },
    }).dispatch;
    mockedPasscodeLoginThunk.mockReturnValue({
      type: 'passcode/login/pending',
    } as any);
  });

  it('does not unlock with empty passcode', async () => {
    const { result } = renderHook(() => usePasscodeLoginScreen());

    await act(async () => {
      await result.current.onUnlock();
    });

    expect(mockedPasscodeLoginThunk).not.toHaveBeenCalled();
  });

  it('dispatches passcodeLoginThunk', async () => {
    const { result } = renderHook(() => usePasscodeLoginScreen());

    act(() => {
      result.current.onPasscodeChange('1234');
    });

    await act(async () => {
      await result.current.onUnlock();
    });

    expect(mockedPasscodeLoginThunk).toHaveBeenCalledWith({ passcode: '1234' });
    expect(dispatchMock).toHaveBeenCalled();
  });
});
