import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Screen } from "@/components/learning/primitives";
import { useChild, useProgress, isDone } from "@/lib/learning/progress";
import { getTrack, itemPath, itemSubtitle, itemTitle } from "@/lib/learning/track";
import type { TrackItem } from "@/lib/learning/types";
import { cn } from "@/lib/utils";
import journeyHero from "@/assets/journey-hero.png.asset.json";

export const Route = createFileRoute("/_authenticated/learn/$childId/")({
  head: () => ({
    meta: [
      { title: "My Journey — TATI ChildSave" },
      {
        name: "description",
        content: "Follow the SAVE adventure trail: lessons, choices and your school bag savings goal.",
      },
      { property: "og:title", content: "My Journey — TATI ChildSave" },
      {
        property: "og:description",
        content: "Follow the SAVE adventure trail: lessons, choices and your school bag savings goal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Journey,
});

type StepState = "done" | "current" | "locked";

function Journey() {
  const { childId } = useParams({ from: "/_authenticated/learn/$childId/" });
  const track = getTrack("save");
  const { child } = useChild(childId);
  const { data: events, isLoading, isError } = useProgress(childId);

  const steps = track.sequence.map((item, index) => ({
    item,
    index,
    done: isDone(events, item.kind, item.id),
  }));
  const doneCount = steps.filter((s) => s.done).length;
  const currentIndex = steps.findIndex((s) => !s.done);
  const allDone = currentIndex === -1;

  const goal = track.goal;
  const target = goal?.target ?? 80;
  const saved = steps.reduce((sum, s) => sum + (s.done ? (s.item.reward ?? 0) : 0), 0);
  const savedPct = Math.min(100, Math.round((saved / target) * 100));
  const dayNumber = Math.min(goal?.daysTotal ?? 14, doneCount + 1);
  const daysToGo = Math.max(0, (goal?.daysTotal ?? 14) - doneCount);

  const currentStep = allDone ? undefined : steps[currentIndex];

  return (
    <Screen>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">My Journey</h1>
        <div className="flex items-center gap-2">
          <span className="inline-flex min-h-[36px] items-center gap-1 rounded-full bg-primary-soft px-3 text-sm font-semibold text-primary">
            <span aria-hidden="true">🔊</span> Listen
          </span>
          <Link
            to="/dashboard"
            aria-label="Parent area"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
          >
            <span aria-hidden="true">👤</span>
          </Link>
        </div>
      </header>

      {/* Story banner */}
      <section className="relative mb-4 overflow-hidden rounded-3xl border border-border shadow-sm">
        <img
          src={journeyHero.url}
          alt="Kojo and a friend reading at their school in Accra"
          className="h-44 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/25 to-transparent" />
        <div className="absolute left-4 top-4">
          {goal ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
              🏆 {goal.challengeName}
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-background">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-90">TATI Junior · {track.name}</p>
          <h2 className="text-xl font-bold">Your {track.name} Journey 🎒</h2>
          <p className="text-sm opacity-90">
            {track.storyline} · {daysToGo} Days to Go!
          </p>
        </div>
      </section>

      {/* Goal card */}
      {goal ? (
        <section className="mb-5 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold">📗 {goal.title}</p>
              <p className="text-sm text-muted-foreground">
                Day {dayNumber} of {goal.daysTotal} · {doneCount} steps cleared
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-success">GH₵{saved}</p>
              <p className="text-sm text-muted-foreground">of GH₵{target}</p>
            </div>
          </div>
          <div
            className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={savedPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="School bag goal progress"
          >
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${savedPct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="font-semibold text-success">{savedPct}% Complete</span>
            <span className="text-muted-foreground">Only GH₵{Math.max(0, target - saved)} to go! 🎉</span>
          </div>
        </section>
      ) : null}

      {/* Trail */}
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h3 className="text-lg font-bold">Adventure Trail</h3>
          <p className="text-sm text-muted-foreground">Tap a step to review or play</p>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-foreground">
          🏅 Level {Math.max(1, Math.ceil((doneCount || 1) / 4))} Saver
        </span>
      </div>

      {isLoading ? (
        <p className="rounded-3xl border border-dashed border-border p-6 text-center text-muted-foreground">
          Loading your trail…
        </p>
      ) : isError ? (
        <p className="rounded-3xl border border-dashed border-destructive/40 p-6 text-center text-muted-foreground">
          We could not load your steps just now. Please try again in a moment.
        </p>
      ) : (
        <ol className="relative space-y-3 pl-11">
          <span aria-hidden="true" className="absolute bottom-6 left-[18px] top-4 w-1 rounded-full bg-muted" />
          <span
            aria-hidden="true"
            className="absolute left-[18px] top-4 w-1 rounded-full bg-success transition-all"
            style={{ height: `${Math.max(0, (doneCount / steps.length) * 100)}%` }}
          />
          {steps.map(({ item, index, done }) => (
            <TrailStep
              key={`${item.kind}-${item.id}`}
              childId={childId}
              item={item}
              stepNumber={index + 1}
              state={done ? "done" : index === currentIndex ? "current" : "locked"}
              track={track}
            />
          ))}
        </ol>
      )}

      {/* Grand finale */}
      {goal ? (
        <section className="mt-4 ml-11 rounded-3xl border-2 border-accent bg-accent-soft p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-accent-foreground">Grand Finale</span>
            <span className="rounded-full bg-card px-3 py-1 text-xs font-bold">GH₵{target} Total</span>
          </div>
          <h4 className="text-base font-bold">🎒 {goal.finaleTitle}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{goal.finaleBody}</p>
          {allDone ? (
            <Link
              to="/learn/$childId/summary"
              params={{ childId }}
              className="mt-4 flex min-h-[48px] items-center justify-center rounded-2xl bg-primary px-6 font-semibold text-primary-foreground"
            >
              See my learning summary
            </Link>
          ) : null}
        </section>
      ) : null}

      {/* Next action bar */}
      {currentStep ? (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Next action</p>
              <p className="truncate font-semibold">{itemTitle(track, currentStep.item)}</p>
            </div>
            <Link
              to={itemPath(childId, currentStep.item)}
              className="flex min-h-[48px] shrink-0 items-center justify-center rounded-2xl bg-success px-6 font-semibold text-success-foreground"
            >
              Continue →
            </Link>
          </div>
        </div>
      ) : null}

      <p className="sr-only">{child ? `Journey for ${child.name}` : "Journey"}</p>
    </Screen>
  );
}

function TrailStep({
  childId,
  item,
  stepNumber,
  state,
  track,
}: {
  childId: string;
  item: TrackItem;
  stepNumber: number;
  state: StepState;
  track: ReturnType<typeof getTrack>;
}) {
  const title = itemTitle(track, item);
  const label = item.label ?? itemSubtitle(track, item).toUpperCase();

  const bullet = (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -left-11 top-4 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background text-sm font-bold",
        state === "done"
          ? "bg-success text-success-foreground"
          : state === "current"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
      )}
    >
      {state === "done" ? "✓" : state === "current" ? "★" : (item.icon ?? stepNumber)}
    </span>
  );

  if (state === "locked") {
    return (
      <li className="relative">
        {bullet}
        <div className="rounded-3xl border border-dashed border-border bg-card/60 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Step {stepNumber} · {label}
          </p>
          <p className="font-semibold text-muted-foreground">{title}</p>
          {item.blurb ? <p className="text-sm text-muted-foreground">{item.blurb}</p> : null}
        </div>
      </li>
    );
  }

  return (
    <li className="relative">
      {bullet}
      <Link
        to={itemPath(childId, item)}
        className={cn(
          "block rounded-3xl border bg-card px-5 py-4 shadow-sm transition-colors hover:border-primary",
          state === "current" ? "border-2 border-primary" : "border-border",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {state === "current" ? "You are here · " : ""}Step {stepNumber} · {label}
          </p>
          {item.chip ? (
            <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success">{item.chip}</span>
          ) : null}
        </div>
        <p className="mt-0.5 font-bold">{title}</p>
        {item.blurb ? <p className="mt-0.5 text-sm text-muted-foreground">{item.blurb}</p> : null}
        {state === "current" ? (
          <span className="mt-3 flex min-h-[44px] items-center justify-center rounded-2xl bg-primary px-4 font-semibold text-primary-foreground">
            Play this step →
          </span>
        ) : null}
      </Link>
    </li>
  );
}
