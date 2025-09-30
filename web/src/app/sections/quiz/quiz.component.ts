import { Component, inject, signal, computed } from '@angular/core';
import { Question } from '../../shared/models/quiz/question.model';
import { ActivatedRoute } from '@angular/router';
import { QuestionApiService } from '../../shared/services/api/question-api.service';
import { QuizType } from '../../shared/models/quiz/quiz-type.enum';
import { QuestionsList } from './components/questions-list/questions-list';
import { QuestionPlay } from './components/question-play/question-play';
import { LayoutService } from '../../layout/layout.service';
import { QuestionForm } from './components/question-form/question-form';
import { QuizPlayService } from './services/quiz-play.service';
import { QuizEditService } from './services/quiz-edit.service';
import { IconButtonComponent } from '../../shared/components/buttons/icon-button.component';
import { QuizApiService } from '../../shared/services/api/quiz-api.service';
import { NotificationService } from '../../shared/components/others/notification/notification.service';
import { AlertType } from '../../shared/components/alert.component';
import { Quiz } from '../../shared/models/quiz/quiz.model';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  imports: [QuestionsList, QuestionPlay, QuestionForm, IconButtonComponent],
})
export class QuizComponent {
  private route = inject(ActivatedRoute);
  private layoutService = inject(LayoutService);
  private notificationService = inject(NotificationService);
  private questionApiService = inject(QuestionApiService);
  private quizApiService = inject(QuizApiService);

  quizPlayService = new QuizPlayService();
  quizEditService = new QuizEditService();

  quizId = signal<string>('');
  quiz = signal<Quiz | null>(null);
  isEditMode = signal<boolean>(false);
  questions = signal<Question[]>([]);

  selectedQuestionId = signal<string>('');
  selectedQuestion = computed(() =>
    this.questions().find((q) => q.id === this.selectedQuestionId()),
  );

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.quizId.set(id ?? '');

      if (this.quizId()) this.loadQuiz(this.quizId());

      // Detect edit mode from route
      const url = this.route.snapshot.url.map((u) => u.path);
      this.isEditMode.set(url.includes('edit'));

      this.loadQuestions(null);
    });
  }

  private loadQuiz(id: string) {
    this.quizApiService.getQuiz(id).subscribe({
      next: (quiz) => {
        this.quiz.set(quiz);
        this.layoutService.setPageTitle(`Quiz - ${quiz.title}`, 'quiz');
      },
      error: () => {
        this.notificationService.show('Failed to get quiz data.', {
          type: AlertType.red,
        });
      },
    });
  }

  selectQuestion(id: string) {
    this.selectedQuestionId.set(id);
  }

  private selectFirstQuestion() {
    const qs = this.questions();
    if (qs.length > 0) {
      this.selectedQuestionId.set(qs[0].id);
    }
  }
  loadQuestions(questionIdToSelect: string | null) {
    if (this.isEditMode()) {
      this.questionApiService.getQuestionsByQuizId(this.quizId()).subscribe((questions) => {
        this.questions.set(questions);
        if (questionIdToSelect) this.selectQuestion(questionIdToSelect);
        else this.selectFirstQuestion();
      });
    } else {
      const questionsToPlayCount = 30;
      this.questionApiService
        .getQuestionsByQuizIdToPlay(this.quizId(), questionsToPlayCount, QuizType.reinforcement)
        .subscribe((questions) => {
          this.questions.set(questions);
          if (questionIdToSelect) this.selectQuestion(questionIdToSelect);
          else this.selectFirstQuestion();
        });
    }
  }

  addNewQuestion() {
    const newQuestion: Question = {
      id: '',
      quizId: this.quizId(),
      question: '',
      explanation: '',
      feedbackOnCorrect: '',
      feedbackOnIncorrect: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      answers: [],
    };
    this.questions.set([newQuestion, ...this.questions()]);
    this.selectedQuestionId.set(newQuestion.id);
  }

  updateQuiz(dto: Partial<Quiz>) {
    this.quizApiService.updateQuiz(this.quizId(), dto).subscribe({
      next: () => {
        this.loadQuiz(this.quizId());
      },
      error: () => {
        this.notificationService.show('Failed to update quiz data.', {
          type: AlertType.red,
        });
      },
    });
  }
}
