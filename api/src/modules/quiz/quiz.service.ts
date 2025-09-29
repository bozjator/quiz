import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QuizEntity } from './entities/quiz.entity';
import { CreateQuiz } from './dtos/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor(@InjectModel(QuizEntity) private quizEntity: typeof QuizEntity) {}

  async getQuizzes(): Promise<QuizEntity[]> {
    return this.quizEntity.findAll();
  }

  async createQuiz(
    createDto: Partial<CreateQuiz>,
    userId: number,
  ): Promise<QuizEntity> {
    const quiz = await this.quizEntity.create({ userId, ...createDto });
    return quiz;
  }
}
