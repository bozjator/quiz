import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { COLUMN_QUIZ, QuizEntity } from './entities/quiz.entity';
import { CreateQuiz } from './dtos/create-quiz.dto';
import { UpdateQuiz } from './dtos/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(@InjectModel(QuizEntity) private quizEntity: typeof QuizEntity) {}

  async getQuiz(id: string): Promise<QuizEntity> {
    return this.quizEntity.findByPk(id);
  }

  async getPublicQuizzes(): Promise<QuizEntity[]> {
    return this.quizEntity.findAll({
      where: { [COLUMN_QUIZ.isPublic]: true, [COLUMN_QUIZ.isPublished]: true },
    });
  }

  async getUserQuizzes(userId: number): Promise<QuizEntity[]> {
    return this.quizEntity.findAll({
      where: { [COLUMN_QUIZ.userId]: userId },
    });
  }

  async createQuiz(
    createDto: Partial<CreateQuiz>,
    userId: number,
  ): Promise<QuizEntity> {
    const quiz = await this.quizEntity.create({ userId, ...createDto });
    return quiz;
  }

  async updateQuiz(
    quizId: string,
    userId: number,
    dto: Partial<UpdateQuiz>,
  ): Promise<number> {
    const affectedCount = await this.quizEntity.update(dto, {
      where: { [COLUMN_QUIZ.userId]: userId, id: quizId },
    });
    return affectedCount[0];
  }
}
