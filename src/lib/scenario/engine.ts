// Pure branching-scenario logic. No React, no storage, no UI —
// so TATI Teen and Plus stories can reuse it untouched.

import type { Competency } from "@/lib/assessment/types";
import type {
  ScenarioChoice,
  ScenarioDefinition,
  ScenarioNode,
  ScenarioState,
  ScenarioSummary,
} from "./types";

export function getNode(scenario: ScenarioDefinition, nodeId: string): ScenarioNode | undefined {
  return scenario.nodes.find((n) => n.id === nodeId);
}

export function createInitialState(scenario: ScenarioDefinition): ScenarioState {
  const start = getNode(scenario, scenario.startNodeId);
  return {
    scenarioId: scenario.id,
    day: start?.day ?? 1,
    available: scenario.startingAvailable,
    saved: scenario.startingSaved,
    goalTarget: scenario.goalTarget,
    competencies: {},
    flags: {},
    scheduled: [],
    nodeId: scenario.startNodeId,
    phase: "intro",
    decisions: [],
    updatedAt: new Date().toISOString(),
  };
}

export function beginScenario(state: ScenarioState): ScenarioState {
  return { ...state, phase: "decision", updatedAt: new Date().toISOString() };
}

/** Apply a choice: money changes, hidden scores, flags, delayed events. */
export function applyChoice(
  scenario: ScenarioDefinition,
  state: ScenarioState,
  choiceId: string,
): ScenarioState {
  const node = getNode(scenario, state.nodeId);
  const choice = node?.choices.find((c) => c.id === choiceId);
  if (!node || !choice) return state;

  const effect = choice.effect ?? {};
  const transfer = effect.transferToSaved ?? 0;
  const available = state.available + (effect.available ?? 0) - transfer;
  const saved = state.saved + (effect.saved ?? 0) + transfer;

  const competencies = { ...state.competencies };
  for (const [key, delta] of Object.entries(effect.competencies ?? {})) {
    const k = key as Competency;
    competencies[k] = (competencies[k] ?? 0) + (delta ?? 0);
  }

  const scheduled = [...state.scheduled];
  if (choice.schedule) {
    scheduled.push({
      dueDay: state.day + choice.schedule.inDays,
      nodeId: choice.schedule.nodeId,
    });
  }

  return {
    ...state,
    available,
    saved,
    competencies,
    flags: { ...state.flags, ...(effect.flags ?? {}) },
    scheduled,
    phase: "consequence",
    consequence: choice.consequence,
    nextNodeId: choice.next,
    endingId: choice.ending,
    decisions: [
      ...state.decisions,
      {
        day: state.day,
        nodeId: node.id,
        nodeTitle: node.title,
        choiceId: choice.id,
        choiceLabel: choice.label,
        availableAfter: available,
        savedAfter: saved,
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Move past the consequence. A scheduled follow-up that is now due takes
 * priority, which is how delayed consequences reach the learner.
 */
export function advance(scenario: ScenarioDefinition, state: ScenarioState): ScenarioState {
  const node = getNode(scenario, state.nodeId);
  const choice: ScenarioChoice | undefined = node?.choices.find(
    (c) => c.id === state.decisions[state.decisions.length - 1]?.choiceId,
  );
  const day = Math.min(scenario.totalDays, state.day + (choice?.effect?.advanceDays ?? 1));

  const due = state.scheduled
    .filter((e) => e.dueDay <= day && (!e.requiresFlag || !!state.flags[e.requiresFlag]))
    .sort((a, b) => a.dueDay - b.dueDay)[0];

  const nextId = due?.nodeId ?? state.nextNodeId;
  const nextNode = nextId ? getNode(scenario, nextId) : undefined;

  if (!nextNode) {
    return {
      ...state,
      day,
      phase: "complete",
      consequence: undefined,
      nextNodeId: undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    ...state,
    day: nextNode.day ?? day,
    nodeId: nextNode.id,
    scheduled: due ? state.scheduled.filter((e) => e !== due) : state.scheduled,
    phase: "decision",
    consequence: undefined,
    nextNodeId: undefined,
    updatedAt: new Date().toISOString(),
  };
}

export function summarize(scenario: ScenarioDefinition, state: ScenarioState): ScenarioSummary {
  const goalPercent = Math.min(100, Math.round((state.saved / state.goalTarget) * 100));
  const strengths = (Object.entries(state.competencies) as [Competency, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  return {
    totalOnHand: state.available + state.saved,
    available: state.available,
    saved: state.saved,
    goalTarget: state.goalTarget,
    goalPercent,
    stillNeeded: Math.max(0, state.goalTarget - state.saved),
    decisions: state.decisions,
    ending: scenario.endings.find((e) => e.id === state.endingId) ?? scenario.endings[0],
    strengths,
  };
}

export function dayProgressPercent(scenario: ScenarioDefinition, state: ScenarioState): number {
  return Math.min(100, Math.round((state.day / scenario.totalDays) * 100));
}
