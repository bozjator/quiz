import { computed, signal } from '@angular/core';
import { QuestionAnswerState } from '../../../shared/models/quiz/question-answer-state.model';

export class QuizPlayService {
  questionAnswerStates = signal<Record<string, QuestionAnswerState>>({});

  readonly stats = computed(() => {
    const states = Object.values(this.questionAnswerStates());
    const answeredCount = states.filter((s) => s.answered).length;
    const correctCount = states.filter((s) => s.answered && s.isCorrect).length;
    const percentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return { answeredCount, correctCount, percentage };
  });

  saveAnswerState(
    questionId: string,
    selectedIds: string[],
    answered: boolean,
    isCorrect: boolean,
  ) {
    this.questionAnswerStates.update((state) => ({
      ...state,
      [questionId]: { selectedIds, answered, isCorrect },
    }));
  }

  getAnswerState(questionId: string): QuestionAnswerState {
    return this.questionAnswerStates()[questionId];
  }
}
