import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toneClasses, toneSolid, type Tone } from "@/lib/theme";

export function Badge({
  children,
  tone = "neutral",
  solid = false,
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  solid?: boolean;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold",
        solid ? toneSolid[tone] : toneClasses[tone],
        className,
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="leading-none">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

export function XPIndicator({
  xp,
  nextLevelXp = 100,
  level = 1,
  className,
}: {
  xp: number;
  nextLevelXp?: number;
  level?: number;
  className?: string;
}) {
  const pct = nextLevelXp > 0 ? Math.min(100, Math.round((xp / nextLevelXp) * 100)) : 0;
  return (
    <div
      className={cn("flex items-center gap-3 rounded-full bg-accent-soft px-3 py-2", className)}
      aria-label={`Level ${level}, ${xp} of ${nextLevelXp} stars`}
    >
      <span className="text-lg" aria-hidden="true">
        ⭐
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-xs font-extrabold text-accent-foreground">
          <span>Level {level}</span>
          <span>
            {xp}/{nextLevelXp}
          </span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-card/70">
          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function MoneyDisplay({
  amount,
  tone = "default",
  size = "md",
  label,
  className,
}: {
  amount: number;
  tone?: "default" | "primary" | "success" | "accent";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}) {
  const value = `GH₵${amount.toLocaleString("en-GH")}`;
  return (
    <span className={cn("inline-flex flex-col", className)}>
      {label ? <span className="text-sm font-bold text-muted-foreground">{label}</span> : null}
      <span
        className={cn(
          "font-extrabold tabular-nums",
          size === "sm" && "text-base",
          size === "md" && "text-xl",
          size === "lg" && "text-3xl",
          tone === "primary" && "text-primary",
          tone === "success" && "text-success",
          tone === "accent" && "text-accent",
        )}
      >
        {value}
      </span>
    </span>
  );
}
