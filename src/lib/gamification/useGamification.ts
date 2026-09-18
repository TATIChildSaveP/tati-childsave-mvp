import { useMemo } from "react";
import { useProgress } from "@/lib/learning/progress";
import { getTrack } from "@/lib/learning/track";
import { computeGamification } from "./engine";

/** Read-only gamification view for a learner. Derived, never stored twice. */
export function useGamification(childId: string, trackId = "save") {
  const { data: events, isLoading, isError } = useProgress(childId);
  const track = getTrack(trackId);
  const state = useMemo(() => computeGamification(track, events), [track, events]);
  return { ...state, isLoading, isError };
}
