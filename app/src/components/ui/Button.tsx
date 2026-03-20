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
        <ActivityIndicator size="small" color={variant === 'primary' ? '#0c0a09' : '#fff'} />
      ) : (
        <Text style={[btn.text, small ? btn.textSmall : null, btn[`text_${variant}` as keyof typeof btn] as any]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  base:      { borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  normal:    { paddingHorizontal: 20, paddingVertical: 15 },
  small:     { paddingHorizontal: 12, paddingVertical: 8 },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.45 },

  // Primary — amber/gold with dark text
  primary:   { backgroundColor: T.gold },
  // Secondary — subtle glass with border
  secondary: { backgroundColor: T.cardGlass, borderWidth: 1, borderColor: T.cardBorder },
  ghost:     { backgroundColor: 'transparent' },
  danger:    { backgroundColor: T.red },
  success:   { backgroundColor: T.statusConfirmed },
  warning:   { backgroundColor: T.statusWaitlisted },

  text:           { color: '#0c0a09', fontWeight: 'bold', fontSize: 15 },
  textSmall:      { fontSize: 13 },
  text_primary:   { color: '#0c0a09' } as any,
  text_ghost:     { color: T.silver } as any,
  text_secondary: { color: T.silver } as any,
  text_danger:    { color: T.white } as any,
  text_success:   { color: T.white } as any,
  text_warning:   { color: T.white } as any,
});
