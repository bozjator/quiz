import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizEntity } from './entities/quiz.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { AnswerModule } from '../answer/answer.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    AnswerModule,
    QuestionModule,
    SequelizeModule.forFeature([QuizEntity]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
