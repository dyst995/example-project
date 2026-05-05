import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { DefaultButton } from '../DefaultButton';

describe('DefaultButton', () => {
  it('renders titles', () => {
    const { getByText } = render(
      <DefaultButton title="Sign In" onPress={jest.fn()} />,
    );
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DefaultButton title="Continue" onPress={onPress} />,
    );
    fireEvent.press(getByText('Continue'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DefaultButton title="Continue" disabled={true} onPress={onPress} />,
    );
    fireEvent.press(getByText('Continue'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('accepts testID', () => {
    const { getByTestId } = render(
      <DefaultButton
        title="Continue"
        testID="continue-button"
        onPress={jest.fn()}
      />,
    );
    expect(getByTestId('continue-button')).toBeTruthy();
  });
});
