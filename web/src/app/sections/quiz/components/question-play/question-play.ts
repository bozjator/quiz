import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../../../shared/models/quiz/question.model';
import { QuestionAnswerState } from '../../../../shared/models/quiz/question-answer-state.model';
import { QuestionApiService } from '../../../../shared/services/api/question-api.service';
import { NotificationService } from '../../../../shared/components/others/notification/notification.service';
import { AlertType } from '../../../../shared/components/alert.component';

@Component({
  selector: 'app-question-play',
  templateUrl: './question-play.html',
  imports: [CommonModule],
})
export class QuestionPlay {
  private questionApiService = inject(QuestionApiService);
  private notificationService = inject(NotificationService);

  readonly question = input.required<Question>();
  readonly state = input<QuestionAnswerState>();

  stateChange = output<QuestionAnswerState>();

  selectedAnswerIds = signal<string[]>([]);
  hasPressedAnswer = signal(false);
  isAnswered = computed(() => this.selectedAnswerIds().length > 0 && this.hasPressedAnswer());
  isCorrectlyAnswered = computed(() => {
    const correctAnswerIds = this.question()
      .answers.filter((a) => a.isCorrect)
      .map((a) => a.id)
      .sort();
    const selectedIds = this.selectedAnswerIds().slice().sort();
    return (
      correctAnswerIds.length === selectedIds.length &&
      correctAnswerIds.every((id, index) => id === selectedIds[index])
    );
  });

  isMultipleChoice = computed(() => this.question().answers.filter((a) => a.isCorrect).length > 1);

  constructor() {
    let previousQuestionId: string | null = null;

    effect(() => {
      const s = this.state();
      const questionId = this.question()?.id;

      // Only reset state when the question changes
      if (questionId !== previousQuestionId) {
        previousQuestionId = questionId;

        if (s && s.answered) {
          this.selectedAnswerIds.set(s.selectedIds);
          this.hasPressedAnswer.set(s.answered);
        } else {
          this.selectedAnswerIds.set([]);
          this.hasPressedAnswer.set(false);
        }
      }
    });
  }

  toggleSelection(id: string, checked: boolean) {
    this.selectedAnswerIds.update((ids) => (checked ? [...ids, id] : ids.filter((x) => x !== id)));
  }

  selectSingle(id: string) {
    this.selectedAnswerIds.set([id]); // only one selected for radio
  }

  answerQuestion() {
    this.questionApiService.answerQuestion(this.question().id, this.selectedAnswerIds()).subscribe({
      error: () =>
        this.notificationService.show('Failed to send answer for reinforcement tracking!', {
          type: AlertType.red,
        }),
    });
    this.hasPressedAnswer.set(true);
    this.stateChange.emit({
      selectedIds: this.selectedAnswerIds(),
      answered: this.hasPressedAnswer(),
      isCorrect: this.isCorrectlyAnswered(),
    });
  }
}
