import { createFileRoute } from "@tanstack/react-router";
import {
  Page,
  Card,
  CardTitle,
  Avatar,
  Badge,
  StatCard,
  ScenarioCard,
  LessonCard,
  ListenButton,
  XPIndicator,
} from "@/components/tati";
import { mockChildren, mockLessons, mockScenarios, mockAchievements } from "@/content/mock";

export const Route = createFileRoute("/child/home")({
  head: () => ({
    meta: [
      { title: "My money home — TATI ChildSave" },
      {
        name: "description",
        content: "Your challenge, your savings and your learning journey in one place, all in cedis.",
      },
      { property: "og:title", content: "My money home — TATI ChildSave" },
      { property: "og:description", content: "Track your pocket money, goals and badges." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChildHome,
});

function ChildHome() {
  const child = mockChildren[0]!;
  const challenge = mockScenarios[0]!;

  return (
    <Page withBottomNav>
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-primary">TATI ChildSave</p>
          <p className="text-sm font-bold text-muted-foreground">Home</p>
        </div>
        <ListenButton />
      </header>

      <Card className="flex items-center gap-3">
        <Avatar avatar={child.avatar} name={child.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-extrabold">Hi {child.name} 👋</p>
          <p className="text-sm font-bold text-muted-foreground">
            {child.className} · {child.teacher}
          </p>
        </div>
      </Card>

      <XPIndicator xp={child.xp} level={child.level} className="mt-3" />

      <div className="mt-3 grid grid-cols-3 gap-3">
        <StatCard label="Available" money={child.available} tone="primary" />
        <StatCard label="Saved" money={child.saved} tone="success" />
        <StatCard label="Target" money={child.target} tone="warning" />
      </div>

      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Your current challenge</h2>
        <span className="text-sm font-extrabold text-success">New mission</span>
      </div>
      <ScenarioCard
        title={challenge.title}
        description={challenge.description}
        pocket={challenge.pocket}
        target={challenge.target}
        days={challenge.days}
        to="/child/scenario/$scenarioId"
        params={{ scenarioId: challenge.id }}
      />

      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">📖 My learning journey</h2>
        <Badge tone="neutral">
          {child.lessonsDone} of {mockLessons.length} completed
        </Badge>
      </div>
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

      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">🏅 Achievements</h2>
        <span className="text-sm font-bold text-muted-foreground">
          {mockAchievements.filter((a) => !a.unlocked).length} locked
        </span>
      </div>
      <div className="space-y-3">
        {mockAchievements.map((a) => (
          <Card key={a.id} className="flex items-center gap-3">
            <span aria-hidden="true" className="text-2xl">
              {a.icon}
            </span>
            <div className="min-w-0 flex-1">
              <CardTitle>{a.title}</CardTitle>
              <p className="truncate text-sm text-muted-foreground">{a.note}</p>
            </div>
            <Badge tone={a.unlocked ? "success" : "neutral"}>{a.unlocked ? "Earned" : "Locked"}</Badge>
          </Card>
        ))}
      </div>
    </Page>
  );
}
