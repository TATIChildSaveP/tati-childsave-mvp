import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageHeader, Card, CardTitle, CardNote, Avatar, Button, ProgressBar, Badge } from "@/components/tati";
import { mockChildren, mockLessons } from "@/content/mock";

export const Route = createFileRoute("/parent/")({
  head: () => ({
    meta: [
      { title: "Parent portal — TATI ChildSave" },
      {
        name: "description",
        content: "Follow each child's money journey: progress, choices made and what to talk about at home.",
      },
      { property: "og:title", content: "Parent portal — TATI ChildSave" },
      { property: "og:description", content: "Plain-language insights for parents and guardians." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ParentHome,
});

function ParentHome() {
  return (
    <Page>
      <PageHeader
        backTo="/"
        eyebrow="Parent portal"
        title="Your children"
        subtitle="A quick look at where each learner has reached."
      />

      <div className="space-y-4">
        {mockChildren.map((child) => (
          <Card key={child.id}>
            <div className="flex items-center gap-3">
              <Avatar avatar={child.avatar} name={child.name} size="md" />
              <div className="min-w-0 flex-1">
                <CardTitle>
                  {child.name}, {child.age}
                </CardTitle>
                <CardNote className="truncate">
                  {child.className} · {child.school}
                </CardNote>
              </div>
              <Badge tone="primary">TATI Junior</Badge>
            </div>

            <div className="mt-4">
              <ProgressBar
                value={child.lessonsDone}
                max={mockLessons.length}
                label={`${child.lessonsDone} of ${mockLessons.length} lessons`}
                showPercent
                tone="success"
              />
            </div>

            <div className="mt-4">
              <Link
                to="/parent/child/$childId"
                params={{ childId: child.id }}
                className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-primary text-base font-extrabold text-primary-foreground"
              >
                View {child.name}'s journey →
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <Button to="/onboarding" variant="outline">
          + Add another child
        </Button>
        <Button to="/dashboard" variant="ghost">
          Open my live account dashboard
        </Button>
      </div>
    </Page>
  );
}
