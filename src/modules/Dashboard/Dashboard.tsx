import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DefaultButton } from '../../shared/components/Buttons';
import { MainNavigatorParams } from '../../navigation/types';
import { MainNavigatorScreens } from '../../navigation/enums';
import { useDashboard } from './hooks';

type Props = {};

export const Dashboard: React.FC<Props> = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainNavigatorParams>>();
  const {
    activityCount,
    passcodeEnabled,
    onIncrement,
    onReset,
    onLogout,
  } = useDashboard();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Track your daily activity</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Activity count</Text>
        <Text style={styles.count} testID="dashboard-activity-count">
          {activityCount}
        </Text>

        <DefaultButton
          title="Add activity"
          onPress={onIncrement}
          style={styles.actionButton}
          testID="dashboard-increment-button"
        />

        <DefaultButton
          title="Reset"
          onPress={onReset}
          style={styles.actionButton}
          testID="dashboard-reset-button"
        />
      </View>

      <View style={styles.passcodeCard}>
        <Text style={styles.cardLabel}>Passcode</Text>
        <Text style={styles.passcodeStatus} testID="dashboard-passcode-status">
          {passcodeEnabled ? 'Enabled' : 'Not set up'}
        </Text>
        {!passcodeEnabled ? (
          <DefaultButton
            title="Activate passcode"
            onPress={() =>
              navigation.navigate(MainNavigatorScreens.PASSCODE_SETUP)
            }
            style={styles.actionButton}
            testID="dashboard-passcode-setup-button"
          />
        ) : null}
      </View>

      <DefaultButton
        title="Log out"
        onPress={onLogout}
        style={styles.logoutButton}
        testID="dashboard-logout-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  count: {
    fontSize: 40,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  actionButton: {
    marginTop: 10,
  },
  passcodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  passcodeStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
  },
});
