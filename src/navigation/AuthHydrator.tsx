import React, { useEffect } from 'react';

import { hydrateSessionThunk } from '../store/auth';
import { selectAuthHydrated } from '../store/auth/auth.selector';
import { useAppDispatch, useAppSelector } from '../store/hooks';

type Props = {
  children: React.ReactNode;
};

export const AuthHydrator: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector(selectAuthHydrated);

  useEffect(() => {
    dispatch(hydrateSessionThunk());
  }, [dispatch]);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};
