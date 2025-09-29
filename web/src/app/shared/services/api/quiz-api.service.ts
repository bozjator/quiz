import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Quiz } from '../../models/quiz/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizApiService extends AppHttpService {
  constructor() {
    super('quiz');
  }

  public getQuizzes() {
    return this.http.get<Quiz[]>(this.url(''));
  }
}
