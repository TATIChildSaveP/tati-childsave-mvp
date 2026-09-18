// Reusable branching scenario engine — domain types.
// Scenario content lives in src/content/scenarios/*, never inside components.
// The same engine powers TATI Junior, Teen and Plus stories.

import type { Competency } from "@/lib/assessment/types";

/** Money + progress the learner carries through the story. */
export interface ScenarioState {
  scenarioId: string;
  /** Current story day (1-based). */
  day: number;
  /** Money the learner can spend right now, in GH₵. */
  available: number;
  /** Money kept in the savings box — protected unless a choice touches it. */
  saved: number;
  /** Savings target in GH₵. */
  goalTarget: number;
  /** Hidden competency scores; never shown as a grade. */
  competencies: Partial<Record<Competency, number>>;
  /** Story flags used by conditional events (e.g. lentToKwame: 10). */
  flags: Record<string, number | string | boolean>;
  /** Consequences queued to appear on a later day. */
  scheduled: ScheduledEvent[];
  /** Node the learner is on. */
  nodeId: string;
  /** Node shown once the current consequence is acknowledged. */
  nextNodeId?: string | undefined;
  phase: ScenarioPhase;
  /** Consequence currently being shown. */
  consequence?: ScenarioConsequence | undefined;
  decisions: ScenarioDecisionLog[];
  endingId?: string | undefined;
  /** ISO timestamp of the last save, used by the resume state. */
  updatedAt: string;
}

export type ScenarioPhase = "intro" | "decision" | "consequence" | "complete";

export interface ScheduledEvent {
  /** Day the follow-up node should appear on. */
  dueDay: number;
  nodeId: string;
  /** Only fire when this flag is truthy. */
  requiresFlag?: string;
}

/** What one choice does to the learner's money and hidden scores. */
export interface ScenarioEffect {
  /** Change to spendable money, in GH₵. */
  available?: number;
  /** Change to the protected savings box, in GH₵. */
  saved?: number;
  /** Move money from pocket into the savings box. */
  transferToSaved?: number;
  /** Extra days this choice takes (default 1). */
  advanceDays?: number;
  competencies?: Partial<Record<Competency, number>>;
  flags?: Record<string, number | string | boolean>;
}

/** Shown right after a decision. Never framed as right or wrong. */
export interface ScenarioConsequence {
  /** Chip above the headline, e.g. "Decision: You lent Kwame GH₵10". */
  decisionChip?: string;
  headline: string;
  /** Warm narration of what happened. */
  title: string;
  body: string;
  image?: string;
  imageCaption?: string;
  /** Short note beside the ledger, e.g. "−GH₵10 for Kwame". */
  ledgerNote?: string;
  /** Hint that something will happen on a later day. */
  laterHint?: string;
  reflection?: string;
}

export interface ScenarioChoice {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  effect?: ScenarioEffect;
  consequence: ScenarioConsequence;
  /** Node to continue to. Choices may branch to different nodes. */
  next?: string;
  /** Consequence that only appears later in the story. */
  schedule?: { inDays: number; nodeId: string };
  /** Ending reached when there is no next node. */
  ending?: string;
}

export interface ScenarioNode {
  id: string;
  /** Story day this node happens on; omit to keep the running day. */
  day?: number;
  /** Chip above the title, e.g. "FRIENDSHIP & MONEY DILEMMA". */
  topic?: string;
  /** Place label, e.g. "Playground". */
  place?: string;
  title: string;
  situation: string;
  question?: string;
  image?: string;
  imageCaption?: string;
  imageBadge?: string;
  /** Extra context card, e.g. what Kwame says. */
  quote?: { speaker: string; text: string };
  tip?: string;
  choices: ScenarioChoice[];
}

export interface ScenarioEnding {
  id: string;
  title: string;
  body: string;
  reflection?: string;
}

export interface ScenarioDefinition {
  id: string;
  track: string;
  title: string;
  subtitle?: string;
  description: string;
  /** Total story days shown as "Day X of Y". */
  totalDays: number;
  goalLabel: string;
  goalTarget: number;
  startingAvailable: number;
  startingSaved: number;
  startNodeId: string;
  intro: { title: string; body: string; image?: string; cta?: string };
  nodes: ScenarioNode[];
  endings: ScenarioEnding[];
  competencies: Competency[];
  closingReflection: string;
}

export interface ScenarioDecisionLog {
  day: number;
  nodeId: string;
  nodeTitle: string;
  choiceId: string;
  choiceLabel: string;
  availableAfter: number;
  savedAfter: number;
}

/** What the summary screen renders. */
export interface ScenarioSummary {
  totalOnHand: number;
  available: number;
  saved: number;
  goalTarget: number;
  goalPercent: number;
  stillNeeded: number;
  decisions: ScenarioDecisionLog[];
  ending?: ScenarioEnding | undefined;
  strengths: Competency[];
}
