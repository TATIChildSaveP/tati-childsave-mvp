// Pure assessment logic. No UI, no database access.

import {
  COMPETENCY_LABELS,
  type AssessmentDefinition,
  type AssessmentQuestion,
  type AssessmentResult,
  type CompetencyScore,
  type Competency,
  type ResponseMap,
} from "./types";

export function questionMaxPoints(q: AssessmentQuestion): number {
  if (q.scoring?.maxPoints != null) return q.scoring.maxPoints;
  const explicit = q.options.map((o) => o.points).filter((p): p is number => p != null);
  if (explicit.length > 0) return Math.max(...explicit);
  return q.scoring?.idealPoints ?? 1;
}

export function optionPoints(q: AssessmentQuestion, optionId: string | undefined): number {
  if (!optionId) return 0;
  const option = q.options.find((o) => o.id === optionId);
  if (!option) return 0;
  if (option.points != null) return option.points;
  if (q.idealOptionId && option.id === q.idealOptionId) return q.scoring?.idealPoints ?? 1;
  return q.scoring?.otherPoints ?? 0;
}

export function isIdeal(q: AssessmentQuestion, optionId: string | undefined): boolean {
  return !!q.idealOptionId && optionId === q.idealOptionId;
}

export function scoreAssessment(
  definition: AssessmentDefinition,
  responses: ResponseMap,
): AssessmentResult {
  const buckets = new Map<Competency, { points: number; maxPoints: number }>();
  let points = 0;
  let maxPoints = 0;
  let answered = 0;

  for (const q of definition.questions) {
    const max = questionMaxPoints(q);
    const got = optionPoints(q, responses[q.id]);
    if (responses[q.id]) answered += 1;
    points += got;
    maxPoints += max;
    const bucket = buckets.get(q.competency) ?? { points: 0, maxPoints: 0 };
    bucket.points += got;
    bucket.maxPoints += max;
    buckets.set(q.competency, bucket);
  }

  const competencies: CompetencyScore[] = [...buckets.entries()].map(([competency, b]) => ({
    competency,
    label: COMPETENCY_LABELS[competency],
    points: b.points,
    maxPoints: b.maxPoints,
    ratio: b.maxPoints > 0 ? b.points / b.maxPoints : 0,
  }));

  return {
    assessmentId: definition.id,
    assessmentType: definition.assessmentType,
    answered,
    total: definition.questions.length,
    points,
    maxPoints,
    responses,
    competencies,
  };
}

/** Growth per competency between a baseline (pre) and a later (post) result. */
export function compareResults(pre: AssessmentResult, post: AssessmentResult) {
  return post.competencies.map((p) => {
    const before = pre.competencies.find((c) => c.competency === p.competency);
    return {
      competency: p.competency,
      label: p.label,
      before: before?.ratio ?? 0,
      after: p.ratio,
      delta: p.ratio - (before?.ratio ?? 0),
    };
  });
}
