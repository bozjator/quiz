import { QuizUserProgress } from './quiz-user-progress.dto';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userProgress?: QuizUserProgress;
}
