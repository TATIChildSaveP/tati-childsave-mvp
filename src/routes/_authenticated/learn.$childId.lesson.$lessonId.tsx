import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Screen, Card, TopBar, PrimaryButton, ChoiceButton } from "@/components/learning/primitives";
import { useRecordProgress } from "@/lib/learning/progress";
import { getLesson, getTrack } from "@/lib/learning/track";

export const Route = createFileRoute("/_authenticated/learn/$childId/lesson/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lesson — TATI ChildSave" },
      { name: "description", content: "A short, interactive lesson from the SAVE track." },
      { property: "og:title", content: "Lesson — TATI ChildSave" },
      { property: "og:description", content: "A short, interactive lesson about saving money." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { childId, lessonId } = useParams({ from: "/_authenticated/learn/$childId/lesson/$lessonId" });
  const track = getTrack("save");
  const lesson = getLesson(track, lessonId);
  const navigate = useNavigate();
  const record = useRecordProgress();
  const [checkpoint, setCheckpoint] = useState<string | null>(null);

  if (!lesson) {
    return (
      <Screen>
        <TopBar title="Lesson not found" backTo={`/learn/${childId}`} />
      </Screen>
    );
  }

  async function finish() {
    await record.mutateAsync({ childId, itemType: "lesson", itemId: lessonId, details: { checkpoint } });
    navigate({ to: "/learn/$childId", params: { childId } });
  }

  return (
    <Screen>
      <TopBar title={lesson.title} backTo={`/learn/${childId}`} />

      <Card className="mb-5 bg-accent text-accent-foreground">
        <p className="text-sm font-semibold uppercase tracking-widest">Big idea</p>
        <p className="mt-1 text-lg font-bold">{lesson.bigIdea}</p>
      </Card>

      <div className="space-y-4">
        {lesson.blocks.map((block, i) => {
          if (block.type === "text") {
            return (
              <p key={i} className="text-lg leading-relaxed">
                {block.body}
              </p>
            );
          }
          if (block.type === "highlight") {
            return (
              <Card key={i} className="border-primary bg-primary/5">
                <p className="text-lg font-semibold">{block.body}</p>
              </Card>
            );
          }
          if (block.type === "example") {
            return (
              <Card key={i}>
                <h3 className="text-lg font-bold">{block.title}</h3>
                <p className="mt-1 text-lg leading-relaxed">{block.body}</p>
              </Card>
            );
          }
          return (
            <Card key={i}>
              <h3 className="text-lg font-bold">{block.prompt}</h3>
              <div className="mt-3 space-y-2">
                {block.options.map((opt) => (
                  <ChoiceButton
                    key={opt.id}
                    state={checkpoint === opt.id ? "selected" : checkpoint ? "muted" : "idle"}
                    onClick={() => setCheckpoint(opt.id)}
                  >
                    {opt.label}
                  </ChoiceButton>
                ))}
              </div>
              {checkpoint ? (
                <p className="mt-3 rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground">
                  {checkpoint === block.bestOptionId ? "Nice thinking. " : "Interesting choice. "}
                  {block.feedback}
                </p>
              ) : null}
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={finish} disabled={record.isPending}>
          {record.isPending ? "Saving…" : "I've finished this lesson"}
        </PrimaryButton>
      </div>
    </Screen>
  );
}
