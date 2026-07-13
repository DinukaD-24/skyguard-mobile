import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export default function Card({
  children,
  style,
  ...props
}: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 3,
  },
});