export interface CreateUpdateQuestion {
  quizId: string;
  question: string;
  explanation?: string;
  extraInfo?: string;
  feedbackOnCorrect?: string;
  feedbackOnIncorrect?: string;
}
