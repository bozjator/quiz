import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { QuestionEntity } from './question.entity';

@Table({
  tableName: 'user_question_progress',
  indexes: [{ unique: true, fields: ['userId', 'questionId'] }],
})
export class UserQuestionProgressEntity extends Model {
  @ForeignKey(() => UserEntity)
  @Column
  userId: number;

  @ForeignKey(() => QuestionEntity)
  @Column({ type: DataType.UUID })
  questionId: string;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @BelongsTo(() => QuestionEntity)
  question: QuestionEntity;

  @Column({ type: DataType.DATE })
  lastSeen: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  reinforcement: number; // -10 .. 10
}
