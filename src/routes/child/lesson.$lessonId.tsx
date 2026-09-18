import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, Card, CardTitle, Button, Badge, EmptyState } from "@/components/tati";
import { mockLessons } from "@/content/mock";

export const Route = createFileRoute("/child/lesson/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lesson — TATI ChildSave" },
      { name: "description", content: "A short TATI Junior mini-lesson about money, saving and choices." },
      { property: "og:title", content: "Lesson — TATI ChildSave" },
      { property: "og:description", content: "Learn one money idea in about five minutes." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = mockLessons.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <Page withBottomNav>
        <PageHeader backTo="/child/learn" title="Lesson" />
        <EmptyState
          title="This lesson isn't ready yet"
          description="Pick another lesson from your journey and come back soon."
          action={<Button to="/child/learn">Back to my journey</Button>}
        />
      </Page>
    );
  }

  return (
    <Page withBottomNav>
      <PageHeader backTo="/child/learn" eyebrow="Mini-lesson" title={lesson.title} listenable />

      <Badge tone="primary" icon="⏱">
        {lesson.minutes} min
      </Badge>

      <Card tone="primary" className="mt-3">
        <p className="text-sm font-extrabold uppercase tracking-wide opacity-80">Big idea</p>
        <p className="mt-1 text-xl font-extrabold leading-snug">{lesson.bigIdea}</p>
      </Card>

      <div className="mt-4 space-y-4">
        {lesson.body.map((paragraph, i) => (
          <Card key={i}>
            <p className="text-base leading-relaxed">{paragraph}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4" tone="muted">
        <CardTitle>Quick check-in</CardTitle>
        <p className="mt-1 text-base text-muted-foreground">
          Interactive checkpoints arrive with the lesson engine. Every answer will get a warm
          response — there is no wrong choice here.
        </p>
      </Card>

      <div className="mt-6 space-y-3">
        <Button to="/child/results" size="lg">
          Finish lesson →
        </Button>
        <Button to="/child/learn" variant="secondary">
          Back to my journey
        </Button>
      </div>
    </Page>
  );
}
