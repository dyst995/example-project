import { render } from '@testing-library/react-native';
import { PasscodeLoginScreen } from '../PasscodeLoginScreen';
import { usePasscodeLoginScreen } from '../../hooks';

jest.mock('../../hooks', () => ({
  usePasscodeLoginScreen: jest.fn(),
}));

const mockedHook = usePasscodeLoginScreen as jest.MockedFunction<
  typeof usePasscodeLoginScreen
>;

describe('PasscodeLoginScreen', () => {
  const onPinComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedHook.mockReturnValue({
      pin: '',
      isUnlocking: false,
      error: null,
      onPinChange: jest.fn(),
      onPinComplete,
    });
  });

  it('renders passcode pin pad', () => {
    const { getByText, getByTestId } = render(<PasscodeLoginScreen />);

    expect(getByText('Enter passcode')).toBeVisible();
    expect(getByTestId('passcode-login-pin-dots')).toBeVisible();
    expect(getByTestId('passcode-login-pin-key-1')).toBeVisible();
  });

  it('shows error message', () => {
    mockedHook.mockReturnValue({
      pin: '12',
      isUnlocking: false,
      error: 'Incorrect passcode',
      onPinChange: jest.fn(),
      onPinComplete,
    });

    const { getByTestId } = render(<PasscodeLoginScreen />);

    expect(getByTestId('passcode-login-error')).toHaveTextContent(
      'Incorrect passcode',
    );
  });
});
