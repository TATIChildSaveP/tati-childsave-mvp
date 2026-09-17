// Domain types for TATI learning content. Content is data-driven: lessons,
// scenarios and assessments are described by these types, never hard-coded
// into page components. Future tracks (SPEND, EARN) and tiers (teen, plus)
// simply add more data files.

export type Tier = "junior" | "teen" | "plus";

export interface AssessmentOption {
  id: string;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: AssessmentOption[];
  /** The option that shows the strongest saving habit. Never shown as "right/wrong". */
  bestOptionId: string;
  /** Warm, non-shaming feedback shown after answering. */
  feedback: string;
}

export interface Assessment {
  id: string;
  phase: "pre" | "post";
  title: string;
  intro: string;
  questions: AssessmentQuestion[];
}

export type LessonBlock =
  | { type: "text"; body: string }
  | { type: "highlight"; body: string }
  | { type: "example"; title: string; body: string }
  | { type: "checkpoint"; prompt: string; options: AssessmentOption[]; bestOptionId: string; feedback: string };

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  bigIdea: string;
  blocks: LessonBlock[];
  /** Reserved for future listen/text-to-speech support. */
  audioScript?: string;
}

export interface ScenarioChoice {
  id: string;
  label: string;
  /** Change to the child's savings in GH₵. */
  savingsDelta: number;
  /** Warm consequence narration. */
  outcome: string;
  /** Next step id, or undefined to end the scenario. */
  next?: string;
  reflection?: string;
}

export interface ScenarioStep {
  id: string;
  situation: string;
  question: string;
  choices: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  title: string;
  summary: string;
  startingSavings: number;
  startStepId: string;
  steps: ScenarioStep[];
  closingReflection: string;
}

export type TrackItem =
  | { kind: "assessment"; id: string }
  | { kind: "lesson"; id: string }
  | { kind: "scenario"; id: string };

export interface Track {
  id: string;
  tier: Tier;
  name: string;
  tagline: string;
  assessments: Assessment[];
  lessons: Lesson[];
  scenarios: Scenario[];
  /** Ordered learning journey. */
  sequence: TrackItem[];
}
