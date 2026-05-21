import { act, renderHook } from '@testing-library/react-native';
import { setupStoreHooksMock } from '../../../../test/storeHooksMock';
import { usePasscodeSetupScreen } from '../usePasscodeSetupScreen';
import { activatePasscodeThunk } from '../../../../store/passcode/passcode.thunk';

jest.mock('../../../../store/passcode/passcode.thunk', () => ({
  activatePasscodeThunk: jest.fn(),
}));

const mockedActivatePasscodeThunk = activatePasscodeThunk as jest.MockedFunction<
  typeof activatePasscodeThunk
>;

describe('usePasscodeSetupScreen', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchMock = setupStoreHooksMock({
      selectorState: {
        isActivating: false,
        error: null,
      },
    }).dispatch;
    mockedActivatePasscodeThunk.mockReturnValue({
      type: 'passcode/activate/pending',
    } as any);
  });

  it('moves to confirm step after create pin is completed', async () => {
    const { result } = renderHook(() => usePasscodeSetupScreen());

    await act(async () => {
      await result.current.onPinComplete('1234');
    });

    expect(result.current.step).toBe('confirm');
    expect(result.current.stepTitle).toBe('Confirm passcode');
    expect(mockedActivatePasscodeThunk).not.toHaveBeenCalled();
  });

  it('dispatches activatePasscodeThunk after confirm pin is completed', async () => {
    const { result } = renderHook(() => usePasscodeSetupScreen());

    await act(async () => {
      await result.current.onPinComplete('1234');
    });

    await act(async () => {
      await result.current.onPinComplete('1234');
    });

    expect(mockedActivatePasscodeThunk).toHaveBeenCalledWith({
      passcode: '1234',
      confirmPasscode: '1234',
    });
    expect(dispatchMock).toHaveBeenCalled();
  });
});
