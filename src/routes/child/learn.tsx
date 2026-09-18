import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader, Card, LessonCard, ScenarioCard, ProgressBar } from "@/components/tati";
import { mockLessons, mockScenarios, mockChildren } from "@/content/mock";

export const Route = createFileRoute("/child/learn")({
  head: () => ({
    meta: [
      { title: "My learning journey — TATI ChildSave" },
      {
        name: "description",
        content: "Mini-lessons and decision stories on the SAVE track, unlocked one step at a time.",
      },
      { property: "og:title", content: "My learning journey — TATI ChildSave" },
      { property: "og:description", content: "Lessons and decision stories for learners aged 8–12." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChildLearn,
});

function ChildLearn() {
  const child = mockChildren[0]!;

  return (
    <Page withBottomNav>
      <PageHeader
        backTo="/child/home"
        eyebrow="Track: SAVE"
        title="My learning journey"
        subtitle="Learn, decide, see what happens, then adjust your plan."
        listenable
      />

      <Card>
        <ProgressBar
          value={child.lessonsDone}
          max={mockLessons.length}
          label={`${child.lessonsDone} of ${mockLessons.length} lessons finished`}
          showPercent
          tone="success"
        />
      </Card>

      <h2 className="mb-3 mt-6 text-lg font-extrabold">Mini-lessons</h2>
      <Card className="space-y-3">
        {mockLessons.map((lesson, i) => (
          <LessonCard
            key={lesson.id}
            index={i + 1}
            title={lesson.title}
            subtitle={lesson.subtitle}
            minutes={lesson.minutes}
            status={lesson.status}
            to="/child/lesson/$lessonId"
            params={{ lessonId: lesson.id }}
          />
        ))}
      </Card>

      <h2 className="mb-3 mt-6 text-lg font-extrabold">Decision stories</h2>
      <div className="space-y-4">
        {mockScenarios.map((s) => (
          <ScenarioCard
            key={s.id}
            title={s.title}
            description={s.description}
            pocket={s.pocket}
            target={s.target}
            days={s.days}
            status={s.status}
            to="/child/scenario/$scenarioId"
            params={{ scenarioId: s.id }}
          />
        ))}
      </div>
    </Page>
  );
}
