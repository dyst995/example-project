import { AuthNavigator, MainNavigator } from './navigators';

export const RootNavigation = () => {
  const authenticated = false;

  return authenticated ? <MainNavigator /> : <AuthNavigator />;
};
