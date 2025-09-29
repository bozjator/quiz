import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BelongsTo,
  HasMany,
  AllowNull,
} from 'sequelize-typescript';
import { AnswerEntity } from 'src/modules/answer/entities/answer.entity';
import { QuizEntity } from 'src/modules/quiz/entities/quiz.entity';

@Table({ tableName: 'questions' })
export class QuestionEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => QuizEntity)
  @Column({ type: DataType.UUID })
  quizId: string;

  @BelongsTo(() => QuizEntity)
  quiz: QuizEntity;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  question: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  explanation?: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  feedbackOnCorrect?: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  feedbackOnIncorrect?: string;

  @HasMany(() => AnswerEntity)
  answers: AnswerEntity[];
}
