import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export const RootNavigation = () => {
  const authenticated = false;

  if (authenticated) {
    return <MainNavigator />;
  }

  return <AuthNavigator />;
};
