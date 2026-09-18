import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  advance,
  applyChoice,
  beginScenario,
  createInitialState,
  getNode,
  summarize,
} from "./engine";
import type { ScenarioDefinition, ScenarioState } from "./types";

export type RunnerStatus = "loading" | "ready" | "resumed" | "interrupted";

function storageKey(childId: string, scenarioId: string) {
  return `tati.scenario.${childId}.${scenarioId}`;
}

function readSaved(key: string): ScenarioState | undefined {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ScenarioState) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Drives one scenario: state, persistence after every decision and resume.
 * All money/branching logic stays in engine.ts.
 */
export function useScenarioRunner(scenario: ScenarioDefinition, childId: string) {
  const key = storageKey(childId, scenario.id);
  const [status, setStatus] = useState<RunnerStatus>("loading");
  const [state, setState] = useState<ScenarioState>(() => createInitialState(scenario));
  const loaded = useRef(false);

  // Resume a story the learner left midway.
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const saved = readSaved(key);
    if (saved && saved.scenarioId === scenario.id && getNode(scenario, saved.nodeId)) {
      setState(saved);
      setStatus(saved.phase === "intro" ? "ready" : "resumed");
    } else {
      setStatus("ready");
    }
  }, [key, scenario]);

  const persist = useCallback(
    (next: ScenarioState) => {
      setState(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        setStatus("interrupted");
      }
    },
    [key],
  );

  const start = useCallback(() => persist(beginScenario(state)), [persist, state]);
  const choose = useCallback(
    (choiceId: string) => persist(applyChoice(scenario, state, choiceId)),
    [persist, scenario, state],
  );
  const continueOn = useCallback(() => persist(advance(scenario, state)), [persist, scenario, state]);
  const restart = useCallback(() => persist(createInitialState(scenario)), [persist, scenario]);
  const clearSaved = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* storage unavailable — nothing to clear */
    }
  }, [key]);

  const node = useMemo(() => getNode(scenario, state.nodeId), [scenario, state.nodeId]);
  const summary = useMemo(() => summarize(scenario, state), [scenario, state]);

  return { status, state, node, summary, start, choose, continueOn, restart, clearSaved };
}
