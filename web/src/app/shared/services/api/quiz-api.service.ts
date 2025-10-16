import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Quiz } from '../../models/quiz/quiz.model';
import { CreateQuiz } from '../../models/quiz/create-quiz.model';
import { CreateQuizPlayResult } from '../../models/quiz/create-quiz-play-result.dto';
import { QuizPlayResult } from '../../models/quiz/quiz-play-result.dto';

@Injectable({
  providedIn: 'root',
})
export class QuizApiService extends AppHttpService {
  constructor() {
    super('quiz');
  }

  public getQuiz(id: string) {
    return this.http.get<Quiz>(this.url(id));
  }

  public getPublicQuizzes() {
    return this.http.get<Quiz[]>(this.url('public'));
  }

  public getPublicQuizzesWithUserProgress() {
    return this.http.get<Quiz[]>(this.url('public/with-user-progress'));
  }

  public getUserQuizzes() {
    return this.http.get<Quiz[]>(this.url('user'));
  }

  public getQuizPlayResults(quizId: string) {
    return this.http.get<QuizPlayResult[]>(this.url(`${quizId}/play-results`));
  }

  public createQuiz(name: string) {
    const dto: CreateQuiz = {
      title: name,
    };
    return this.http.post(this.url(''), dto);
  }

  public createQuizPlayResult(quizId: string, dto: CreateQuizPlayResult) {
    return this.http.post(this.url(`${quizId}/play-result`), dto);
  }

  public updateQuiz(id: string, dto: Partial<Quiz>) {
    return this.http.patch(this.url(id), dto);
  }
}
