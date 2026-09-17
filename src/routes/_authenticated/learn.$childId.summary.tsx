import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Screen, Card, TopBar } from "@/components/learning/primitives";
import { findEvent, useChild, useProgress } from "@/lib/learning/progress";
import { getTrack } from "@/lib/learning/track";
import { buildInsights } from "@/lib/learning/insights";

export const Route = createFileRoute("/_authenticated/learn/$childId/summary")({
  head: () => ({
    meta: [
      { title: "Learning summary — TATI ChildSave" },
      { name: "description", content: "What your child learned on the SAVE track, and what to talk about at home." },
      { property: "og:title", content: "Learning summary — TATI ChildSave" },
      { property: "og:description", content: "A summary of the SAVE track journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SummaryPage,
});

function SummaryPage() {
  const { childId } = useParams({ from: "/_authenticated/learn/$childId/summary" });
  const track = getTrack("save");
  const { child } = useChild(childId);
  const { data: events } = useProgress(childId);

  const pre = findEvent(events, "assessment", "save-pre");
  const post = findEvent(events, "assessment", "save-post");
  const insights = buildInsights(track, events ?? []);

  return (
    <Screen>
      <TopBar title="Learning summary" backTo={`/learn/${childId}`} />

      <Card className="bg-accent text-accent-foreground">
        <h2 className="text-2xl font-bold">{child ? `${child.name} finished SAVE` : "SAVE track finished"}</h2>
        <p className="mt-1">Here's what the journey showed.</p>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-sm text-muted-foreground">First check-in</p>
          <p className="text-2xl font-bold">
            {pre?.score ?? "–"}/{pre?.max_score ?? "–"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Final check-in</p>
          <p className="text-2xl font-bold">
            {post?.score ?? "–"}/{post?.max_score ?? "–"}
          </p>
        </Card>
      </div>

      <Card className="mt-5">
        <h3 className="text-lg font-bold">What we noticed</h3>
        <ul className="mt-3 space-y-2">
          {insights.map((i) => (
            <li key={i} className="rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground">
              {i}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-5">
        <h3 className="text-lg font-bold">Ready for next time</h3>
        <p className="mt-2 text-lg">
          Choose one real goal together this week — an amount and a date — and decide where the money
          will sleep: a money box, a Mobile Money wallet, or a children's bank account.
        </p>
      </Card>

      <Link
        to="/dashboard"
        className="mt-6 flex min-h-[48px] items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground"
      >
        Back to the parent space
      </Link>
    </Screen>
  );
}
