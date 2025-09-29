import { Component, input, output } from '@angular/core';
import { Question } from '../../../../shared/models/quiz/question.model';
import { QuestionAnswerState } from '../../../../shared/models/quiz/question-answer-state.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.html',
  imports: [MatIconModule],
})
export class QuestionsList {
  readonly questions = input<Question[]>([]);
  readonly isEditMode = input<boolean>(false);
  readonly questionAnswerStates = input<Record<string, QuestionAnswerState>>({});
  readonly selectedQuestionId = input.required<string>();
  readonly onSelectQuestionId = output<string>();

  selectQuestion(id: string) {
    this.onSelectQuestionId.emit(id);
  }
}
