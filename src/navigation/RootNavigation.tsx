import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export const RootNavigation = () => {
  const authenticated = false;

  return authenticated ? <MainNavigator /> : <AuthNavigator />;
};
