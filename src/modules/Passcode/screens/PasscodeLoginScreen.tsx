import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DefaultInput } from '../../../shared/components/Inputs';
import { DefaultButton } from '../../../shared/components/Buttons';
import { usePasscodeLoginScreen } from '../hooks';

type Props = {};

export const PasscodeLoginScreen: React.FC<Props> = () => {
  const {
    passcode,
    isDisabled,
    isUnlocking,
    error,
    onPasscodeChange,
    onUnlock,
  } = usePasscodeLoginScreen();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Enter passcode</Text>
        <Text style={styles.subtitle}>Unlock with your passcode to continue</Text>

        <DefaultInput
          label="Passcode"
          value={passcode}
          onChangeText={onPasscodeChange}
          secureTextEntry
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter passcode"
          testID="passcode-login-input"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <DefaultButton
          title={isUnlocking ? 'Unlocking...' : 'Unlock'}
          onPress={onUnlock}
          disabled={isDisabled}
          style={styles.submitButton}
          testID="passcode-login-submit-button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  card: {
    borderRadius: 16,
    padding: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 12,
  },
  submitButton: {
    marginTop: 20,
  },
});
