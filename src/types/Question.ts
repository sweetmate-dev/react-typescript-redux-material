export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple" | "boolean";

export interface QuestionResponse {
  response_code: number;
  results?: Question[] | null;
}

export interface Question {
  category: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  correct_answers: string[];
  incorrect_answers: string[];
}
