import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { DefaultInput } from '../DefaultInput';

describe('DefaultInput', () => {
  it('renders label when provided', () => {
    const { getByText } = render(<DefaultInput label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('passes through placeholder and value', () => {
    const { getByPlaceholderText } = render(
      <DefaultInput placeholder="Enter email" value="test@example.com" />,
    );
    expect(getByPlaceholderText('Enter email').props.value).toBe(
      'test@example.com',
    );
  });

  it('calls onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <DefaultInput placeholder="Password" onChangeText={onChangeText} />,
    );
    fireEvent.changeText(getByPlaceholderText('Password'), 'secret123');
    expect(onChangeText).toHaveBeenCalledWith('secret123');
  });

  it('accepts testID', () => {
    const { getByTestId } = render(<DefaultInput testID="email-input" />);
    expect(getByTestId('email-input')).toBeTruthy();
  });
});
