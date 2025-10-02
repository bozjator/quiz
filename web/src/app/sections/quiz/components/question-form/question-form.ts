import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Question } from '../../../../shared/models/quiz/question.model';
import { CreateUpdateQuestion } from '../../../../shared/models/quiz/create-update-question.model';
import { QuestionApiService } from '../../../../shared/services/api/question-api.service';
import { NotificationService } from '../../../../shared/components/others/notification/notification.service';
import { AlertType } from '../../../../shared/components/alert.component';
import { INPUT_LENGTHS } from '../../../../app.config';
import { Answer } from '../../../../shared/models/quiz/answer.model';
import { IconButtonComponent } from '../../../../shared/components/buttons/icon-button.component';
import { AnswerApiService } from '../../../../shared/services/api/answer-api.service';
import { CreateUpdateAnswer } from '../../../../shared/models/quiz/create-update-answer.model';

type AnswerForm = FormGroup<{
  id: FormControl<string>;
  answer: FormControl<string>;
  explanation: FormControl<string>;
}>;
type AnswerFormValue = ReturnType<AnswerForm['getRawValue']>;

interface IQuestionForm {
  question: FormControl<string | null>;
  explanation: FormControl<string | null>;
  feedbackOnCorrect: FormControl<string | null>;
  feedbackOnIncorrect: FormControl<string | null>;
  correctAnswers: FormArray<AnswerForm>;
  incorrectAnswers: FormArray<AnswerForm>;
}

@Component({
  selector: 'app-question-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    IconButtonComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './question-form.html',
})
export class QuestionForm {
  private fb = inject(FormBuilder);
  private questionApiService = inject(QuestionApiService);
  private answerApiService = inject(AnswerApiService);
  private notificationService = inject(NotificationService);

  readonly question = input.required<Question>();
  readonly onQuestionCreated = output<string>();
  readonly onQuestionUpdated = output<string>();

  readonly apiCallInProgress = signal<boolean>(false);

  form: FormGroup<IQuestionForm> = this.fb.group({
    question: ['', [Validators.required, Validators.minLength(INPUT_LENGTHS.min.question)]],
    explanation: [''],
    feedbackOnCorrect: [''],
    feedbackOnIncorrect: [''],
    correctAnswers: this.fb.array<AnswerForm>([]),
    incorrectAnswers: this.fb.array<AnswerForm>([]),
  });

  constructor() {
    this.populateForm();
  }

  private createAnswerForm(a: Answer | null): AnswerForm {
    return this.fb.group({
      id: [a?.id ?? ''],
      answer: [
        a?.answer ?? '',
        [Validators.required, Validators.minLength(INPUT_LENGTHS.min.answer)],
      ],
      explanation: [a?.explanation ?? ''],
    }) as AnswerForm;
  }

  private populateForm() {
    // Populate form when selectedQuestion changes
    effect(() => {
      const q = this.question();
      if (!q) return;

      // Populate main fields
      this.form.patchValue({
        question: q.question,
        explanation: q.explanation,
        feedbackOnCorrect: q.feedbackOnCorrect,
        feedbackOnIncorrect: q.feedbackOnIncorrect,
      });

      // Populate correctAnswers
      const correctAnswersArray = this.form.controls.correctAnswers;
      correctAnswersArray.clear();
      q.answers
        .filter((a) => a.isCorrect)
        .forEach((a) => correctAnswersArray.push(this.createAnswerForm(a)));

      // Populate incorrectAnswers
      const incorrectAnswersArray = this.form.controls.incorrectAnswers;
      incorrectAnswersArray.clear();
      q.answers
        .filter((a) => !a.isCorrect)
        .forEach((a) => incorrectAnswersArray.push(this.createAnswerForm(a)));

      // Add empty answers if no answers
      const fv = this.form.value;
      if (fv.correctAnswers?.length === 0) this.addNewCorrectAnswer();
      if (fv.incorrectAnswers?.length === 0) this.addNewIncorrectAnswer();
    });
  }

  addNewCorrectAnswer() {
    this.form.controls.correctAnswers.push(this.createAnswerForm(null));
  }

  addNewIncorrectAnswer() {
    this.form.controls.incorrectAnswers.push(this.createAnswerForm(null));
  }

  removeCorrectAnswer(index: number) {
    const answers = this.form.get('correctAnswers') as FormArray<AnswerForm>;
    answers.removeAt(index);
  }

  removeIncorrectAnswer(index: number) {
    const answers = this.form.get('incorrectAnswers') as FormArray<AnswerForm>;
    answers.removeAt(index);
  }

  private checkAnswersForDuplicates(): boolean {
    const fv = this.form.value;
    const allAnswers = [
      ...(fv.correctAnswers ?? []).map((a) => (a.answer || '').trim().toLowerCase()),
      ...(fv.incorrectAnswers ?? []).map((a) => (a.answer || '').trim().toLowerCase()),
    ];

    const hasDuplicates = new Set(allAnswers).size !== allAnswers.length;
    if (hasDuplicates) {
      this.notificationService.show('Duplicate answers found!', { type: AlertType.red });
    }

    return hasDuplicates;
  }

  save() {
    const answersHaveDuplicates = this.checkAnswersForDuplicates();
    if (answersHaveDuplicates) return;

    this.apiCallInProgress.set(true);

    const fv = this.form.value;
    const dto: CreateUpdateQuestion = {
      quizId: this.question().quizId,
      question: fv.question ?? '',
      explanation: fv.explanation ?? '',
      feedbackOnCorrect: fv.feedbackOnCorrect ?? '',
      feedbackOnIncorrect: fv.feedbackOnIncorrect ?? '',
    };

    if (this.question().id.length > 0) {
      this.updateQuestion(dto);
    } else {
      this.createQuestion(dto);
    }
  }

  private saveAnswers(questionId: string, callback: () => void) {
    const aFormToAnswer = (isCorrect: boolean, aForm: Partial<AnswerFormValue>) => ({
      id: aForm.id || '',
      questionId,
      answer: aForm.answer || '',
      explanation: aForm.explanation || '',
      isCorrect,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const answerToUpdateCreateDTO = (a: Answer): CreateUpdateAnswer => ({
      questionId: a.questionId,
      answer: a.answer,
      explanation: a.explanation,
      isCorrect: a.isCorrect,
    });

    const fv = this.form.value;
    const answersCorrect = (fv.correctAnswers ?? []).map((a) => aFormToAnswer(true, a));
    const answersIncorrect = (fv.incorrectAnswers ?? []).map((a) => aFormToAnswer(false, a));
    const answers = [...answersCorrect, ...answersIncorrect];

    const answersToCreate = answers.filter((a) => a.id.length === 0);
    const answersToUpdate = answers.filter((a) => a.id.length > 0);
    const answersToDelete = this.question().answers.filter(
      (oldAnswer) => !answersToUpdate.some((newAnswer) => newAnswer.id === oldAnswer.id),
    );

    // Build all Observables
    const create$ = answersToCreate.length
      ? this.answerApiService.createBulk(answersToCreate.map(answerToUpdateCreateDTO)).pipe(
          catchError(() => {
            this.notificationService.show('Failed to create new answers!', { type: AlertType.red });
            return of(null);
          }),
        )
      : of(null);

    const update$ = answersToUpdate.length
      ? forkJoin(
          answersToUpdate.map((a) =>
            this.answerApiService.update(a.id, answerToUpdateCreateDTO(a)).pipe(
              catchError(() => {
                this.notificationService.show('Failed to update answer!', { type: AlertType.red });
                return of(null);
              }),
            ),
          ),
        )
      : of(null);

    const delete$ = answersToDelete.length
      ? forkJoin(
          answersToDelete.map((a) =>
            this.answerApiService.delete(a.id).pipe(
              catchError(() => {
                this.notificationService.show('Failed to delete answer!', { type: AlertType.red });
                return of(null);
              }),
            ),
          ),
        )
      : of(null);

    // Wait for all API calls
    forkJoin([create$, update$, delete$])
      .pipe(finalize(() => this.apiCallInProgress.set(false)))
      .subscribe({
        next: () => callback(),
        error: () => callback(), // should not happen due to catchError, but just in case
      });
  }

  private createQuestion(dto: CreateUpdateQuestion) {
    this.questionApiService.createQuestion(dto).subscribe({
      next: (q) => {
        this.notificationService.show('Successfully created question.', {
          type: AlertType.green,
        });
        const callback = () => this.onQuestionCreated.emit(q.id);
        this.saveAnswers(q.id, callback);
      },
      error: () =>
        this.notificationService.show('Failed to save question!', {
          type: AlertType.red,
        }),
    });
  }

  private updateQuestion(dto: CreateUpdateQuestion) {
    const questionId = this.question().id;
    this.questionApiService.updateQuestion(questionId, dto).subscribe({
      next: (q) => {
        this.notificationService.show('Successfully updated question.', {
          type: AlertType.green,
        });
        const callback = () => this.onQuestionUpdated.emit(q.id);
        this.saveAnswers(questionId, callback);
      },
      error: () =>
        this.notificationService.show('Failed to update question!', {
          type: AlertType.red,
        }),
    });
  }
}
