export interface CreateUpdateQuestion {
  quizId: string;
  question: string;
  explanation?: string;
  feedbackOnCorrect?: string;
  feedbackOnIncorrect?: string;
}
