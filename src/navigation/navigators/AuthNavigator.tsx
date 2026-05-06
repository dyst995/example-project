import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../modules/Auth';
import { AuthNavigatorScreens } from '../enums';
import { AuthNavigatorParams } from '../types';

const AuthStack = createNativeStackNavigator<AuthNavigatorParams>();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name={AuthNavigatorScreens.LOGIN}
        component={LoginScreen}
      />
    </AuthStack.Navigator>
  );
};
