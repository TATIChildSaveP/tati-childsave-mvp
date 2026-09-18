import { useChildProgress } from "@/lib/progress/service";

/** Read-only gamification view, derived from the central Progress Service. */
export function useGamification(childId: string, trackId = "save") {
  const { game, isLoading, isError } = useChildProgress(childId, trackId);
  return { ...game, isLoading, isError };
}
