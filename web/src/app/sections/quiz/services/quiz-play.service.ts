import { computed, inject, signal } from '@angular/core';
import { QuestionAnswerState } from '../../../shared/models/quiz/question-answer-state.model';
import { QuizApiService } from '../../../shared/services/api/quiz-api.service';
import { NotificationService } from '../../../shared/components/others/notification/notification.service';
import { AlertType } from '../../../shared/components/alert.component';

export class QuizPlayService {
  private quizApiService = inject(QuizApiService);
  private notificationService = inject(NotificationService);

  quizId = '';
  quizQuestionsCount = 0;
  questionAnswerStates = signal<Record<string, QuestionAnswerState>>({});

  quizStartDate = new Date();

  readonly stats = computed(() => {
    const states = Object.values(this.questionAnswerStates());
    const answeredCount = states.filter((s) => s.answered).length;
    const correctCount = states.filter((s) => s.answered && s.isCorrect).length;
    const percentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return { answeredCount, correctCount, percentage };
  });

  clearAnswerStates() {
    this.questionAnswerStates.set({});
  }

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
    this.handleQuizCompletion();
  }

  getAnswerState(questionId: string): QuestionAnswerState {
    return this.questionAnswerStates()[questionId];
  }

  handleQuizCompletion() {
    const states = Object.values(this.questionAnswerStates());

    const answeredCount = states.filter((s) => s.answered).length;
    const areAllAnswered = answeredCount === this.quizQuestionsCount;
    if (!areAllAnswered) return;

    const correctCount = states.filter((s) => s.answered && s.isCorrect).length;

    const durationMs = new Date().getTime() - this.quizStartDate.getTime();
    const durationSec = durationMs / 1000;

    this.quizApiService
      .createQuizPlayResult(this.quizId, {
        questionsCount: this.quizQuestionsCount,
        correctAnswersCount: correctCount,
        duration: durationSec,
      })
      .subscribe({
        next: () => {
          console.log('Quiz play result saved successfully.');
        },
        error: (err) => {
          this.notificationService.show('Failed to save quiz play result.', {
            type: AlertType.red,
          });
        },
      });
  }
}
