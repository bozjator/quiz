import { Component, inject, signal } from '@angular/core';
import { LayoutService } from '../../layout/layout.service';
import { QuizApiService } from '../../shared/services/api/quiz-api.service';
import { RouterModule } from '@angular/router';
import { Quiz } from '../../shared/models/quiz/quiz.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  imports: [RouterModule, MatIconModule],
})
export class DashboardComponent {
  layoutService = inject(LayoutService);
  private quizApiService = inject(QuizApiService);

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
}
