import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T, statusBg } from './Theme';

interface BadgeProps {
  label: string;
  /** Explicit background color — overrides status */
  color?: string;
  /** Automatically pick background from status string */
  status?: string;
}

export function Badge({ label, color, status }: BadgeProps) {
  const bg = color ?? (status ? statusBg(status) : T.faint);
  return (
    <View style={[b.badge, { backgroundColor: bg }]}>
      <Text style={b.text}>{label.toUpperCase()}</Text>
    </View>
  );
}

const b = StyleSheet.create({
  badge: {
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    color: T.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
