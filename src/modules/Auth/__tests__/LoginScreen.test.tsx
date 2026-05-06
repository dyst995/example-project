import { fireEvent, render } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

describe('LoginScren', () => {
  it('renders title and subtitle', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Welcome back')).toBeVisible();
    expect(getByText('Sign in to continue')).toBeVisible();
  });

  it('pressing enabled submit does not crash', () => {
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId('login-username-input'), 'niko');
    fireEvent.changeText(getByTestId('login-password-input'), 'secret');

    expect(() => {
      fireEvent.press(getByTestId('login-submit-button'));
    }).not.toThrow();
  });
});
