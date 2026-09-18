import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, Card, CardTitle, CardNote, Button, StatCard, Badge } from "@/components/tati";
import { mockChildren } from "@/content/mock";

export const Route = createFileRoute("/child/results")({
  head: () => ({
    meta: [
      { title: "What I learned — TATI ChildSave" },
      { name: "description", content: "A warm summary of the choices you made and what you can try next time." },
      { property: "og:title", content: "What I learned — TATI ChildSave" },
      { property: "og:description", content: "Every decision teaches you something." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChildResults,
});

function ChildResults() {
  const child = mockChildren[0]!;

  return (
    <Page withBottomNav>
      <PageHeader backTo="/child/home" eyebrow="Let's see what happened" title="What I learned" listenable />

      <Card className="text-center">
        <span aria-hidden="true" className="text-4xl">
          🎉
        </span>
        <h2 className="mt-2 text-2xl font-extrabold">Nice work, {child.name}!</h2>
        <p className="mt-2 text-base text-muted-foreground">
          You made your choices and saw what happened. That's exactly how savers learn.
        </p>
        <div className="mt-3 flex justify-center">
          <Badge tone="success" icon="⭐">
            +10 stars
          </Badge>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="Money kept" money={child.saved} tone="success" icon="🐖" />
        <StatCard label="Still to go" money={Math.max(0, child.target - child.saved)} tone="warning" icon="🎯" />
      </div>

      <Card className="mt-4">
        <CardTitle>What you did well</CardTitle>
        <CardNote>You decided how much to keep before you started spending.</CardNote>
      </Card>

      <Card className="mt-3">
        <CardTitle>What you could try next time</CardTitle>
        <CardNote>Keep one extra cedi each week and see how much faster your goal arrives.</CardNote>
      </Card>

      <div className="mt-6 space-y-3">
        <Button to="/child/learn" size="lg">
          Continue my journey →
        </Button>
        <Button to="/child/progress" variant="secondary">
          See my progress
        </Button>
      </div>
    </Page>
  );
}
