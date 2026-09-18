import type { BadgeState } from "@/lib/gamification/types";
import { cn } from "@/lib/utils";

/** Badge shelf. Locked badges stay visible with a friendly "how to earn" hint. */
export function BadgeGrid({ badges, title = "My badges" }: { badges: BadgeState[]; title?: string }) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {badges.map(({ definition, earned }) => (
          <li
            key={definition.id}
            className={cn(
              "rounded-3xl border p-4 text-center",
              earned ? "border-success bg-success-soft" : "border-dashed border-border bg-card/60",
            )}
          >
            <span aria-hidden="true" className={cn("text-3xl", earned ? "" : "opacity-40")}>
              {definition.icon}
            </span>
            <p className={cn("mt-2 text-sm font-extrabold", earned ? "" : "text-muted-foreground")}>
              {definition.name}
            </p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">
              {earned ? definition.blurb : definition.hint}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
