import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Screen, Card, TopBar, PrimaryButton, ChoiceButton, ProgressBar } from "@/components/learning/primitives";
import { useRecordProgress } from "@/lib/learning/progress";
import { getAssessment, getTrack } from "@/lib/learning/track";

export const Route = createFileRoute("/_authenticated/learn/$childId/assessment/$assessmentId")({
  head: () => ({
    meta: [
      { title: "Check-in — TATI ChildSave" },
      { name: "description", content: "A short, friendly check-in about money choices. No pass or fail." },
      { property: "og:title", content: "Check-in — TATI ChildSave" },
      { property: "og:description", content: "A short, friendly check-in about money choices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const { childId, assessmentId } = useParams({
    from: "/_authenticated/learn/$childId/assessment/$assessmentId",
  });
  const track = getTrack("save");
  const assessment = getAssessment(track, assessmentId);
  const navigate = useNavigate();
  const record = useRecordProgress();

  const [index, setIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  if (!assessment) {
    return (
      <Screen>
        <TopBar title="Check-in not found" backTo={`/learn/${childId}`} />
      </Screen>
    );
  }

  const total = assessment.questions.length;
  const question = index >= 0 && index < total ? assessment.questions[index]! : null;
  const score = assessment.questions.filter((q) => answers[q.id] === q.bestOptionId).length;

  async function finish() {
    await record.mutateAsync({
      childId,
      itemType: "assessment",
      itemId: assessmentId,
      score,
      maxScore: total,
      details: { answers },
    });
    navigate({ to: "/learn/$childId", params: { childId } });
  }

  if (index === -1) {
    return (
      <Screen>
        <TopBar title={assessment.title} backTo={`/learn/${childId}`} />
        <Card>
          <p className="text-lg leading-relaxed">{assessment.intro}</p>
          <div className="mt-6">
            <PrimaryButton onClick={() => setIndex(0)}>Let's start</PrimaryButton>
          </div>
        </Card>
      </Screen>
    );
  }

  if (index >= total) {
    return (
      <Screen>
        <TopBar title="All done" backTo={`/learn/${childId}`} />
        <Card>
          <p className="text-lg">
            You answered {score} of {total} questions the way a saver would. Every answer tells us
            something useful — and the lessons ahead will build on it.
          </p>
          <div className="mt-6">
            <PrimaryButton onClick={finish} disabled={record.isPending}>
              {record.isPending ? "Saving…" : "Back to my journey"}
            </PrimaryButton>
          </div>
        </Card>
      </Screen>
    );
  }

  const selected = answers[question!.id];

  return (
    <Screen>
      <TopBar title={assessment.title} backTo={`/learn/${childId}`} />
      <div className="mb-5">
        <ProgressBar value={index} max={total} label={`Question ${index + 1} of ${total}`} />
      </div>

      <Card>
        <h2 className="text-xl font-bold leading-snug">{question!.prompt}</h2>
        <div className="mt-4 space-y-2">
          {question!.options.map((opt) => (
            <ChoiceButton
              key={opt.id}
              state={selected === opt.id ? "selected" : selected ? "muted" : "idle"}
              disabled={revealed}
              onClick={() => {
                setAnswers({ ...answers, [question!.id]: opt.id });
                setRevealed(true);
              }}
            >
              {opt.label}
            </ChoiceButton>
          ))}
        </div>

        {revealed ? (
          <>
            <p className="mt-4 rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground">
              {question!.feedback}
            </p>
            <div className="mt-4">
              <PrimaryButton
                onClick={() => {
                  setRevealed(false);
                  setIndex(index + 1);
                }}
              >
                {index + 1 === total ? "Finish" : "Next question"}
              </PrimaryButton>
            </div>
          </>
        ) : null}
      </Card>
    </Screen>
  );
}
