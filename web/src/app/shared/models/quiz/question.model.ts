import { Answer } from './answer.model';

export interface Question {
  id: string;
  quizId: string;
  question: string;
  explanation: string;
  extraInfo: string;
  feedbackOnCorrect: string;
  feedbackOnIncorrect: string;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
}
