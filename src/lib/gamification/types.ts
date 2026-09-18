// Reusable achievement domain types. Pure data shapes — no UI, no database.

import type { ProgressEvent } from "@/lib/learning/progress";
import type { Track, TrackItemKind } from "@/lib/learning/types";

/** Behaviours TATI rewards. Points are small on purpose: learning, not point farming. */
export type RewardTrigger = TrackItemKind | "journey";

export interface XpRule {
  trigger: RewardTrigger;
  xp: number;
  /** Child-friendly reason, e.g. "Lesson finished". */
  label: string;
}

/** Everything a badge rule may look at. Keeps badge logic declarative and testable. */
export interface BadgeContext {
  /** Completed journey steps as `${kind}:${id}`. */
  done: Set<string>;
  /** How many steps of each kind are finished. */
  counts: Record<TrackItemKind, number>;
  /** Cedis banked through the journey rewards. */
  savedCedis: number;
  journeyComplete: boolean;
  events: ProgressEvent[];
  track: Track;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;
  /** What the badge celebrates, in a child's words. */
  blurb: string;
  /** How to earn it — shown while still locked. */
  hint: string;
  earnedBy: (ctx: BadgeContext) => boolean;
}

export interface BadgeState {
  definition: BadgeDefinition;
  earned: boolean;
}

/** Streak-ready: computed from activity dates, ready for daily nudges later. */
export interface StreakState {
  currentDays: number;
  longestDays: number;
  lastActiveDate?: string;
  activeToday: boolean;
}

export interface GamificationState {
  xp: number;
  level: number;
  levelLabel: string;
  xpIntoLevel: number;
  xpForLevel: number;
  levelPct: number;
  journey: { done: number; total: number; pct: number };
  badges: BadgeState[];
  earnedBadges: BadgeState[];
  streak: StreakState;
  journeyComplete: boolean;
}

/** How loud a celebration should be. Most moments are "subtle". */
export type CelebrationLevel = "subtle" | "major";
