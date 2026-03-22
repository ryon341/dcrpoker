TC065 — Sound + Haptics Pass
Goal

Add a lightweight sound and haptics layer so the game feels materially more polished without changing gameplay.

This taskcard should improve:

tactile feedback
perceived responsiveness
reward moments
emotional impact of correct/incorrect/win/wheel/level-up states

Keep it tasteful. The app should feel sharper, not noisy.

Scope

Implement:

sound effects system
haptic feedback system
event-to-sound mapping
mute toggles / user controls
safe fallback if sound/haptics unavailable

Do not add background music.
Do not change scoring or progression.
Do not overcomplicate asset loading.

Product Intent

The sounds should reinforce:

decision locked in
answer result
hand result
reward earned
progression unlocked

The haptics should reinforce:

tap confirmation
correct/incorrect tension
wheel result
level-up reward
Files To Create
1. gameAudio.ts

Central sound manager.

Functions:

playSound(name: GameSound): Promise<void>
preloadSounds(): Promise<void>
unloadSounds(): Promise<void>
setSoundEnabled(enabled: boolean): Promise<void>
getSoundEnabled(): Promise<boolean>

Types:

type GameSound =
  | 'tap'
  | 'correct'
  | 'incorrect'
  | 'cardFlip'
  | 'win'
  | 'lose'
  | 'wheelTick'
  | 'wheelReward'
  | 'levelUp'
  | 'badgeUnlock';

Implementation:

use the app’s standard audio lib if already installed
if not, use the lightest existing supported approach in project
preload once on page mount or app section mount
2. gameHaptics.ts

Central haptics manager.

Functions:

triggerTapHaptic(): void
triggerCorrectHaptic(): void
triggerIncorrectHaptic(): void
triggerRewardHaptic(): void
triggerLevelUpHaptic(): void
setHapticsEnabled(enabled: boolean): Promise<void>
getHapticsEnabled(): Promise<boolean>

Map these to platform-safe haptic patterns using the project’s existing haptics library if available.

If no library exists, add the standard Expo/native haptics package already consistent with the project stack.

3. SettingsToggleRow.tsx

Reusable settings row for:

Sound Effects
Haptics

Compact component with label + switch.

4. GameFeedbackSettings.tsx

Small settings card/panel that can live on the stats page or near the game header menu.

Shows:

Sound Effects toggle
Haptics toggle
Files To Modify
poker-challenge/index.tsx
daily.tsx/poker-challenge/daily.tsx
DecisionButtons.tsx
WheelModal.tsx
LevelCompleteModal.tsx
DailyChallengeResultsModal.tsx
stats.tsx/poker-challenge/stats.tsx or another sensible settings location
possibly ContinuePanel.tsx if needed for sound timing
Sound Event Mapping

Use this exact mapping as the default V1:

Tap / Button press
sound: tap
haptic: tap haptic

Trigger on:

YES/NO press
Continue
modal buttons
CTA button in ad modal
Hand resolution
Correct answer
sound: correct
haptic: correct haptic
Incorrect answer
sound: incorrect
haptic: incorrect haptic

Trigger when correctness banner appears, not at initial tap.

Card reveals
sound: cardFlip

Trigger:

villain reveal
flop reveal
turn reveal
river reveal

Keep volume subtle. It may fire multiple times in quick sequence.

Hand outcome
Hero wins
sound: win
Hero loses
sound: lose

Trigger when win/lose overlay appears.

Wheel
Spin start

No big sound required unless already easy.

Wheel stop / reward result
sound: wheelReward
haptic: reward haptic

Optional:

wheelTick if the existing animation exposes segment ticks cleanly
this is optional, not required
Level complete
sound: levelUp
haptic: level-up/reward haptic

Trigger when LevelCompleteModal appears.

Badge unlock / daily streak reward
sound: badgeUnlock
haptic: reward haptic

Trigger when daily badge unlock card appears.

Settings / Persistence

Persist two booleans:

soundEnabled: boolean
hapticsEnabled: boolean

Store locally in AsyncStorage.

Default:

soundEnabled = true
hapticsEnabled = true

If device/platform does not support haptics:

fail gracefully
keep toggle visible only if reasonable, or silently no-op
UI Placement
Recommended placement

Add GameFeedbackSettings near the bottom of the Stats page under Ad Performance.

This gives users one place to adjust preferences without cluttering gameplay.

Optional small quick access later, but not needed now.

Timing Guidance

Be careful with sequencing.

Correct/incorrect

Play when correctness banner appears.

Win/lose

Play when outcome overlay appears.

Card flips

Play on each reveal phase:

villain reveal
flop
turn
river
Avoid overlap chaos

If multiple sounds would stack badly, prioritize:

correctness
win/lose
levelUp

Card flip sounds can be skipped if the event cadence becomes too noisy.

Suggested Asset Names

If the project keeps audio in assets:

tap.mp3
correct.mp3
incorrect.mp3
card-flip.mp3
win.mp3
lose.mp3
wheel-reward.mp3
level-up.mp3
badge-unlock.mp3

You can use placeholder/generated/open licensed short UI sounds for now if needed.

If audio files do not exist yet:

wire the system with TODO-safe guards
but ideally include at least a minimal sound pack in this taskcard
Graceful Fallback Rules

If sound file missing or audio init fails:

do not crash
log warning in dev only
continue silently

If haptics unavailable:

no-op
Acceptance Criteria
Sound effects can be enabled/disabled
Haptics can be enabled/disabled
Settings persist across app reopen
YES/NO taps trigger tap feedback
Correct/incorrect events trigger distinct feedback
Win/lose events trigger distinct feedback
Wheel reward triggers feedback
Level complete triggers feedback
Daily badge unlock triggers feedback
No crashes if sound/haptics unavailable
Stats page includes feedback settings panel
Main and daily gameplay remain stable
Deliverable Back

When complete, report:

files created
files modified
audio/haptics library used
where settings are stored
which events are wired
whether any sounds were skipped or stubbed
screenshot of settings panel
short note on platform behavior if iOS/Android differ
