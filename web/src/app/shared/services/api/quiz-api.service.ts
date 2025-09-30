import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Quiz } from '../../models/quiz/quiz.model';
import { CreateQuiz } from '../../models/quiz/create-quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizApiService extends AppHttpService {
  constructor() {
    super('quiz');
  }

  public getPublicQuizzes() {
    return this.http.get<Quiz[]>(this.url('public'));
  }

  public getUserQuizzes() {
    return this.http.get<Quiz[]>(this.url('user'));
  }

  public createQuiz(name: string) {
    const dto: CreateQuiz = {
      title: name,
    };
    return this.http.post(this.url(''), dto);
  }
}
