import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { CreateUpdateAnswer } from '../../models/quiz/create-update-answer.model';
import { Answer } from '../../models/quiz/answer.model';

@Injectable({
  providedIn: 'root',
})
export class AnswerApiService extends AppHttpService {
  constructor() {
    super('answer');
  }

  public create(dto: CreateUpdateAnswer) {
    return this.http.post<Answer>(this.url(''), dto);
  }

  public createBulk(dto: CreateUpdateAnswer[]) {
    return this.http.post<Answer[]>(this.url('bulk'), dto);
  }

  public update(id: string, dto: CreateUpdateAnswer) {
    return this.http.put<Answer>(this.url(id), dto);
  }

  public delete(id: string) {
    return this.http.delete<void>(this.url(id));
  }
}
