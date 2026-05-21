import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../store/hooks';
import { selectPasscodeEnabled } from '../../../store/passcode/passcode.selector';
import { PasscodePinPad } from '../../../shared/components/Passcode';
import { usePasscodeSetupScreen } from '../hooks';

type Props = {};

export const PasscodeSetupScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const passcodeEnabled = useAppSelector(selectPasscodeEnabled);
  const {
    pin,
    stepTitle,
    stepSubtitle,
    isActivating,
    error,
    onPinChange,
    onPinComplete,
  } = usePasscodeSetupScreen();

  useEffect(() => {
    if (passcodeEnabled) {
      navigation.goBack();
    }
  }, [navigation, passcodeEnabled]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Activate passcode</Text>
        <Text style={styles.subtitle}>
          Your username and password stay saved securely in the keychain.
        </Text>

        <Text style={styles.stepTitle} testID="passcode-setup-step-title">
          {stepTitle}
        </Text>
        <Text style={styles.stepSubtitle}>{stepSubtitle}</Text>

        {isActivating ? (
          <ActivityIndicator
            style={styles.loader}
            testID="passcode-setup-loading"
          />
        ) : null}

        <PasscodePinPad
          value={pin}
          onChange={onPinChange}
          onComplete={onPinComplete}
          disabled={isActivating}
          testIDPrefix="passcode-setup"
        />

        {error ? (
          <Text style={styles.error} testID="passcode-setup-error">
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
    marginBottom: 20,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
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
