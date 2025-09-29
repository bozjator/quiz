import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnswerEntity } from './entities/answer.entity';
import { QuestionEntity } from '../question/entities/question.entity';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
  imports: [SequelizeModule.forFeature([AnswerEntity, QuestionEntity])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
