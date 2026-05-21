import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PASSCODE_PIN_LENGTH } from '../../constants/passcode';

const PIN_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;

export type PasscodePinPadProps = {
  value: string;
  length?: number;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  testIDPrefix: string;
};

export const PasscodePinPad: React.FC<PasscodePinPadProps> = ({
  value,
  length = PASSCODE_PIN_LENGTH,
  onChange,
  onComplete,
  disabled = false,
  testIDPrefix,
}) => {
  const handleDigitPress = (digit: string) => {
    if (disabled || value.length >= length) {
      return;
    }

    const next = `${value}${digit}`;
    onChange(next);

    if (next.length === length) {
      onComplete?.(next);
    }
  };

  const handleBackspace = () => {
    if (disabled || value.length === 0) {
      return;
    }

    onChange(value.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.dots} testID={`${testIDPrefix}-pin-dots`}>
        {Array.from({ length }).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index < value.length && styles.dotFilled]}
          />
        ))}
      </View>

      <View style={styles.keypad}>
        {PIN_KEYS.slice(0, 9).map(digit => (
          <Pressable
            key={digit}
            accessibilityRole="button"
            accessibilityLabel={`Digit ${digit}`}
            disabled={disabled}
            onPress={() => handleDigitPress(digit)}
            style={({ pressed }) => [
              styles.key,
              pressed && !disabled && styles.keyPressed,
              disabled && styles.keyDisabled,
            ]}
            testID={`${testIDPrefix}-pin-key-${digit}`}>
            <Text style={styles.keyText}>{digit}</Text>
          </Pressable>
        ))}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Backspace"
          disabled={disabled || value.length === 0}
          onPress={handleBackspace}
          style={({ pressed }) => [
            styles.key,
            pressed && !disabled && styles.keyPressed,
            (disabled || value.length === 0) && styles.keyDisabled,
          ]}
          testID={`${testIDPrefix}-pin-backspace`}>
          <Text style={styles.keyText}>⌫</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Digit 0"
          disabled={disabled}
          onPress={() => handleDigitPress('0')}
          style={({ pressed }) => [
            styles.key,
            pressed && !disabled && styles.keyPressed,
            disabled && styles.keyDisabled,
          ]}
          testID={`${testIDPrefix}-pin-key-0`}>
          <Text style={styles.keyText}>0</Text>
        </Pressable>

        <View style={styles.keyPlaceholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  keypad: {
    width: '100%',
    maxWidth: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: '#F3F4F6',
  },
  keyDisabled: {
    opacity: 0.5,
  },
  keyText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#111827',
  },
  keyPlaceholder: {
    width: 72,
    height: 72,
  },
});
