import { useCallback, useMemo, useState } from "react";
import { scoreAssessment } from "./engine";
import type { AssessmentDefinition, ResponseMap } from "./types";

export type RunnerStage = "intro" | "question" | "complete";

/** Drives one-question-at-a-time navigation, selection state and completion. */
export function useAssessmentRunner(definition: AssessmentDefinition, initial?: ResponseMap) {
  const [stage, setStage] = useState<RunnerStage>("intro");
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<ResponseMap>(initial ?? {});

  const total = definition.questions.length;
  const question = definition.questions[index];
  const selected = question ? responses[question.id] : undefined;

  const select = useCallback(
    (optionId: string) => {
      if (!question) return;
      setResponses((prev) => ({ ...prev, [question.id]: optionId }));
    },
    [question],
  );

  const start = useCallback(() => setStage("question"), []);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i + 1 >= total) {
        setStage("complete");
        return i;
      }
      return i + 1;
    });
  }, [total]);

  const back = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const result = useMemo(() => scoreAssessment(definition, responses), [definition, responses]);

  return {
    stage,
    index,
    total,
    question,
    selected,
    responses,
    isFirst: index === 0,
    isLast: index + 1 === total,
    canAdvance: !!selected,
    select,
    start,
    next,
    back,
    result,
  };
}
