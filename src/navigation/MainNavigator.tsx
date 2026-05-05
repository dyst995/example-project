import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard } from '../modules/Dashboard';

const MainStack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Dashboard" component={Dashboard} />
    </MainStack.Navigator>
  );
};
