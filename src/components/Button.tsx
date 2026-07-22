import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'disabled';

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  title,
  variant = 'primary',
  style,
  disabled,
  loading,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const isDisabled =
  disabled ||
  loading ||
  variant === "disabled";

  return (
    <Pressable
      style={[
        styles.button,
        variant === 'primary' && {
          backgroundColor: '#3C87F7',
        },
        variant === 'secondary' && {
          backgroundColor: theme.backgroundElement,
          borderWidth: 1,
          borderColor: '#3C87F7',
        },
        isDisabled && {
          backgroundColor: '#BDBDBD',
        },
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
  <ActivityIndicator
    color={variant === 'secondary' ? '#3C87F7' : '#FFFFFF'}
  />
) : (
  <Text
    style={[
      styles.text,
      variant === 'secondary' && {
        color: '#3C87F7',
      },
    ]}
  >
    {title}
  </Text>
)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});