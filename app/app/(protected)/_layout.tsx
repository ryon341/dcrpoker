import { Stack } from 'expo-router';
import { T } from '../../src/components/ui/Theme';

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: T.bg },
        headerTintColor: T.gold,
        headerTitleStyle: { color: T.white, fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index"                          options={{ title: 'DCR Poker' }} />
      <Stack.Screen name="notifications/index"            options={{ title: 'Notifications' }} />
      <Stack.Screen name="public-games/index"             options={{ title: 'Public Games' }} />
      <Stack.Screen name="admin/public-games/index"       options={{ title: 'Manage Public Games' }} />
      <Stack.Screen name="account/referrals"              options={{ title: 'Referrals' }} />
      <Stack.Screen name="players/import"                 options={{ title: 'Import Players' }} />
      <Stack.Screen name="players/invite-tools"           options={{ title: 'Invite Tools' }} />
      <Stack.Screen name="games/index"                    options={{ title: 'My Games' }} />
      <Stack.Screen name="games/create"                   options={{ title: 'Create Game' }} />
      <Stack.Screen name="games/[id]/index"               options={{ title: 'Game Details' }} />
      <Stack.Screen name="games/[id]/manage"              options={{ title: 'Manage Game' }} />
      <Stack.Screen name="games/[id]/invite"              options={{ title: 'Invite Players' }} />
      <Stack.Screen name="contacts/index"                 options={{ title: 'Contacts' }} />
      <Stack.Screen name="contacts/create"                options={{ title: 'Add Contact' }} />
      <Stack.Screen name="players/index"                  options={{ title: 'My Players' }} />
      <Stack.Screen name="invites/index"                  options={{ title: 'Invites' }} />
      <Stack.Screen name="invites/create"                 options={{ title: 'New Invite' }} />
      <Stack.Screen name="messages/index"                 options={{ title: 'Messages' }} />
      <Stack.Screen name="bankroll/index"                 options={{ title: 'Bankroll' }} />
      <Stack.Screen name="account/billing"                options={{ title: 'Billing & Plan' }} />
      <Stack.Screen name="tools/index"                    options={{ title: 'Poker Tools' }} />
      <Stack.Screen name="gear/index"                     options={{ title: 'Gear' }} />
      <Stack.Screen name="arcade/index"                   options={{ title: 'Poker Arcade' }} />
      <Stack.Screen name="arcade/outs"                    options={{ title: 'Outs Calculator' }} />
      <Stack.Screen name="arcade/nuts"                    options={{ title: 'Spot the Nuts' }} />
      <Stack.Screen name="arcade/chip-stack"              options={{ title: 'Chip Stack Builder' }} />
      <Stack.Screen name="arcade/memory"                  options={{ title: 'Card Memory' }} />
      <Stack.Screen name="arcade/solitaire"               options={{ title: 'Poker Solitaire' }} />
      <Stack.Screen name="arcade/blackjack"               options={{ title: 'Mini Blackjack' }} />
      <Stack.Screen name="arcade/reaction"                options={{ title: 'Reaction Timer' }} />      <Stack.Screen name="poker-challenge/index"              options={{ title: 'Poker Challenge' }} />    </Stack>
  );
}
