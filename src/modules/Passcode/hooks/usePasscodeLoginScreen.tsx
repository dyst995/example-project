import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { passcodeLoginThunk } from '../../../store/passcode/passcode.thunk';
import { selectPasscodeState } from '../../../store/passcode/passcode.selector';
import { clearPasscodeError } from '../../../store/passcode/passcode.slice';

export const usePasscodeLoginScreen = () => {
  const dispatch = useAppDispatch();
  const { isUnlocking, error } = useAppSelector(selectPasscodeState);
  const [pin, setPin] = useState('');

  const onPinChange = (value: string) => {
    dispatch(clearPasscodeError());
    setPin(value);
  };

  const onPinComplete = async (value: string) => {
    await dispatch(passcodeLoginThunk({ passcode: value }));
  };

  return {
    pin,
    isUnlocking,
    error,
    onPinChange,
    onPinComplete,
  };
};
