import { Component, inject, signal } from '@angular/core';
import { LayoutService } from '../../layout/layout.service';
import { QuizApiService } from '../../shared/services/api/quiz-api.service';
import { RouterModule } from '@angular/router';
import { Quiz } from '../../shared/models/quiz/quiz.model';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../shared/components/others/notification/notification.service';
import { AlertType } from '../../shared/components/alert.component';
import { IconButtonComponent } from '../../shared/components/buttons/icon-button.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  imports: [RouterModule, MatIconModule, IconButtonComponent],
})
export class DashboardComponent {
  layoutService = inject(LayoutService);
  private quizApiService = inject(QuizApiService);
  private notificationService = inject(NotificationService);

  showCreateQuizForm = signal(false);
  userQuizzes = signal<Quiz[]>([]);
  publicQuizzes = signal<Quiz[]>([]);

  apiCallLoadingUserQuizzes = signal(false);
  apiCallLoadingPublicQuizzes = signal(false);

  constructor() {
    this.layoutService.setPageTitle('Dashboard', 'home');
    this.loadQuizzes();
  }

  private loadQuizzes() {
    this.apiCallLoadingUserQuizzes.set(true);
    this.apiCallLoadingPublicQuizzes.set(true);
    this.quizApiService.getUserQuizzes().subscribe((quizzes) => {
      this.userQuizzes.set(quizzes);
      this.apiCallLoadingUserQuizzes.set(false);
    });
    this.quizApiService.getPublicQuizzes().subscribe((quizzes) => {
      this.publicQuizzes.set(quizzes);
      this.apiCallLoadingPublicQuizzes.set(false);
    });
  }

  createQuiz(name: string) {
    this.quizApiService.createQuiz(name).subscribe({
      next: () => {
        this.showCreateQuizForm.set(false);
        this.loadQuizzes();
        this.notificationService.show('Successfully created quiz.', {
          type: AlertType.green,
        });
      },
      error: () =>
        this.notificationService.show('Failed to create quiz!', {
          type: AlertType.red,
        }),
    });
  }
}
