import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { QuestionEntity } from 'src/modules/question/entities/question.entity';

@Table({ tableName: 'answers' })
export class AnswerEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => QuestionEntity)
  @Column({ type: DataType.UUID })
  questionId: string;

  @BelongsTo(() => QuestionEntity)
  question: QuestionEntity;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  answer: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  explanation?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isCorrect: boolean;
}
