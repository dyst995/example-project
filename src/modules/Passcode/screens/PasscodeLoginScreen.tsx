import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { PasscodePinPad } from '../../../shared/components/Passcode';
import { usePasscodeLoginScreen } from '../hooks';

type Props = {};

export const PasscodeLoginScreen: React.FC<Props> = () => {
  const { pin, isUnlocking, error, onPinChange, onPinComplete } =
    usePasscodeLoginScreen();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Enter passcode</Text>
        <Text style={styles.subtitle}>Unlock with your passcode to continue</Text>

        {isUnlocking ? (
          <ActivityIndicator
            style={styles.loader}
            testID="passcode-login-loading"
          />
        ) : null}

        <PasscodePinPad
          value={pin}
          onChange={onPinChange}
          onComplete={onPinComplete}
          disabled={isUnlocking}
          testIDPrefix="passcode-login"
        />

        {error ? (
          <Text style={styles.error} testID="passcode-login-error">
            {error}
          </Text>
        ) : null}
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
    alignItems: 'center',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 12,
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
});
