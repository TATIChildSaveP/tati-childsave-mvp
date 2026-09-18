import { schoolReopeningScenario } from "@/content/scenarios/school-reopening";
import type { ScenarioDefinition } from "./types";

const ALL: ScenarioDefinition[] = [schoolReopeningScenario];

export function getScenarioDefinition(id: string): ScenarioDefinition | undefined {
  return ALL.find((s) => s.id === id);
}

export function scenariosForTrack(trackId: string): ScenarioDefinition[] {
  return ALL.filter((s) => s.track === trackId);
}
