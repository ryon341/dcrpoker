import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { T } from './Theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  small?: boolean;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  small = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[
        btn.base,
        small ? btn.small : btn.normal,
        btn[variant],
        isDisabled ? btn.disabled : null,
        fullWidth ? btn.fullWidth : null,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[btn.text, small ? btn.textSmall : null, btn[`text_${variant}` as keyof typeof btn] as any]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  base:      { borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  normal:    { paddingHorizontal: 20, paddingVertical: 14 },
  small:     { paddingHorizontal: 12, paddingVertical: 7 },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.45 },

  primary:   { backgroundColor: T.red },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: T.border },
  ghost:     { backgroundColor: 'transparent' },
  danger:    { backgroundColor: T.statusDeclined },
  success:   { backgroundColor: T.statusConfirmed },
  warning:   { backgroundColor: T.statusWaitlisted },

  text:           { color: T.white, fontWeight: 'bold', fontSize: 15 },
  textSmall:      { fontSize: 13 },
  text_ghost:     { color: T.silver } as any,
  text_secondary: { color: T.silver } as any,
});
