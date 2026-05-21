import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard } from '../../modules/Dashboard';
import { PasscodeSetupScreen } from '../../modules/Passcode';
import { MainNavigatorScreens } from '../enums';
import { MainNavigatorParams } from '../types';

const MainStack = createNativeStackNavigator<MainNavigatorParams>();

export const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name={MainNavigatorScreens.HOME}
        component={Dashboard}
      />
      <MainStack.Screen
        name={MainNavigatorScreens.PASSCODE_SETUP}
        component={PasscodeSetupScreen}
        options={{ title: 'Passcode' }}
      />
    </MainStack.Navigator>
  );
};
