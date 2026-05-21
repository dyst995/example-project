import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { activatePasscodeThunk } from '../../../store/passcode/passcode.thunk';
import { selectPasscodeState } from '../../../store/passcode/passcode.selector';
import { clearPasscodeError } from '../../../store/passcode/passcode.slice';

type SetupStep = 'create' | 'confirm';

export const usePasscodeSetupScreen = () => {
  const dispatch = useAppDispatch();
  const { isActivating, error } = useAppSelector(selectPasscodeState);
  const [step, setStep] = useState<SetupStep>('create');
  const [pin, setPin] = useState('');
  const [passcode, setPasscode] = useState('');

  const stepTitle =
    step === 'create' ? 'Create passcode' : 'Confirm passcode';
  const stepSubtitle =
    step === 'create'
      ? 'Choose a 4-digit passcode'
      : 'Enter the same passcode again';

  const onPinChange = (value: string) => {
    dispatch(clearPasscodeError());
    setPin(value);
  };

  const onPinComplete = async (value: string) => {
    if (step === 'create') {
      setPasscode(value);
      setPin('');
      setStep('confirm');
      return;
    }

    await dispatch(
      activatePasscodeThunk({
        passcode,
        confirmPasscode: value,
      }),
    );
    setPin('');
  };

  return {
    pin,
    step,
    stepTitle,
    stepSubtitle,
    isActivating,
    error,
    onPinChange,
    onPinComplete,
  };
};
