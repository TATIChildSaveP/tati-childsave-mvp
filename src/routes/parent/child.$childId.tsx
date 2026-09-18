import { createFileRoute } from "@tanstack/react-router";
import {
  Page,
  PageHeader,
  Card,
  CardTitle,
  Avatar,
  Button,
  StatCard,
  ProgressRing,
  LessonCard,
  EmptyState,
} from "@/components/tati";
import { mockChildren, mockLessons, mockInsights } from "@/content/mock";

export const Route = createFileRoute("/parent/child/$childId")({
  head: () => ({
    meta: [
      { title: "Child journey — TATI ChildSave parent portal" },
      {
        name: "description",
        content: "Progress, savings and plain-language insights for one child on the SAVE track.",
      },
      { property: "og:title", content: "Child journey — TATI ChildSave parent portal" },
      { property: "og:description", content: "See what your child is ready to talk about at home." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ParentChild,
});

function ParentChild() {
  const { childId } = Route.useParams();
  const child = mockChildren.find((c) => c.id === childId);

  if (!child) {
    return (
      <Page>
        <PageHeader backTo="/parent" title="Child journey" />
        <EmptyState
          title="We couldn't find that learner"
          description="Pick a child from your parent portal."
          action={<Button to="/parent">Back to parent portal</Button>}
        />
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader backTo="/parent" eyebrow="Parent portal" title={`${child.name}'s journey`} />

      <Card className="flex items-center gap-4">
        <Avatar avatar={child.avatar} name={child.name} size="lg" ring="primary" />
        <div>
          <CardTitle>
            {child.name}, {child.age}
          </CardTitle>
          <p className="text-base text-muted-foreground">
            {child.className} · {child.teacher}
          </p>
        </div>
      </Card>

      <div className="mt-4 flex justify-center">
        <ProgressRing value={child.saved} max={child.target} caption="Towards the goal" tone="success" size={120} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCard label="Available" money={child.available} tone="primary" />
        <StatCard label="Saved" money={child.saved} tone="success" />
        <StatCard label="Target" money={child.target} tone="warning" />
      </div>

      <h2 className="mb-3 mt-6 text-lg font-extrabold">What we're noticing</h2>
      <Card className="space-y-2">
        {mockInsights.map((insight, i) => (
          <p key={i} className="text-base">
            • {insight}
          </p>
        ))}
      </Card>

      <h2 className="mb-3 mt-6 text-lg font-extrabold">Lessons</h2>
      <Card className="space-y-3">
        {mockLessons.map((lesson, i) => (
          <LessonCard
            key={lesson.id}
            index={i + 1}
            title={lesson.title}
            subtitle={lesson.subtitle}
            minutes={lesson.minutes}
            status={lesson.status}
          />
        ))}
      </Card>

      <div className="mt-6">
        <Button to="/parent" variant="secondary">
          Back to all children
        </Button>
      </div>
    </Page>
  );
}
