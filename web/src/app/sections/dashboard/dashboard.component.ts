import { Component, inject, signal } from '@angular/core';
import { LayoutService } from '../../layout/layout.service';
import { QuizApiService } from '../../shared/services/api/quiz-api.service';
import { RouterModule } from '@angular/router';
import { Quiz } from '../../shared/models/quiz/quiz.model';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../shared/components/others/notification/notification.service';
import { AlertType } from '../../shared/components/alert.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  imports: [RouterModule, MatIconModule],
})
export class DashboardComponent {
  layoutService = inject(LayoutService);
  private quizApiService = inject(QuizApiService);
  private notificationService = inject(NotificationService);

  showCreateQuizForm = signal(false);
  quizzes = signal<Quiz[]>([]);

  constructor() {
    this.layoutService.setPageTitle('Dashboard', 'home');
    this.loadQuizzes();
  }

  private loadQuizzes() {
    this.quizApiService.getQuizzes().subscribe((quizzes) => {
      this.quizzes.set(quizzes);
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
