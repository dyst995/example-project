import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigation } from './src/navigation';
import { AuthHydrator } from './src/navigation/AuthHydrator';
import { PasscodeHydrator } from './src/navigation/PasscodeHydrator';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Provider store={store}>
          <AuthHydrator>
            <PasscodeHydrator>
              <RootNavigation />
            </PasscodeHydrator>
          </AuthHydrator>
        </Provider>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
