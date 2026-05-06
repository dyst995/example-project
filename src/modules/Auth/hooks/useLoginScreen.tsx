import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginThunk } from '../../../store/auth/auth.thunk';
import { selectAuthState } from '../../../store/auth/auth.selector';

export const useLoginScreen = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectAuthState);
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

    await dispatch(
      loginThunk({
        username: username.trim(),
        password,
      }),
    );
  };

  return {
    isDisabled,
    username,
    password,
    onUsernameChange,
    onPasswordChange,
    onLogin,
  };
};
