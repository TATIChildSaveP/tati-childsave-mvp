import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProgressEvent {
  id: string;
  child_id: string;
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

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  avatar: string;
  tier: string;
  created_at: string;
}

export function childrenQuery() {
  return {
    queryKey: ["children"],
    queryFn: async (): Promise<Child[]> => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Child[];
    },
  };
}

export function progressQuery(childId: string) {
  return {
    queryKey: ["progress", childId],
    queryFn: async (): Promise<ProgressEvent[]> => {
      const { data, error } = await supabase
        .from("progress_events")
        .select("*")
        .eq("child_id", childId);
      if (error) throw error;
      return (data ?? []) as unknown as ProgressEvent[];
    },
  };
}

export function useChildren() {
  return useQuery(childrenQuery());
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
  itemType: "assessment" | "lesson" | "scenario";
  itemId: string;
  score?: number;
  maxScore?: number;
  details?: Record<string, unknown>;
}

export function useRecordProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecordInput) => {
      const { error } = await supabase.from("progress_events").upsert(
        {
          child_id: input.childId,
          track_id: "save",
          item_type: input.itemType,
          item_id: input.itemId,
          status: "completed",
          score: input.score ?? null,
          max_score: input.maxScore ?? null,
          details: (input.details ?? {}) as never,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "child_id,item_type,item_id" },
      );
      if (error) throw error;
    },
    onSuccess: (_d, input) => {
      qc.invalidateQueries({ queryKey: ["progress", input.childId] });
    },
  });
}

export function useAddChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; age: number; avatar: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const parentId = userData.user?.id;
      if (!parentId) throw new Error("You need to be signed in.");
      const { error } = await supabase.from("children").insert({
        parent_id: parentId,
        name: input.name,
        age: input.age,
        avatar: input.avatar,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["children"] }),
  });
}

export function isDone(events: ProgressEvent[] | undefined, itemType: string, itemId: string) {
  return !!events?.some((e) => e.item_type === itemType && e.item_id === itemId);
}

export function findEvent(events: ProgressEvent[] | undefined, itemType: string, itemId: string) {
  return events?.find((e) => e.item_type === itemType && e.item_id === itemId);
}
