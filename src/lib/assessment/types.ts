// Reusable assessment engine — domain types.
// Assessment content lives in src/content/assessments/*, never inside page components.

export type AssessmentType = "pre" | "post";

export const COMPETENCIES = [
  "needs-vs-wants",
  "earning",
  "saving",
  "goal-setting",
  "budgeting",
  "tracking-money",
  "spending-decisions",
  "borrowing-lending",
  "financial-resilience",
  "money-safety",
] as const;

export type Competency = (typeof COMPETENCIES)[number];

export const COMPETENCY_LABELS: Record<Competency, string> = {
  "needs-vs-wants": "Needs vs Wants",
  earning: "Earning",
  saving: "Saving",
  "goal-setting": "Goal Setting",
  budgeting: "Budgeting",
  "tracking-money": "Tracking Money",
  "spending-decisions": "Spending Decisions",
  "borrowing-lending": "Borrowing & Lending",
  "financial-resilience": "Financial Resilience",
  "money-safety": "Money Safety",
};

export interface AnswerOption {
  id: string;
  label: string;
  /** Short plain-language explanation shown under the option label. */
  description?: string;
  /** Optional friendly icon shown beside the option. */
  icon?: string;
  /** Points for choosing this option; defaults come from scoring rules. */
  points?: number;
  /** Warm, per-option response shown when selected (optional). */
  response?: string;
}

export interface ScoringRule {
  /** Points awarded for the ideal option when the option carries no explicit points. */
  idealPoints?: number;
  /** Points for any other option when it carries no explicit points. */
  otherPoints?: number;
  /** Maximum points this question can contribute. Defaults to idealPoints. */
  maxPoints?: number;
}

export interface AssessmentQuestion {
  id: string;
  assessmentType: AssessmentType;
  competency: Competency;
  question: string;
  /** Optional decorative illustration (emoji or image URL). */
  illustration?: string;
  options: AnswerOption[];
  /** The strongest money habit, where one exists. Never framed as right/wrong to the child. */
  idealOptionId?: string;
  scoring?: ScoringRule;
  /** Warm, non-shaming feedback shown after answering. */
  feedback: string;
}

export interface AssessmentDefinition {
  id: string;
  trackId: string;
  assessmentType: AssessmentType;
  title: string;
  intro: string;
  /** Closing message. Pre-assessments must not show a score to the child. */
  outro: string;
  showScoreToChild: boolean;
  questions: AssessmentQuestion[];
}

export type ResponseMap = Record<string, string>;

export interface CompetencyScore {
  competency: Competency;
  label: string;
  points: number;
  maxPoints: number;
  /** 0–1. Used by grown-up views only. */
  ratio: number;
}

export interface AssessmentResult {
  assessmentId: string;
  assessmentType: AssessmentType;
  answered: number;
  total: number;
  points: number;
  maxPoints: number;
  responses: ResponseMap;
  competencies: CompetencyScore[];
}
