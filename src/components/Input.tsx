import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  style,
  ...props
}: InputProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>
        {label}
      </ThemedText>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: error ? '#EF4444' : 'transparent',
          },
          style,
        ]}
        placeholderTextColor={theme.textSecondary}
        {...props}
      />

      {error ? (
        <ThemedText style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },

  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    fontSize: 16,
  },

  error: {
    color: '#EF4444',
    marginTop: 4,
    fontSize: 12,
  },
});