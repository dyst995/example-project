import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

type DefaultInputProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

export const DefaultInput: React.FC<DefaultInputProps> = ({
  label,
  containerStyle,
  style,
  testID,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#9CA3AF"
        style={[styles.input, style]}
        testID={testID}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
});
