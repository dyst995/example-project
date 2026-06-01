import { fireEvent, render } from '@testing-library/react-native';
import { LoginScreen } from '../../screens';
import { useLoginScreen } from '../../hooks';

jest.mock('../../hooks', () => ({
  useLoginScreen: jest.fn(),
}));

const mockedUseLoginScreen = useLoginScreen as jest.MockedFunction<
  typeof useLoginScreen
>;

describe('LoginScreen', () => {
  const onUsernameChange = jest.fn();
  const onPasswordChange = jest.fn();
  const onLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoginScreen.mockReturnValue({
      isDisabled: false,
      username: 'niko',
      password: 'secret',
      error: null,
      onUsernameChange,
      onPasswordChange,
      onLogin,
    });
  });

  it('renders title and subtitle', () => {
    const { getByText } = render(<LoginScreen />);

    expect(getByText('Welcome back')).toBeVisible();
    expect(getByText('Sign in to continue')).toBeVisible();
  });

  it('renders all controls and maps hook values', () => {
    const { getByTestId } = render(<LoginScreen />);

    expect(getByTestId('login-username-input').props.value).toBe('niko');
    expect(getByTestId('login-password-input').props.value).toBe('secret');
  });

  it('calls change handlers from hook', () => {
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId('login-username-input'), 'john');
    fireEvent.changeText(getByTestId('login-password-input'), '123456');

    expect(onUsernameChange).toHaveBeenCalledWith('john');
    expect(onPasswordChange).toHaveBeenCalledWith('123456');
  });

  it('calls login handler on submit press', () => {
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.press(getByTestId('login-submit-button'));

    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('does not trigger login when hook marks form disabled', () => {
    mockedUseLoginScreen.mockReturnValue({
      isDisabled: true,
      username: '',
      password: '',
      error: null,
      onUsernameChange,
      onPasswordChange,
      onLogin,
    });

    const { getByTestId } = render(<LoginScreen />);

    fireEvent.press(getByTestId('login-submit-button'));

    expect(onLogin).not.toHaveBeenCalled();
  });
});
