import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, Card, CardTitle, ProgressRing, ProgressBar, StatCard, Badge, XPIndicator } from "@/components/tati";
import { mockChildren, mockLessons, mockAchievements } from "@/content/mock";

export const Route = createFileRoute("/child/progress")({
  head: () => ({
    meta: [
      { title: "My progress — TATI ChildSave" },
      { name: "description", content: "See how much you've saved, how far you've come and the badges ahead." },
      { property: "og:title", content: "My progress — TATI ChildSave" },
      { property: "og:description", content: "Savings, lessons and badges at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChildProgress,
});

function ChildProgress() {
  const child = mockChildren[0]!;

  return (
    <Page withBottomNav>
      <PageHeader backTo="/child/home" eyebrow="My numbers" title="My progress" listenable />

      <Card className="flex flex-col items-center gap-4 text-center">
        <ProgressRing value={child.saved} max={child.target} caption="Towards my goal" tone="success" size={120} />
        <p className="text-base text-muted-foreground">
          GH₵{child.saved} saved of GH₵{child.target}. Small amounts, kept often, add up.
        </p>
      </Card>

      <XPIndicator xp={child.xp} level={child.level} className="mt-4" />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="Available" money={child.available} tone="primary" />
        <StatCard label="Saved" money={child.saved} tone="success" />
      </div>

      <Card className="mt-4">
        <CardTitle>Lessons</CardTitle>
        <div className="mt-3">
          <ProgressBar
            value={child.lessonsDone}
            max={mockLessons.length}
            label={`${child.lessonsDone} of ${mockLessons.length} finished`}
            showPercent
          />
        </div>
      </Card>

      <h2 className="mb-3 mt-6 text-lg font-extrabold">Badges</h2>
      <div className="grid grid-cols-3 gap-3">
        {mockAchievements.map((a) => (
          <Card key={a.id} className="text-center">
            <span aria-hidden="true" className="text-3xl">
              {a.icon}
            </span>
            <p className="mt-2 text-sm font-extrabold">{a.title}</p>
            <div className="mt-2 flex justify-center">
              <Badge tone={a.unlocked ? "success" : "neutral"}>{a.unlocked ? "Earned" : "Locked"}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
