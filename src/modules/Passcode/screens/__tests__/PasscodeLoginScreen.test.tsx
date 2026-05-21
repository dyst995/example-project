import { fireEvent, render } from '@testing-library/react-native';
import { PasscodeLoginScreen } from '../PasscodeLoginScreen';
import { usePasscodeLoginScreen } from '../../hooks';

jest.mock('../../hooks', () => ({
  usePasscodeLoginScreen: jest.fn(),
}));

const mockedHook = usePasscodeLoginScreen as jest.MockedFunction<
  typeof usePasscodeLoginScreen
>;

describe('PasscodeLoginScreen', () => {
  const onUnlock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedHook.mockReturnValue({
      passcode: '1234',
      isDisabled: false,
      isUnlocking: false,
      error: null,
      onPasscodeChange: jest.fn(),
      onUnlock,
    });
  });

  it('renders passcode login form', () => {
    const { getByText, getByTestId } = render(<PasscodeLoginScreen />);

    expect(getByText('Enter passcode')).toBeVisible();
    expect(getByTestId('passcode-login-input')).toBeVisible();
    expect(getByTestId('passcode-login-submit-button')).toBeVisible();
  });

  it('calls onUnlock when submit is pressed', () => {
    const { getByTestId } = render(<PasscodeLoginScreen />);

    fireEvent.press(getByTestId('passcode-login-submit-button'));

    expect(onUnlock).toHaveBeenCalledTimes(1);
  });
});
