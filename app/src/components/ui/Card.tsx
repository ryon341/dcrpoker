import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { T } from './Theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Whether to apply default inner padding (default: true) */
  padded?: boolean;
  /** Override background color */
  bg?: string;
}

export function Card({ children, style, padded = true, bg }: CardProps) {
  return (
    <View
      style={[
        card.base,
        padded ? card.padded : null,
        bg ? { backgroundColor: bg } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const card = StyleSheet.create({
  base:   {
    backgroundColor: T.cardGlass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  padded: { padding: 18 },
});
