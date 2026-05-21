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

  it('starts disabled with empty passcodes', () => {
    const { result } = renderHook(() => usePasscodeSetupScreen());

    expect(result.current.isDisabled).toBe(true);
  });

  it('dispatches activatePasscodeThunk', async () => {
    const { result } = renderHook(() => usePasscodeSetupScreen());

    act(() => {
      result.current.onPasscodeChange('1234');
      result.current.onConfirmPasscodeChange('1234');
    });

    await act(async () => {
      await result.current.onActivate();
    });

    expect(mockedActivatePasscodeThunk).toHaveBeenCalledWith({
      passcode: '1234',
      confirmPasscode: '1234',
    });
    expect(dispatchMock).toHaveBeenCalled();
  });
});
