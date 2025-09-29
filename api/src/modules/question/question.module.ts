import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuestionEntity } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { UserQuestionProgressEntity } from './entities/user-question-progress.entity';
import { QuizEntity } from '../quiz/entities/quiz.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      QuestionEntity,
      UserQuestionProgressEntity,
      QuizEntity,
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
