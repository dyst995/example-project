import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

type DefaultButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  testID,
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      testID={testID}>
      <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  disabled: {
    backgroundColor: '#9CA3AF',
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#F9FAFB',
  },
});
