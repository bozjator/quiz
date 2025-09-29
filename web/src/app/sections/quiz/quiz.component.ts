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

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  imports: [QuestionsList, QuestionPlay, QuestionForm, IconButtonComponent],
})
export class QuizComponent {
  private route = inject(ActivatedRoute);
  private layoutService = inject(LayoutService);
  private questionApiService = inject(QuestionApiService);

  quizPlayService = new QuizPlayService();
  quizEditService = new QuizEditService();

  quizId = signal<string>('');
  isEditMode = signal<boolean>(false);
  questions = signal<Question[]>([]);

  selectedQuestionId = signal<string>('');
  selectedQuestion = computed(() =>
    this.questions().find((q) => q.id === this.selectedQuestionId()),
  );

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const title = params.get('title');
      this.layoutService.setPageTitle(`Quiz - ${title}`, 'quiz');
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.quizId.set(id ?? '');

      // Detect edit mode from route
      const url = this.route.snapshot.url.map((u) => u.path);
      this.isEditMode.set(url.includes('edit'));

      this.loadQuestions(null);
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
      this.questionApiService
        .getQuestionsByQuizIdToPlay(this.quizId(), 1000, QuizType.reinforcement)
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
}
