import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../store/hooks';
import { selectPasscodeEnabled } from '../../../store/passcode/passcode.selector';
import { DefaultInput } from '../../../shared/components/Inputs';
import { DefaultButton } from '../../../shared/components/Buttons';
import { usePasscodeSetupScreen } from '../hooks';

type Props = {};

export const PasscodeSetupScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const passcodeEnabled = useAppSelector(selectPasscodeEnabled);
  const {
    passcode,
    confirmPasscode,
    isDisabled,
    isActivating,
    error,
    onPasscodeChange,
    onConfirmPasscodeChange,
    onActivate,
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
          Create a passcode to unlock the app. Your username and password stay
          saved securely in the keychain.
        </Text>

        <DefaultInput
          label="Passcode"
          value={passcode}
          onChangeText={onPasscodeChange}
          secureTextEntry
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter passcode"
          testID="passcode-setup-input"
        />

        <DefaultInput
          label="Confirm passcode"
          value={confirmPasscode}
          onChangeText={onConfirmPasscodeChange}
          secureTextEntry
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Confirm passcode"
          containerStyle={styles.confirmInput}
          testID="passcode-setup-confirm-input"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <DefaultButton
          title={isActivating ? 'Activating...' : 'Activate passcode'}
          onPress={onActivate}
          disabled={isDisabled}
          style={styles.submitButton}
          testID="passcode-setup-submit-button"
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
  confirmInput: {
    marginTop: 12,
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
