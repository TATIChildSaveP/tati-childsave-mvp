import { useEffect, useState } from "react";
import type { BadgeState } from "@/lib/gamification/types";
import { celebrateBadge } from "./celebrate";

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/**
 * Announces newly earned badges once each (subtle toast) and reports whether the
 * one big journey celebration is still owed.
 */
export function useBadgeCelebrations(childId: string, badges: BadgeState[], journeyComplete: boolean) {
  const [showJourneyCelebration, setShowJourneyCelebration] = useState(false);
  const earnedIds = badges
    .filter((b) => b.earned)
    .map((b) => b.definition.id)
    .join(",");

  useEffect(() => {
    if (!childId || earnedIds === "") return;
    const key = `tati.badges.${childId}`;
    const seen = read(key);
    const current = earnedIds.split(",");
    const fresh = current.filter((id) => !seen.includes(id));
    if (seen.length > 0) {
      for (const id of fresh) {
        const badge = badges.find((b) => b.definition.id === id);
        if (badge) celebrateBadge(badge.definition.icon, badge.definition.name, badge.definition.blurb);
      }
    }
    if (fresh.length > 0) write(key, current);
    // badges is derived from earnedIds; keeping it out avoids re-announcing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId, earnedIds]);

  useEffect(() => {
    if (!childId || !journeyComplete) return;
    const key = `tati.journey-celebrated.${childId}`;
    try {
      if (localStorage.getItem(key)) return;
    } catch {
      return;
    }
    setShowJourneyCelebration(true);
  }, [childId, journeyComplete]);

  function dismissJourneyCelebration() {
    setShowJourneyCelebration(false);
    try {
      localStorage.setItem(`tati.journey-celebrated.${childId}`, new Date().toISOString());
    } catch {
      /* ignore */
    }
  }

  return { showJourneyCelebration, dismissJourneyCelebration };
}
