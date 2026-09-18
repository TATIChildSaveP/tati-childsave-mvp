import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  childProfilesQuery,
  useChildProfiles,
  useCreateChildProfile,
  type ChildProfile,
} from "@/lib/family";

export interface ProgressEvent {
  id: string;
  child_profile_id: string;
  track_id: string;
  item_type: string;
  item_id: string;
  status: string;
  score: number | null;
  max_score: number | null;
  details: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type Child = ChildProfile;

export { childProfilesQuery as childrenQuery };

export function progressQuery(childId: string) {
  return {
    queryKey: ["progress", childId],
    queryFn: async (): Promise<ProgressEvent[]> => {
      const { data, error } = await supabase
        .from("learning_progress")
        .select("*")
        .eq("child_profile_id", childId);
      if (error) throw error;
      return (data ?? []) as unknown as ProgressEvent[];
    },
  };
}

export function useChildren() {
  return useChildProfiles();
}

export function useChild(childId: string) {
  const q = useChildren();
  return { ...q, child: q.data?.find((c) => c.id === childId) };
}

export function useProgress(childId: string) {
  return useQuery(progressQuery(childId));
}

export interface RecordInput {
  childId: string;
  itemType: "assessment" | "lesson" | "scenario" | "reflection";
  itemId: string;
  score?: number;
  maxScore?: number;
  details?: Record<string, unknown>;
}

export function useRecordProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecordInput) => {
      const { error } = await supabase.from("learning_progress").upsert(
        {
          child_profile_id: input.childId,
          track_id: "save",
          item_type: input.itemType,
          item_id: input.itemId,
          status: "completed",
          score: input.score ?? null,
          max_score: input.maxScore ?? null,
          details: (input.details ?? {}) as never,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "child_profile_id,item_type,item_id" },
      );
      if (error) throw error;
    },
    onSuccess: (_d, input) => {
      qc.invalidateQueries({ queryKey: ["progress", input.childId] });
    },
  });
}

/** Kept for the existing parent dashboard: adds a learner to the signed-in parent's family. */
export function useAddChild() {
  return useCreateChildProfile();
}

export function isDone(events: ProgressEvent[] | undefined, itemType: string, itemId: string) {
  return !!events?.some((e) => e.item_type === itemType && e.item_id === itemId);
}

export function findEvent(events: ProgressEvent[] | undefined, itemType: string, itemId: string) {
  return events?.find((e) => e.item_type === itemType && e.item_id === itemId);
}
