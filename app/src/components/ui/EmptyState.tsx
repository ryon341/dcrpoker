import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from './Theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  body?: string;
  /** CTA button label */
  action?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, body, action, onAction }: EmptyStateProps) {
  return (
    <View style={es.wrapper}>
      {icon ? <Text style={es.icon}>{icon}</Text> : null}
      <Text style={es.title}>{title}</Text>
      {body ? <Text style={es.body}>{body}</Text> : null}
      {action && onAction ? (
        <Button
          label={action}
          onPress={onAction}
          style={{ marginTop: 20, paddingHorizontal: 28 }}
        />
      ) : null}
    </View>
  );
}

const es = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 52,
    paddingHorizontal: 28,
  },
  icon:  { fontSize: 42, marginBottom: 14 },
  title: { color: T.silver, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  body:  { color: T.muted, fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
