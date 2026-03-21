import { View, Text, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface StatsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function StatsSection({ title, children }: StatsSectionProps) {
  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      <View style={s.content}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:    { gap: 10 },
  title:   { color: T.muted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  content: { gap: 8 },
});
