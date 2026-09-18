// Turns progress data into plain-language sentences for the parent dashboard.
// No percentages, no jargon — parents read sentences, not analytics.

import type { Competency } from "@/lib/assessment/types";
import type { SkillGrowth } from "./growth";
import type { ProgressEvent } from "./progress";
import type { Track, TrackItem } from "./types";
import { itemTitle } from "./track";

type Phrase = { strong: string; growing: string; talk: string };

const PHRASES: Record<Competency, Phrase> = {
  "needs-vs-wants": {
    strong: "tells the difference between what is needed now and what can wait",
    growing: "is still practising the pause between a want and a need",
    talk: "Next time you shop together, ask which item on the list is a need and which is a want.",
  },
  earning: {
    strong: "sees that money can be earned through effort and helping out",
    growing: "is still exploring how small jobs turn into money",
    talk: "Ask what small job they could do this week to earn a little towards a goal.",
  },
  saving: {
    strong: "is becoming more confident at setting money aside for a goal",
    growing: "is still building the habit of keeping a little back",
    talk: "Ask what they would do if they received GH₵50 today.",
  },
  "goal-setting": {
    strong: "can name a goal and work out what it takes to reach it",
    growing: "is still learning to put an amount and a date on a goal",
    talk: "Choose one real goal together — how much, and by when?",
  },
  budgeting: {
    strong: "plans money before spending it",
    growing: "is still learning to plan before the money is spent",
    talk: "Plan next week's small spending together on one sheet of paper.",
  },
  "tracking-money": {
    strong: "keeps track of where money goes",
    growing: "is still getting used to writing down what was spent",
    talk: "Ask them to show you their money notes and what surprised them.",
  },
  "spending-decisions": {
    strong: "stops and thinks before spending",
    growing: "is still practising the stop-think-choose pause",
    talk: "Ask about a time this week they nearly bought something and changed their mind.",
  },
  "borrowing-lending": {
    strong: "thinks carefully before lending or borrowing money",
    growing: "is still working out what to do when a friend asks for money",
    talk: "Ask what they would say if a friend asked to borrow GH₵10 until Friday.",
  },
  "financial-resilience": {
    strong: "adjusts the plan when something unexpected happens",
    growing: "is still learning what to do when plans change",
    talk: "Ask what they would change if their savings plan went off track.",
  },
  "money-safety": {
    strong: "thinks about keeping money in a safe place",
    growing: "is still learning where money is safest",
    talk: "Talk about where money is safest at home, and why.",
  },
};

/** One warm sentence about a skill, e.g. "Kojo is becoming more confident…". */
export function skillSentence(name: string, skill: SkillGrowth): string {
  const phrase = PHRASES[skill.competency];
  if (!phrase) return `${name} is practising ${skill.label.toLowerCase()}.`;
  const base = skill.after >= 0.5 ? phrase.strong : phrase.growing;
  const grew = skill.grew ? " This grew since the first check-in." : "";
  return `${name} ${base}.${grew}`;
}

export interface JourneySnapshot {
  doneItems: TrackItem[];
  currentItem?: TrackItem;
  completionPct: number;
  lessonsDone: number;
  lessonsTotal: number;
  scenarioDone: number;
  scenarioTotal: number;
  scenarioStatus: string;
  recentTitles: string[];
}

function isDone(events: ProgressEvent[], item: TrackItem) {
  return events.some((e) => e.item_type === item.kind && e.item_id === item.id);
}

export function journeySnapshot(track: Track, events: ProgressEvent[]): JourneySnapshot {
  const doneItems = track.sequence.filter((i) => isDone(events, i));
  const currentItem = track.sequence.find((i) => !isDone(events, i));
  const lessons = track.sequence.filter((i) => i.kind === "lesson");
  const chapters = track.sequence.filter((i) => i.kind === "scenario");
  const lessonsDone = lessons.filter((i) => isDone(events, i)).length;
  const scenarioDone = chapters.filter((i) => isDone(events, i)).length;

  const scenarioStatus =
    scenarioDone === 0
      ? "The School Reopening Challenge has not started yet."
      : scenarioDone >= chapters.length
        ? "The School Reopening Challenge is complete — all 14 days played through."
        : `Part-way through the School Reopening Challenge — chapter ${scenarioDone} of ${chapters.length} done.`;

  const recent = [...doneItems].slice(-3).reverse();

  return {
    doneItems,
    ...(currentItem ? { currentItem } : {}),
    completionPct:
      track.sequence.length > 0 ? Math.round((doneItems.length / track.sequence.length) * 100) : 0,
    lessonsDone,
    lessonsTotal: lessons.length,
    scenarioDone,
    scenarioTotal: chapters.length,
    scenarioStatus,
    recentTitles: recent.map((i) => itemTitle(track, i)),
  };
}

/** Two or three conversation starters grounded in what was learned most recently. */
export function conversationStarters(
  name: string,
  track: Track,
  events: ProgressEvent[],
  growth: SkillGrowth[],
): string[] {
  const out: string[] = [];
  const snapshot = journeySnapshot(track, events);
  const recent = [...snapshot.doneItems].slice(-4).reverse();

  for (const item of recent) {
    if (out.length >= 2) break;
    if (item.kind === "lesson") {
      out.push(`Ask ${name} what "${itemTitle(track, item)}" taught them about money.`);
    } else if (item.kind === "scenario") {
      out.push(
        `Ask ${name} about a choice they made in the School Reopening Challenge and whether they would choose the same again.`,
      );
    } else if (item.kind === "reflection") {
      out.push(`Ask ${name} what they thought about during "${itemTitle(track, item)}".`);
    }
  }

  const weakest = [...growth].sort((a, b) => a.after - b.after)[0];
  if (weakest && PHRASES[weakest.competency]) {
    out.push(PHRASES[weakest.competency].talk);
  }

  if (out.length === 0) {
    out.push(`Ask ${name} what they would do if they received GH₵50 today.`);
    out.push(`Ask ${name} what they are saving for right now.`);
  }

  return out.slice(0, 3);
}
