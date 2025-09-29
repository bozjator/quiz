import { ApiProperty } from '@nestjs/swagger';
import { Answer } from 'src/modules/answer/dtos/answer.dto';
import { QuestionEntity } from '../entities/question.entity';
import { SharedFunctions } from 'src/shared/services/shared-functions';

export class Question {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quizId: string;

  @ApiProperty()
  question: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  feedbackOnCorrect: string;

  @ApiProperty()
  feedbackOnIncorrect: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [Answer] })
  answers: Answer[];

  constructor(entity: QuestionEntity, shuffleAnswers = false) {
    if (!entity) return;

    this.id = entity.id;
    this.quizId = entity.quizId;
    this.question = entity.question;
    this.explanation = entity.explanation;
    this.feedbackOnCorrect = entity.feedbackOnCorrect;
    this.feedbackOnIncorrect = entity.feedbackOnIncorrect;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;

    if (shuffleAnswers)
      this.answers = SharedFunctions.shuffle(
        entity.answers?.map((a) => new Answer(a)) || [],
      );
    else this.answers = entity.answers?.map((a) => new Answer(a)) || [];
  }
}
