/**
 * Feature flags — set to false to hide unfinished or unreleased features.
 * Flip to true as features pass QA and are ready for production.
 */
export const FEATURES = {
  ENABLE_NOTIFICATIONS:  true,
  ENABLE_PUBLIC_GAMES:   true,
  ENABLE_REFERRALS:      true,
  ENABLE_PLAYER_IMPORT:  true,
  ENABLE_INVITE_TOOLS:   true,
  ENABLE_GEAR:           true,
  ENABLE_TOOLS:          true,
  ENABLE_ADMIN_PANEL:    true,
  ENABLE_ARCADE:         true,
} as const;

export type FeatureKey = keyof typeof FEATURES;
