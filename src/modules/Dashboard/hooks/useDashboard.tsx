import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { signOutThunk } from '../../../store/auth';
import {
  incrementActivity,
  resetActivity,
  selectActivityCount,
} from '../../../store/dashboard';
import { selectPasscodeEnabled } from '../../../store/passcode';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const activityCount = useAppSelector(selectActivityCount);
  const passcodeEnabled = useAppSelector(selectPasscodeEnabled);

  const onIncrement = () => {
    dispatch(incrementActivity());
  };

  const onReset = () => {
    dispatch(resetActivity());
  };

  const onLogout = () => {
    dispatch(signOutThunk());
  };

  return {
    activityCount,
    passcodeEnabled,
    onIncrement,
    onReset,
    onLogout,
  };
};
