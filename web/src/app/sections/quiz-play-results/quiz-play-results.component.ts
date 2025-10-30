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

  constructor() {
    this.layoutService.setPageTitle('Quiz Play Results', 'bar_chart_4_bars');
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.quizId.set(id ?? '');

      if (this.quizId()) this.loadQuizPlayResults(this.quizId());
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
}
