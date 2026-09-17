import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Screen, Card, TopBar, ProgressBar } from "@/components/learning/primitives";
import { useChild, useProgress, isDone } from "@/lib/learning/progress";
import { getTrack, itemPath, itemSubtitle, itemTitle } from "@/lib/learning/track";

export const Route = createFileRoute("/_authenticated/learn/$childId/")({
  head: () => ({
    meta: [
      { title: "SAVE journey — TATI ChildSave" },
      { name: "description", content: "Your SAVE journey: check-ins, lessons and decision stories." },
      { property: "og:title", content: "SAVE journey — TATI ChildSave" },
      { property: "og:description", content: "Lessons and decision stories about saving money." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Journey,
});

function Journey() {
  const { childId } = useParams({ from: "/_authenticated/learn/$childId/" });
  const track = getTrack("save");
  const { child } = useChild(childId);
  const { data: events } = useProgress(childId);

  const doneCount = track.sequence.filter((i) => isDone(events, i.kind, i.id)).length;
  const allDone = doneCount === track.sequence.length;

  return (
    <Screen>
      <TopBar title={child ? `Hi ${child.name}!` : "Your journey"} backTo="/dashboard" />

      <Card className="mb-6 bg-accent text-accent-foreground">
        <p className="text-sm font-semibold uppercase tracking-widest">Track</p>
        <h2 className="text-2xl font-bold">{track.name}</h2>
        <p className="mt-1">{track.tagline}</p>
        <div className="mt-4">
          <ProgressBar value={doneCount} max={track.sequence.length} label={`${doneCount} of ${track.sequence.length} steps`} />
        </div>
      </Card>

      <ol className="space-y-3">
        {track.sequence.map((item, index) => {
          const complete = isDone(events, item.kind, item.id);
          const locked = index > 0 && !isDone(events, track.sequence[index - 1]!.kind, track.sequence[index - 1]!.id);
          return (
            <li key={`${item.kind}-${item.id}`}>
              {locked ? (
                <div className="flex min-h-[48px] items-center gap-4 rounded-3xl border border-dashed border-border bg-card/60 px-5 py-4 text-muted-foreground">
                  <span aria-hidden="true">🔒</span>
                  <div>
                    <p className="font-semibold">{itemTitle(track, item)}</p>
                    <p className="text-sm">Finish the step before this one</p>
                  </div>
                </div>
              ) : (
                <Link
                  to={itemPath(childId, item)}
                  className="flex min-h-[48px] items-center gap-4 rounded-3xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                      complete ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {complete ? "✓" : index + 1}
                  </span>
                  <span>
                    <span className="block font-semibold">{itemTitle(track, item)}</span>
                    <span className="block text-sm text-muted-foreground">
                      {itemSubtitle(track, item)}
                      {complete ? " · done" : ""}
                    </span>
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {allDone ? (
        <Link
          to="/learn/$childId/summary"
          params={{ childId }}
          className="mt-6 flex min-h-[48px] items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground"
        >
          See my learning summary
        </Link>
      ) : null}
    </Screen>
  );
}
