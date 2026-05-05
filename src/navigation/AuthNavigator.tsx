import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../modules/Auth';

const AuthStack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};
