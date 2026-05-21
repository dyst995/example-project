import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hydratePasscodeThunk } from '../store/passcode/passcode.thunk';
import { selectPasscodeHydrated } from '../store/passcode/passcode.selector';

type Props = {
  children: React.ReactNode;
};

export const PasscodeHydrator: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector(selectPasscodeHydrated);

  useEffect(() => {
    dispatch(hydratePasscodeThunk());
  }, [dispatch]);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};
