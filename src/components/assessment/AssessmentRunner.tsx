import { Card, ChoiceButton, PrimaryButton, ProgressBar, Screen, TopBar } from "@/components/learning/primitives";
import { useAssessmentRunner } from "@/lib/assessment/useAssessmentRunner";
import type { AssessmentDefinition, AssessmentResult } from "@/lib/assessment/types";

/**
 * Reusable one-question-at-a-time assessment UI.
 * Content comes from the definition; this component holds no questions.
 */
export function AssessmentRunner({
  definition,
  backTo,
  saving = false,
  onComplete,
  completeLabel = "Back to my journey",
}: {
  definition: AssessmentDefinition;
  backTo: string;
  saving?: boolean;
  onComplete: (result: AssessmentResult) => void;
  completeLabel?: string;
}) {
  const runner = useAssessmentRunner(definition);

  if (runner.stage === "intro") {
    return (
      <Screen>
        <TopBar title={definition.title} backTo={backTo} />
        <Card>
          <p className="text-lg leading-relaxed">{definition.intro}</p>
          <div className="mt-6">
            <PrimaryButton onClick={runner.start}>Let's start</PrimaryButton>
          </div>
        </Card>
      </Screen>
    );
  }

  if (runner.stage === "complete") {
    const { result } = runner;
    return (
      <Screen>
        <TopBar title="All done" backTo={backTo} />
        <Card>
          <p className="text-5xl" aria-hidden="true">
            🎉
          </p>
          <p className="mt-3 text-lg leading-relaxed">{definition.outro}</p>
          {definition.showScoreToChild ? (
            <p className="mt-3 text-base text-muted-foreground">
              You picked the saver's choice on {result.points} of {result.maxPoints} stories.
            </p>
          ) : null}
          <div className="mt-6">
            <PrimaryButton onClick={() => onComplete(result)} disabled={saving}>
              {saving ? "Saving…" : completeLabel}
            </PrimaryButton>
          </div>
        </Card>
      </Screen>
    );
  }

  const question = runner.question!;

  return (
    <Screen>
      <TopBar title={definition.title} backTo={backTo} />
      <div className="mb-5">
        <ProgressBar
          value={runner.index}
          max={runner.total}
          label={`Question ${runner.index + 1} of ${runner.total}`}
        />
      </div>

      <Card key={question.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
        {question.illustration ? (
          <p className="text-4xl" aria-hidden="true">
            {question.illustration}
          </p>
        ) : null}
        <h2 className="mt-2 text-xl font-bold leading-snug">{question.question}</h2>

        <div className="mt-4 space-y-2">
          {question.options.map((opt) => (
            <ChoiceButton
              key={opt.id}
              state={runner.selected === opt.id ? "selected" : runner.selected ? "muted" : "idle"}
              onClick={() => runner.select(opt.id)}
            >
              {opt.icon ? (
                <span aria-hidden="true" className="mr-2">
                  {opt.icon}
                </span>
              ) : null}
              {opt.label}
            </ChoiceButton>
          ))}
        </div>

        {runner.selected ? (
          <p className="mt-4 rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground">
            {question.options.find((o) => o.id === runner.selected)?.response ?? question.feedback}
          </p>
        ) : null}

        <div className="mt-5 flex gap-3">
          {!runner.isFirst ? (
            <button
              type="button"
              onClick={runner.back}
              className="min-h-[48px] shrink-0 rounded-2xl border-2 border-border bg-card px-5 text-base font-semibold"
            >
              Back
            </button>
          ) : null}
          <PrimaryButton onClick={runner.next} disabled={!runner.canAdvance}>
            {runner.isLast ? "Finish" : "Next"}
          </PrimaryButton>
        </div>
      </Card>
    </Screen>
  );
}
