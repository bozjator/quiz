import {
  Table,
  Column,
  DataType,
  Model,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { QuizEntity } from './quiz.entity';

const columnUserId: keyof QuizPlayResultEntity = 'userId';
export const COLUMN_QUIZ = {
  userId: columnUserId,
};

type QuizPlayResultColumnKeys = Pick<
  QuizPlayResultEntity,
  'userId' | 'quizId' | 'resultPercentages'
>;
export const COLUMN_QUIZ_PLAY_RESULT: Record<
  keyof QuizPlayResultColumnKeys,
  keyof QuizPlayResultEntity
> = {
  userId: 'userId',
  quizId: 'quizId',
  resultPercentages: 'resultPercentages',
};

@Table({ tableName: 'quiz-play-result' })
export class QuizPlayResultEntity extends Model {
  @ForeignKey(() => UserEntity)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @ForeignKey(() => QuizEntity)
  @Column({ type: DataType.UUID })
  quizId: string;

  @BelongsTo(() => QuizEntity)
  quiz: QuizEntity;

  @AllowNull(false)
  @Column
  questionsCount: number;

  @AllowNull(false)
  @Column
  correctAnswersCount: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  resultPercentages: number;

  @AllowNull(false)
  @Column
  duration: number;
}
