import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { PasscodePinPad } from '../Passcode/PasscodePinPad';

const PinPadHarness = ({
  onComplete,
}: {
  onComplete?: (value: string) => void;
}) => {
  const [value, setValue] = useState('');

  return (
    <PasscodePinPad
      value={value}
      onChange={setValue}
      onComplete={onComplete}
      testIDPrefix="test-pin"
    />
  );
};

describe('PasscodePinPad', () => {
  it('renders pin dots and keypad keys', () => {
    const { getByTestId } = render(<PinPadHarness />);

    expect(getByTestId('test-pin-pin-dots')).toBeVisible();
    expect(getByTestId('test-pin-pin-key-1')).toBeVisible();
    expect(getByTestId('test-pin-pin-key-0')).toBeVisible();
    expect(getByTestId('test-pin-pin-backspace')).toBeVisible();
  });

  it('calls onComplete when four digits are entered', () => {
    const onComplete = jest.fn();
    const { getByTestId } = render(<PinPadHarness onComplete={onComplete} />);

    fireEvent.press(getByTestId('test-pin-pin-key-1'));
    fireEvent.press(getByTestId('test-pin-pin-key-2'));
    fireEvent.press(getByTestId('test-pin-pin-key-3'));
    fireEvent.press(getByTestId('test-pin-pin-key-4'));

    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('removes last digit on backspace', () => {
    const onChange = jest.fn();

    const { getByTestId } = render(
      <PasscodePinPad value="12" onChange={onChange} testIDPrefix="test-pin" />,
    );

    fireEvent.press(getByTestId('test-pin-pin-backspace'));

    expect(onChange).toHaveBeenCalledWith('1');
  });
});
