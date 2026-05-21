import { render } from '@testing-library/react-native';
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
  beforeEach(() => {
    jest.clearAllMocks();
    mockedHook.mockReturnValue({
      pin: '',
      step: 'create',
      stepTitle: 'Create passcode',
      stepSubtitle: 'Choose a 4-digit passcode',
      isActivating: false,
      error: null,
      onPinChange: jest.fn(),
      onPinComplete: jest.fn(),
    });
  });

  it('renders passcode pin pad for setup', () => {
    const { getByTestId } = render(<PasscodeSetupScreen />);

    expect(getByTestId('passcode-setup-step-title')).toHaveTextContent(
      'Create passcode',
    );
    expect(getByTestId('passcode-setup-pin-dots')).toBeVisible();
    expect(getByTestId('passcode-setup-pin-key-1')).toBeVisible();
  });
});
