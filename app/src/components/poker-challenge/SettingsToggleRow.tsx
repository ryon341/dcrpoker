import { memo } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { T } from '../ui/Theme';

interface SettingsToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  description?: string;
}

export const SettingsToggleRow = memo(function SettingsToggleRow({ label, value, onValueChange, description }: SettingsToggleRowProps) {
  return (
    <View style={s.row}>
      <View style={s.textCol}>
        <Text style={s.label}>{label}</Text>
        {description ? <Text style={s.description}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(251,191,36,0.5)' }}
        thumbColor={value ? T.gold : 'rgba(255,255,255,0.4)'}
      />
    </View>
  );
});

const s = StyleSheet.create({
  row:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  textCol:     { flex: 1, gap: 2 },
  label:       { color: T.white, fontSize: 14, fontWeight: '600' },
  description: { color: T.muted, fontSize: 11 },
});
