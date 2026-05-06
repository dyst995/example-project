import { AuthNavigator, MainNavigator } from './navigators';
import { useAppSelector } from '../store/hooks';

export const RootNavigation = () => {
  const authenticated = useAppSelector(state => state.auth.authenticated);

  return authenticated ? <MainNavigator /> : <AuthNavigator />;
};
