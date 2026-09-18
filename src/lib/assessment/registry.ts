import { savePostAssessment, savePreAssessment } from "@/content/assessments/save-junior";
import type { AssessmentDefinition } from "./types";

const ASSESSMENTS: Record<string, AssessmentDefinition> = {
  [savePreAssessment.id]: savePreAssessment,
  [savePostAssessment.id]: savePostAssessment,
};

export function getAssessmentDefinition(id: string): AssessmentDefinition | undefined {
  return ASSESSMENTS[id];
}

export function assessmentsForTrack(trackId: string): AssessmentDefinition[] {
  return Object.values(ASSESSMENTS).filter((a) => a.trackId === trackId);
}
