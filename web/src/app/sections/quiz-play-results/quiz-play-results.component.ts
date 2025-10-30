import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LayoutService } from '../../layout/layout.service';
import { QuizApiService } from '../../shared/services/api/quiz-api.service';
import { NotificationService } from '../../shared/components/others/notification/notification.service';
import { AlertType } from '../../shared/components/alert.component';
import { QuizPlayResult } from '../../shared/models/quiz/quiz-play-result.dto';
import { SecondsToTimePipe } from '../../shared/pipes/seconds-to-time.pipe';

@Component({
  selector: 'quiz-play-results',
  templateUrl: './quiz-play-results.component.html',
  imports: [DatePipe, SecondsToTimePipe],
})
export class QuizPlayResultsComponent {
  layoutService = inject(LayoutService);
  private route = inject(ActivatedRoute);
  private quizApiService = inject(QuizApiService);
  private notificationService = inject(NotificationService);

  quizId = signal<string>('');
  apiCallLoadingQuizPlayResults = signal(false);
  quizPlayResults = signal<Array<QuizPlayResult>>([]);

  private pageTitle = 'Quiz Play Results';
  private pageIcon = 'bar_chart_4_bars';

  constructor() {
    this.layoutService.setPageTitle(this.pageTitle, this.pageIcon);
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.quizId.set(id ?? '');

      if (this.quizId()) {
        this.loadQuiz(this.quizId());
        this.loadQuizPlayResults(this.quizId());
      }
    });
  }

  private loadQuizPlayResults(id: string) {
    this.apiCallLoadingQuizPlayResults.set(true);

    this.quizApiService.getQuizPlayResults(id).subscribe({
      next: (quizPlayResults) => {
        this.apiCallLoadingQuizPlayResults.set(false);
        this.quizPlayResults.set(quizPlayResults);
      },
      error: () => {
        this.notificationService.show('Failed to get quiz play results.', {
          type: AlertType.red,
        });
      },
    });
  }

  private loadQuiz(id: string) {
    this.quizApiService.getQuiz(id).subscribe({
      next: (quiz) => {
        this.layoutService.setPageTitle(`${this.pageTitle} - ${quiz.title}`, this.pageIcon);
      },
      error: () => {
        this.notificationService.show('Failed to get quiz data.', {
          type: AlertType.red,
        });
      },
    });
  }
}
