import { useState } from 'react';

export const useLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isDisabled = !username.trim() || !password.trim();

  const onUsernameChange = (value: string) => {
    setUsername(value);
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
  };

  const onLogin = () => {};

  return {
    isDisabled,
    username,
    password,
    onUsernameChange,
    onPasswordChange,
    onLogin,
  };
};
