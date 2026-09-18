/**
 * Central TATI design configuration.
 *
 * Colour values themselves live in src/styles.css as CSS variables. This file
 * holds the shared *shape* of the design language — spacing rhythm, radii,
 * typography scale and the semantic tone names used by components — so every
 * screen stays consistent.
 */

export const tatiTheme = {
  /** Page container: mobile-first, comfortable on tablets, capped on desktop. */
  container: "mx-auto w-full max-w-md px-4 sm:max-w-xl lg:max-w-3xl",
  /** Vertical rhythm between stacked sections. */
  sectionGap: "space-y-4",
  radius: {
    card: "rounded-3xl",
    control: "rounded-2xl",
    pill: "rounded-full",
  },
  /** Accessibility: every tappable target is at least 48x48px. */
  tapTarget: "min-h-[48px] min-w-[48px]",
  text: {
    pageTitle: "text-[28px] leading-tight font-extrabold",
    sectionTitle: "text-lg font-extrabold",
    body: "text-base leading-relaxed",
    muted: "text-base text-muted-foreground",
    caption: "text-sm text-muted-foreground",
  },
} as const;

/** Semantic tones shared by Badge, StatCard, Avatar rings and pills. */
export type Tone = "primary" | "success" | "warning" | "neutral" | "danger";

export const toneClasses: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-accent-foreground",
  neutral: "bg-muted text-muted-foreground",
  danger: "bg-destructive/10 text-destructive",
};

export const toneSolid: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-accent text-accent-foreground",
  neutral: "bg-secondary text-secondary-foreground",
  danger: "bg-destructive text-destructive-foreground",
};
