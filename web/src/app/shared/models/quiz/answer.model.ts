export interface Answer {
  id: string;
  questionId: string;
  answer: string;
  explanation: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}
