import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DefaultInput } from '../../../shared/components/Inputs';
import { DefaultButton } from '../../../shared/components/Buttons';
import { useLoginScreen } from '../hooks';

type Props = {};

export const LoginScreen: React.FC<Props> = () => {
  const {
    isDisabled,
    username,
    password,
    onUsernameChange,
    onPasswordChange,
    onLogin,
  } = useLoginScreen();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <DefaultInput
          label="Username"
          value={username}
          onChangeText={onUsernameChange}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter your username"
          testID="login-username-input"
        />

        <DefaultInput
          label="Password"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter your password"
          containerStyle={styles.passwordInput}
          testID="login-password-input"
        />

        <DefaultButton
          title="Log in"
          onPress={onLogin}
          disabled={isDisabled}
          style={styles.loginButton}
          testID="login-submit-button"
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
  passwordInput: {
    marginTop: 12,
  },
  loginButton: {
    marginTop: 20,
  },
});
