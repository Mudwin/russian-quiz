export interface MultipleContent {
  options: string[];
  correct: number[];
}

export interface MatchingContent {
  left: string[];
  right: string[];
  pairs: [number, number][];
}

export interface Question {
  id: number | string;
  type: "multiple" | "matching";
  instruction: string;
  content: MultipleContent | MatchingContent;
  explanation?: string;
}

export type Mode = "trainer" | "exam";
export type Phase = "menu" | "active" | "examResult";
