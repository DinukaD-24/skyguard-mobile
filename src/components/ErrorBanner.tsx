import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({
  message,
}: ErrorBannerProps) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDECEC',
    borderColor: '#E53935',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },

  text: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
});