import { useState } from 'react';

import { useLoginMutation } from '../../../store/auth';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selector';
import { useAppSelector } from '../../../store/hooks';

export const useLoginScreen = () => {
  const [login] = useLoginMutation();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isDisabled = !username.trim() || !password.trim() || isLoading;

  const onUsernameChange = (value: string) => {
    setUsername(value);
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
  };

  const onLogin = async () => {
    if (isDisabled) {
      return;
    }

    await login({
      username: username.trim(),
      password,
    });
  };

  return {
    isDisabled,
    username,
    password,
    onUsernameChange,
    onPasswordChange,
    onLogin,
    error: authError,
  };
};
