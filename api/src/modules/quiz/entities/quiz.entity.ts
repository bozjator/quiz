import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  AllowNull,
  ForeignKey,
} from 'sequelize-typescript';
import { QuestionEntity } from 'src/modules/question/entities/question.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Table({ tableName: 'quiz' })
export class QuizEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => UserEntity)
  @AllowNull(false)
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT, defaultValue: '' })
  description: string;

  @AllowNull(false)
  @Column({ defaultValue: false })
  isPublished: boolean;

  @AllowNull(false)
  @Column({ defaultValue: false })
  isPublic: boolean;

  @HasMany(() => QuestionEntity)
  questions: QuestionEntity[];
}
