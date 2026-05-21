import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { passcodeLoginThunk } from '../../../store/passcode/passcode.thunk';
import { selectPasscodeState } from '../../../store/passcode/passcode.selector';
import { clearPasscodeError } from '../../../store/passcode/passcode.slice';

export const usePasscodeLoginScreen = () => {
  const dispatch = useAppDispatch();
  const { isUnlocking, error } = useAppSelector(selectPasscodeState);
  const [passcode, setPasscode] = useState('');

  const isDisabled = !passcode.trim() || isUnlocking;

  const onPasscodeChange = (value: string) => {
    dispatch(clearPasscodeError());
    setPasscode(value);
  };

  const onUnlock = async () => {
    if (isDisabled) {
      return;
    }

    await dispatch(passcodeLoginThunk({ passcode }));
  };

  return {
    passcode,
    isDisabled,
    isUnlocking,
    error,
    onPasscodeChange,
    onUnlock,
  };
};
