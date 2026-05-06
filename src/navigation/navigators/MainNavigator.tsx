import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard } from '../../modules/Dashboard';
import { MainNavigatorScreens } from '../enums';

const MainStack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name={MainNavigatorScreens.HOME}
        component={Dashboard}
      />
    </MainStack.Navigator>
  );
};
