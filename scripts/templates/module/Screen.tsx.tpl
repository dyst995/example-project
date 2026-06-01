import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { use{{Feature}}Screen } from '../hooks';

export const {{Feature}}Screen: React.FC = () => {
  const { isLoading, error } = use{{Feature}}Screen();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{{Feature}}</Text>
      {error ? <Text testID="{{feature}}-error">{error}</Text> : null}
      {isLoading ? <Text testID="{{feature}}-loading">Loading…</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
});
