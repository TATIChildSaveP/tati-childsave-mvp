import { toast } from "sonner";
import { rewardLabel, xpFor } from "@/lib/gamification/engine";
import type { RewardTrigger } from "@/lib/gamification/types";

/** Subtle celebration: a small, quiet note. Used after everyday steps. */
export function celebrateStep(trigger: RewardTrigger, note?: string) {
  toast.success(`+${xpFor(trigger)} XP · ${rewardLabel(trigger)}`, {
    ...(note ? { description: note } : {}),
    duration: 2600,
  });
}

/** Subtle celebration for a new badge. Never a full-screen takeover. */
export function celebrateBadge(icon: string, name: string, blurb: string) {
  toast(`${icon} New badge: ${name}`, { description: blurb, duration: 3400 });
}
