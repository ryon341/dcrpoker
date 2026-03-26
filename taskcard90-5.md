TC090.5 — Build Poker Challenge Question Generator Engine
Objective

Create a reusable generation pipeline that programmatically produces valid poker challenge questions for all tiers using strict templates, tier-based difficulty rules, and validator-safe output.

This system should become the source of truth for large-scale question-bank generation, replacing manual or semi-manual authoring.

Why this card exists

Current work appears to have expanded tier banks by composing or multiplying seeded content. That is useful, but it is not yet a maintainable generation system.

We now need a generator that can:

create large question banks on demand,
scale to 250 questions per tier cleanly,
enforce template quality,
preserve tier difficulty progression,
reduce repetition,
support future regeneration.
Scope
1) Create generator folder structure

Create:

app/(tabs)/poker-challenge/generator/
  index.ts
  generatorTypes.ts
  generatorConfig.ts
  handPools.ts
  scenarioPools.ts
  actionGenerator.ts
  evGenerator.ts
  outsGenerator.ts
  pressureGenerator.ts
  buildTierQuestionBank.ts
  dedupeQuestions.ts
  exportQuestionBank.ts

Purpose:

separate generation logic from runtime gameplay logic,
keep content system maintainable,
allow future regeneration without touching app engine files.
2) Add generator types
File

app/(tabs)/poker-challenge/generator/generatorTypes.ts

Define types for generation inputs and outputs.

Include at minimum:

export type TierKey =
  | 'Beginner'
  | 'Apprentice'
  | 'Grinder'
  | 'Chip Leader'
  | 'Master';

export type GeneratorCategory =
  | 'action'
  | 'ev'
  | 'outs'
  | 'position'
  | 'pressure';

export type Position =
  | 'UTG'
  | 'MP'
  | 'CO'
  | 'BTN'
  | 'SB'
  | 'BB';

export type StackDepthBucket =
  | 'short'
  | 'medium'
  | 'deep';

export type PriorAction =
  | 'folded_to_hero'
  | 'limp_before_hero'
  | 'single_raise_before_hero'
  | 'hero_facing_3bet'
  | 'single_caller_before_hero';

export type GeneratorQuestionSeed = {
  tier: TierKey;
  category: GeneratorCategory;
  heroPosition?: Position;
  villainPosition?: Position;
  stackDepthBb?: number;
  hand: string;
  priorAction?: PriorAction;
  potSize?: number;
  callSize?: number;
  board?: string[];
  outs?: number;
  correctAnswer: string | number;
  difficulty: 1 | 2 | 3 | 4 | 5;
};

Use the existing challenge question schema for the final exported shape.

3) Create tier generation config
File

app/(tabs)/poker-challenge/generator/generatorConfig.ts

Define:

target counts by tier,
target counts by category,
tier difficulty envelopes,
allowed scenario complexity per tier.

Example:

export const TIER_GENERATION_TARGETS = {
  Beginner: { action: 100, ev: 50, outs: 60, position: 40, pressure: 0 },
  Apprentice: { action: 100, ev: 60, outs: 50, position: 40, pressure: 0 },
  Grinder: { action: 90, ev: 70, outs: 40, pressure: 50 },
  'Chip Leader': { action: 80, ev: 80, outs: 30, pressure: 60 },
  Master: { action: 70, ev: 90, outs: 20, pressure: 70 },
} as const;

And define tier rules such as:

Beginner: obvious hands, no 3-bet pressure, mostly clean outs
Apprentice: marginal hands, simple facing-raise spots
Grinder: pressure, position conflicts, larger EV decisions
Chip Leader: more aggressive pressure, stronger punishment
Master: toughest simplified decision spots
4) Build reusable hand and scenario pools
File

app/(tabs)/poker-challenge/generator/handPools.ts

Add curated hand pools by tier and category:

premiums,
broadways,
suited connectors,
weak offsuit traps,
dominated hands,
marginal calling hands.
File

app/(tabs)/poker-challenge/generator/scenarioPools.ts

Add:

positions,
stack-depth values,
open sizes,
pot sizes,
call sizes,
board textures,
clean draw patterns,
pressure configurations.

Important:
Do not use fully random unconstrained generation. Use curated pools so the output stays realistic.

5) Build category generators

Create one generator per category.

Files
actionGenerator.ts
evGenerator.ts
outsGenerator.ts
pressureGenerator.ts

Each should:

take tier and requested count,
generate candidate questions from tier-legal patterns,
return final questions in the app’s existing schema,
attach id/tier/category/difficulty metadata.

Examples:

actionGenerator

Produces prompts like:

Position: CO
Stack: 35 BB
Action: UTG raises 3 BB
Hand: AJo

What is the best action?
evGenerator

Produces:

Pot: $120
Call: $30
You have a flush draw (9 outs)

Should you call or fold?
outsGenerator

Produces:

Hand: 8♥ 9♥
Board: 6♥ 7♣ K♦

How many outs do you have?
pressureGenerator

Produces:

Position: BTN
Stack: 30 BB
Action: CO raises 3 BB, you call
Hand: KQo

Flop: K♠ 7♦ 2♣
CO bets pot

What is the best action?

Do not add vague prompts. Every generator must follow the strict template rules already defined.

6) Build tier assembler
File

app/(tabs)/poker-challenge/generator/buildTierQuestionBank.ts

This module should:

read target counts from generatorConfig.ts,
call the proper category generators,
assemble a full tier bank,
ensure exact category counts,
return a flat array.

Function shape:

export function buildTierQuestionBank(tier: TierKey) {
  // generate per-category bank according to tier targets
}
7) Add dedupe and variation control
File

app/(tabs)/poker-challenge/generator/dedupeQuestions.ts

Implement:

duplicate id detection,
duplicate prompt detection,
near-duplicate signature detection.

At minimum, create a normalized prompt fingerprint that ignores whitespace and case.

Also add a scenario signature so obvious clones are rejected, for example:

same hand,
same position,
same prior action,
same stack bucket,
same answer.

The generator should retry until requested counts are met or fail loudly.

8) Add export pipeline
File

app/(tabs)/poker-challenge/generator/exportQuestionBank.ts

This script should:

generate one or more tiers,
write output files into the existing data folders,
preserve the exact schema expected by the app,
emit deterministic ids.

Suggested outputs:

data/beginner/generatedBeginnerQuestions.ts
data/apprentice/generatedApprenticeQuestions.ts
data/grinder/generatedGrinderQuestions.ts
data/chipLeader/generatedChipLeaderQuestions.ts
data/master/generatedMasterQuestions.ts

The export may either:

overwrite generated files, or
write new generated files consumed by each tier index.ts.

Keep hand-written runtime logic separate from generated content.

9) Add deterministic generation mode

Important for reproducibility.

Use a simple seeded pseudo-random strategy so the same seed produces the same bank.

Requirement

Add a seed option in generator/index.ts or exportQuestionBank.ts:

type GeneratorRunOptions = {
  seed: string;
  tiers?: TierKey[];
};

This allows:

regeneration,
debugging,
controlled refreshes of content.
10) Integrate generator output with validators

After export, the workflow must run:

validateQuestionBank.ts
validateAllTierQuestionBanks.ts
auditTierSampling.ts

Goal:
Any generated bank must pass the same quality gates as authored content.

11) Do an initial real generation pass

This card is not complete with scaffolding only.

Generate at least:

Beginner
Apprentice
Grinder

Minimum expected result:

generator runs successfully,
outputs valid app-compatible question files,
validators pass,
at least 3 tiers can be generated end-to-end from the generator.

Chip Leader and Master can be scaffolded in this card, but at minimum the engine must prove itself by generating three full tiers.

If implementation is clean and time permits, generate all five tiers.

Acceptance criteria
Generator folder and modules exist.
Generator supports tier-aware category generation.
Question output matches current app schema.
Generator uses strict templates, not vague prompts.
Duplicate prompts and ids are screened.
Deterministic seed-based generation exists.
Export script writes generated tier files into the app data structure.
Generated Beginner, Apprentice, and Grinder banks are produced successfully.
Generated outputs pass validators.
Existing gameplay engine continues to work unchanged.
Status dashboard can reflect generated counts accurately.
The system is reusable for future regeneration.
Non-goals
Do not redesign the runtime challenge UI.
Do not change the scoring model.
Do not rewrite tier progression.
Do not add backend services.
Do not require manual authoring to complete this card.
Deliverables
generator module set
tier config and scenario pools
category generators
tier assembler
dedupe pipeline
export pipeline
deterministic seed support
generated question-bank outputs for at least 3 tiers
QA checklist

Run these manually:

Generate Beginner with a fixed seed twice and confirm identical output.
Generate Apprentice and Grinder and confirm counts match targets.
Run validators on generated outputs and confirm zero structural errors.
Run sampling audit and confirm carryover behavior still works.
Play at least one level in Beginner, Apprentice, and Grinder and confirm prompts render correctly.
Confirm no obvious duplicate prompts appear in a short manual sample.
Confirm ids remain unique across generated tiers.
Suggested commit message
feat(challenge): add deterministic question generator engine and export pipeline