import { fireEvent, render } from '@testing-library/react-native';
import { PasscodeSetupScreen } from '../PasscodeSetupScreen';
import { usePasscodeSetupScreen } from '../../hooks';

jest.mock('../../hooks', () => ({
  usePasscodeSetupScreen: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('../../../../store/hooks', () => ({
  useAppSelector: jest.fn(() => false),
}));

const mockedHook = usePasscodeSetupScreen as jest.MockedFunction<
  typeof usePasscodeSetupScreen
>;

describe('PasscodeSetupScreen', () => {
  const onActivate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedHook.mockReturnValue({
      passcode: '',
      confirmPasscode: '',
      isDisabled: false,
      isActivating: false,
      error: null,
      onPasscodeChange: jest.fn(),
      onConfirmPasscodeChange: jest.fn(),
      onActivate,
    });
  });

  it('renders activation form', () => {
    const { getByTestId } = render(<PasscodeSetupScreen />);
    expect(getByTestId('passcode-setup-input')).toBeVisible();
    expect(getByTestId('passcode-setup-confirm-input')).toBeVisible();
    expect(getByTestId('passcode-setup-submit-button')).toBeVisible();
  });

  it('calls onActivate when submit is pressed', () => {
    const { getByTestId } = render(<PasscodeSetupScreen />);

    fireEvent.press(getByTestId('passcode-setup-submit-button'));

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('shows error message', () => {
    mockedHook.mockReturnValue({
      passcode: '1234',
      confirmPasscode: '1234',
      isDisabled: false,
      isActivating: false,
      error: 'Passcodes do not match',
      onPasscodeChange: jest.fn(),
      onConfirmPasscodeChange: jest.fn(),
      onActivate,
    });

    const { getByText } = render(<PasscodeSetupScreen />);

    expect(getByText('Passcodes do not match')).toBeVisible();
  });
});
