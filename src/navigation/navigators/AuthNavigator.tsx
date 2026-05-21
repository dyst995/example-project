import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../modules/Auth';
import { PasscodeLoginScreen } from '../../modules/Passcode';
import { useAppSelector } from '../../store/hooks';
import { selectShowPasscodeLogin } from '../../store/passcode/passcode.selector';
import { AuthNavigatorScreens } from '../enums';
import { AuthNavigatorParams } from '../types';

const AuthStack = createNativeStackNavigator<AuthNavigatorParams>();

export const AuthNavigator = () => {
  const showPasscodeLogin = useAppSelector(selectShowPasscodeLogin);

  return (
    <AuthStack.Navigator>
      {showPasscodeLogin ? (
        <AuthStack.Screen
          name={AuthNavigatorScreens.PASSCODE_LOGIN}
          component={PasscodeLoginScreen}
        />
      ) : (
        <AuthStack.Screen
          name={AuthNavigatorScreens.LOGIN}
          component={LoginScreen}
        />
      )}
    </AuthStack.Navigator>
  );
};
