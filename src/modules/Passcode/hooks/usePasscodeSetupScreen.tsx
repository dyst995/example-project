import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { activatePasscodeThunk } from '../../../store/passcode/passcode.thunk';
import { selectPasscodeState } from '../../../store/passcode/passcode.selector';
import { clearPasscodeError } from '../../../store/passcode/passcode.slice';

export const usePasscodeSetupScreen = () => {
  const dispatch = useAppDispatch();
  const { isActivating, error } = useAppSelector(selectPasscodeState);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const isDisabled =
    !passcode.trim() || !confirmPasscode.trim() || isActivating;

  const onPasscodeChange = (value: string) => {
    dispatch(clearPasscodeError());
    setPasscode(value);
  };

  const onConfirmPasscodeChange = (value: string) => {
    dispatch(clearPasscodeError());
    setConfirmPasscode(value);
  };

  const onActivate = async () => {
    if (isDisabled) {
      return;
    }

    await dispatch(
      activatePasscodeThunk({
        passcode,
        confirmPasscode,
      }),
    );
  };

  return {
    passcode,
    confirmPasscode,
    isDisabled,
    isActivating,
    error,
    onPasscodeChange,
    onConfirmPasscodeChange,
    onActivate,
  };
};
