import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from './themed-text';

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({
  text = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#3C87F7"
      />

      <ThemedText style={styles.text}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  text: {
    marginTop: 12,
  },
});