import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { signOut } from '../../../store/auth/auth.slice';
import {
  incrementActivity,
  resetActivity,
} from '../../../store/dashboard/dashboard.slice';
import { selectActivityCount } from '../../../store/dashboard/dashboard.selector';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const activityCount = useAppSelector(selectActivityCount);

  const onIncrement = () => {
    dispatch(incrementActivity());
  };

  const onReset = () => {
    dispatch(resetActivity());
  };

  const onLogout = () => {
    dispatch(signOut());
  };

  return {
    activityCount,
    onIncrement,
    onReset,
    onLogout,
  };
};
