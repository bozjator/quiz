import { QuizType } from './quiz-type.enum';

export interface QuizQuestionsQuery {
  type: QuizType;
  count: number;
  percentOfNew?: number;
  percentOfSeenOldest?: number;
}
