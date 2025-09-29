import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { Question } from '../../models/quiz/question.model';
import { QuizType } from '../../models/quiz/quiz-type.enum';
import { QuizQuestionsQuery } from '../../models/quiz/quiz-questions-query.model';
import { CreateUpdateQuestion } from '../../models/quiz/create-update-question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionApiService extends AppHttpService {
  constructor() {
    super('question');
  }

  public getQuestionsByQuizId(quizId: string) {
    return this.http.get<Question[]>(this.url('quiz/' + quizId));
  }

  public getQuestionsByQuizIdToPlay(quizId: string, questionsCount: number, quizType: QuizType) {
    const query: QuizQuestionsQuery = {
      type: quizType,
      count: questionsCount,
    };
    const params = this.toHttpParams(query);
    return this.http.get<Question[]>(this.url('quiz/' + quizId + '/play'), { params });
  }

  public answerQuestion(questionId: string, selectedAnswerIds: string[]) {
    return this.http.post<void>(this.url(questionId + '/answer'), { selectedAnswerIds });
  }

  public createQuestion(dto: CreateUpdateQuestion) {
    return this.http.post<Question>(this.url(''), dto);
  }

  public updateQuestion(id: string, dto: CreateUpdateQuestion) {
    return this.http.put<Question>(this.url(id), dto);
  }

  public deleteQuestion(id: string) {
    return this.http.delete<void>(this.url(id));
  }
}
