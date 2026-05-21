import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DefaultButton } from '../../shared/components/Buttons';
import { useDashboard } from './hooks';

type Props = {};

export const Dashboard: React.FC<Props> = () => {
  const { activityCount, onIncrement, onReset, onLogout } = useDashboard();

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
  logoutButton: {
    backgroundColor: '#DC2626',
  },
});
