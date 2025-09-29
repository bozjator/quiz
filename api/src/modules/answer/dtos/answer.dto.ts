import { ApiProperty } from '@nestjs/swagger';
import { AnswerEntity } from '../entities/answer.entity';

export class Answer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  questionId: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: AnswerEntity) {
    if (!entity) return;

    this.id = entity.id;
    this.questionId = entity.questionId;
    this.answer = entity.answer;
    this.explanation = entity.explanation;
    this.isCorrect = entity.isCorrect;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
