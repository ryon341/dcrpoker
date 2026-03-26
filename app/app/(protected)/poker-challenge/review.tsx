// TC099 — Dev-only review route for the Challenge Question Review Surface.
// Redirects non-dev builds back to the challenge home screen immediately.

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ChallengeReviewScreen } from '../../../src/components/poker-challenge/ChallengeReviewScreen';

export default function ChallengeReviewPage(): React.ReactElement | null {
  const router = useRouter();

  useEffect(() => {
    if (!__DEV__) {
      router.replace('/(protected)/poker-challenge' as any);
    }
  }, []);

  if (!__DEV__) return null;
  return <ChallengeReviewScreen />;
}
