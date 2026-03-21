import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

// Routes inside (protected) that are accessible without login
const PUBLIC_PROTECTED = new Set(['arcade', 'tools', 'gear', 'poker-challenge']);

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === '(auth)';
    const inPublicInvite = segments[0] === 'invite';
    const atRoot = segments.length < 1;
    const isPublicPage =
      (segments[0] as string)?.startsWith('poker-') ||
      (segments[0] as string) === 'pricing' ||
      (segments[0] === '(protected)' && PUBLIC_PROTECTED.has(segments[1] as string));

    if (!user && !inAuth && !inPublicInvite && !atRoot && !isPublicPage) {
      router.replace(`/(auth)/login?returnTo=${encodeURIComponent(pathname)}` as any);
    } else if (user && inAuth) {
      router.replace('/(protected)');
    }
  }, [user, isLoading, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

