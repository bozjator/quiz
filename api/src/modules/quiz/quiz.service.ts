import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { COLUMN_QUIZ, QuizEntity } from './entities/quiz.entity';
import { CreateQuiz } from './dtos/create-quiz.dto';
import { UpdateQuiz } from './dtos/update-quiz.dto';
import { QuestionEntity } from '../question/entities/question.entity';
import { UserQuestionProgressEntity } from '../question/entities/user-question-progress.entity';
import { QuizUserProgress } from './dtos/quiz-user-progress.dto';
import { Quiz } from './dtos/quiz.dto';
import { CreateQuizPlayResult } from './dtos/create-quiz-play-result.dto';
import {
  COLUMN_QUIZ_PLAY_RESULT,
  QuizPlayResultEntity,
} from './entities/quiz-play-result.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(QuizEntity) private quizEntity: typeof QuizEntity,
    @InjectModel(QuestionEntity) private questionEntity: typeof QuestionEntity,
    @InjectModel(QuizPlayResultEntity)
    private quizPlayResultEntity: typeof QuizPlayResultEntity,
    @InjectModel(UserQuestionProgressEntity)
    private userQuestionProgressEntity: typeof UserQuestionProgressEntity,
  ) {}

  async getQuiz(id: string): Promise<QuizEntity> {
    return this.quizEntity.findByPk(id);
  }

  async getPublicQuizzes(userId?: number) {
    const quizzes = await this.quizEntity.findAll({
      where: { [COLUMN_QUIZ.isPublic]: true, [COLUMN_QUIZ.isPublished]: true },
    });

    if (!userId) return quizzes;

    const quizzesWithProgress = [];

    for (const quiz of quizzes) {
      const progress = await this.getUserQuizProgress(quiz.id, userId);
      const quizWithProgress: Quiz = {
        ...quiz.toJSON(),
        userProgress: progress,
      };
      quizzesWithProgress.push(quizWithProgress);
    }

    return quizzesWithProgress;
  }

  async getUserQuizzes(userId: number): Promise<QuizEntity[]> {
    return this.quizEntity.findAll({
      where: { [COLUMN_QUIZ.userId]: userId },
    });
  }

  async getUserQuizProgress(
    quizId: string,
    userId: number,
  ): Promise<QuizUserProgress> {
    const progress = new QuizUserProgress();

    const questions = await this.questionEntity.findAll({
      where: { quizId },
    });
    const questionIds = questions.map((q) => q.id);
    const totalQuestions = questions.length;

    // TODO: should optimize by storing quiz id in UserQuestionProgressEntity
    // and querying by quizId and userId directly
    const userProgressRecords = await this.userQuestionProgressEntity.findAll({
      where: { userId, questionId: questionIds },
    });

    progress.totalQuestions = totalQuestions;
    progress.notAnswered = totalQuestions - userProgressRecords.length;

    progress.positiveReinforcement = userProgressRecords.filter(
      (r) => r.reinforcement > 0,
    ).length;
    progress.negativeReinforcement = userProgressRecords.filter(
      (r) => r.reinforcement < 0,
    ).length;
    progress.neutralReinforcement = userProgressRecords.filter(
      (r) => r.reinforcement === 0,
    ).length;

    return progress;
  }

  async getUserQuizPlayResults(userId: number, quizId: string) {
    return this.quizPlayResultEntity.findAll({
      where: {
        [COLUMN_QUIZ_PLAY_RESULT.userId]: userId,
        [COLUMN_QUIZ_PLAY_RESULT.quizId]: quizId,
      },
      order: [['createdAt', 'DESC']],
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

  async createQuizPlayResult(
    dto: CreateQuizPlayResult,
    userId: number,
    quizId: string,
  ) {
    const quiz = await this.getQuiz(quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');

    const resultPercentages =
      dto.questionsCount > 0
        ? Math.round((dto.correctAnswersCount / dto.questionsCount) * 100)
        : 0;
    await this.quizPlayResultEntity.create({
      [COLUMN_QUIZ_PLAY_RESULT.userId]: userId,
      [COLUMN_QUIZ_PLAY_RESULT.quizId]: quizId,
      [COLUMN_QUIZ_PLAY_RESULT.resultPercentages]: resultPercentages,
      ...dto,
    });
  }
}
