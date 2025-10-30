export interface QuizPlayResult {
  id: number;
  questionsCount: number;
  correctAnswersCount: number;
  resultPercentages: number;
  duration: number;
  createdAt: string;
}
