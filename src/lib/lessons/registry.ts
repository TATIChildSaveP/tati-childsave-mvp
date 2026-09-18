import { saveLessons } from "@/content/lessons/save";
import type { Lesson } from "./types";

const ALL: Lesson[] = [...saveLessons];

export function getLessonById(id: string): Lesson | undefined {
  return ALL.find((l) => l.id === id);
}

export function lessonsForTrack(trackId: string): Lesson[] {
  return ALL.filter((l) => l.track === trackId);
}

export function totalXpForTrack(trackId: string): number {
  return lessonsForTrack(trackId).reduce((sum, l) => sum + l.xpReward, 0);
}
