import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QuestionEntity } from './entities/question.entity';
import { CreateUpdateQuestion } from './dtos/create-update-question.dto';
import { AnswerEntity } from '../answer/entities/answer.entity';
import { UserQuestionProgressEntity } from './entities/user-question-progress.entity';
import { SharedFunctions } from 'src/shared/services/shared-functions';
import { QuizQuestionsQuery } from './dtos/quiz-questions-query.dto';
import { QuizType } from '../quiz/model/quiz-type.enum';
import { Question } from './dtos/question.dto';
import { QuizEntity } from '../quiz/entities/quiz.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(QuestionEntity) private questionEntity: typeof QuestionEntity,
    @InjectModel(QuizEntity) private quizEntity: typeof QuizEntity,
    @InjectModel(UserQuestionProgressEntity)
    private userQuestionProgressEntity: typeof UserQuestionProgressEntity,
  ) {}

  private async canUserManageQuestion(
    userId: number,
    questionId: string,
  ): Promise<boolean> {
    const question = await this.questionEntity.findByPk(questionId);
    if (!question) return false;
    const quiz = await this.quizEntity.findByPk(question.quizId);
    if (!quiz) return false;
    return quiz.userId === userId;
  }

  private async validateCanUserManageQuestion(
    userId: number,
    questionId: string,
  ) {
    const isAllowed = this.canUserManageQuestion(userId, questionId);
    if (!isAllowed) throw new UnauthorizedException();
  }

  private async validateCanUserCreateQuestion(userId: number, quizId: string) {
    const quiz = await this.quizEntity.findByPk(quizId);
    if (!quiz || quiz.userId !== userId) throw new UnauthorizedException();
  }

  async getQuestionsByQuizId(quizId: string): Promise<QuestionEntity[]> {
    return this.questionEntity.findAll({
      where: { quizId },
      include: [{ model: AnswerEntity }],
      order: [['createdAt', 'DESC']], // newest first
    });
  }

  async getQuestionsToPlay(
    quizId: string,
    userId: number | undefined,
    query: QuizQuestionsQuery,
  ) {
    const questions = await this.getQuestionsByQuizId(quizId);

    // Purely random selection.
    if (query.type === QuizType.random || !userId) {
      const randomQuestions = SharedFunctions.shuffle(questions).slice(
        0,
        query.count,
      );
      return randomQuestions.map((q) => new Question(q, true));
    }

    // Reinforcement style selection.
    const progress = await this.userQuestionProgressEntity.findAll({
      where: { userId, questionId: questions.map((q) => q.id) },
    });
    const progMap = new Map(progress.map((p) => [p.questionId, p]));

    const newQuestions = questions.filter((q) => !progMap.has(q.id));
    const seenQuestions = questions.filter((q) => progMap.has(q.id));

    // Percentages.
    const toTakeNewPercent = (query.percentOfNew || 35) / 100;
    const toTakeOldestPercent = (query.percentOfSeenOldest || 15) / 100;
    // Count calculations.
    const toTake = Math.min(query.count, questions.length);
    const takeNew = Math.round(toTake * toTakeNewPercent);
    const takeOldest = Math.round(toTake * toTakeOldestPercent);
    const takeByReinforcement = toTake - takeNew - takeOldest;

    const chosen: QuestionEntity[] = [];

    // Helper to add questions without duplicates
    const addUnique = (arr: QuestionEntity[], toAdd: QuestionEntity[]) => {
      toAdd.forEach((q) => {
        if (!arr.find((c) => c.id === q.id)) arr.push(q);
      });
    };

    // 1) Add new questions
    addUnique(chosen, SharedFunctions.shuffle(newQuestions).slice(0, takeNew));

    // 2) Oldest lastSeen
    const seenWithLastSeen = seenQuestions
      .map((q) => ({ q, p: progMap.get(q.id) }))
      .filter((x) => x.p?.lastSeen)
      .sort(
        (a, b) =>
          new Date(a.p.lastSeen).getTime() - new Date(b.p.lastSeen).getTime(),
      )
      .map((x) => x.q);
    addUnique(chosen, seenWithLastSeen.slice(0, takeOldest));

    // 3) Lowest reinforcement
    const seenByReinforce = seenQuestions
      .map((q) => ({ q, p: progMap.get(q.id) }))
      .sort((a, b) => (a.p?.reinforcement || 0) - (b.p?.reinforcement || 0))
      .map((x) => x.q);
    addUnique(chosen, seenByReinforce.slice(0, takeByReinforcement));

    // 4) Fill remaining if not enough questions selected
    if (chosen.length < toTake) {
      const remaining = questions.filter(
        (q) => !chosen.find((c) => c.id === q.id),
      );
      addUnique(
        chosen,
        SharedFunctions.shuffle(remaining).slice(0, toTake - chosen.length),
      );
    }

    // Final shuffle and deduplicate as a safety net
    const final = Array.from(
      new Map(
        SharedFunctions.shuffle(chosen)
          .slice(0, toTake)
          .map((q) => [q.id, q]),
      ).values(),
    );

    return final.map((q) => new Question(q, true));
  }

  async createQuestion(
    userId: number,
    dto: Partial<CreateUpdateQuestion>,
  ): Promise<QuestionEntity> {
    this.validateCanUserCreateQuestion(userId, dto.quizId);
    const question = await this.questionEntity.create(dto);
    return question;
  }

  /**
   * Record user's answer for a question and update reinforcement.
   *
   * @param userId User answering the question.
   * @param questionId Question being answered.
   * @param selectedAnswerIds User's selected answer IDs.
   * @returns
   */
  async recordAnswer(
    userId: number,
    questionId: string,
    selectedAnswerIds: string[],
  ) {
    const question = await this.questionEntity.findByPk(questionId, {
      include: [AnswerEntity],
    });
    if (!question) throw new NotFoundException('Question not found');

    // Determine if user's selection matches set of correct answer ids.
    const correctIds = question.answers
      .filter((a) => a.isCorrect)
      .map((a) => a.id)
      .sort();
    const selectedSorted = [...selectedAnswerIds].sort();
    const isCorrectlyAnswered =
      JSON.stringify(correctIds) === JSON.stringify(selectedSorted);

    // Store progress.
    let progress = await this.userQuestionProgressEntity.findOne({
      where: { userId, questionId },
    });
    if (!progress) {
      progress = await this.userQuestionProgressEntity.create({
        userId,
        questionId,
        lastSeen: new Date(),
        reinforcement: 0,
      });
    }

    // Update lastSeen.
    progress.lastSeen = new Date();

    // Update reinforcement counter.
    if (isCorrectlyAnswered) {
      progress.reinforcement = Math.min(10, (progress.reinforcement || 0) + 1);
    } else {
      progress.reinforcement = Math.max(-10, (progress.reinforcement || 0) - 1);
    }

    await progress.save();

    return isCorrectlyAnswered;
  }

  async updateQuestion(
    userId: number,
    questionId: string,
    updateDto: Partial<CreateUpdateQuestion>,
  ): Promise<QuestionEntity> {
    this.validateCanUserManageQuestion(userId, questionId);
    const question = await this.questionEntity.findByPk(questionId);
    if (!question) throw new NotFoundException('Question not found');
    Object.assign(question, updateDto);
    await question.save();
    return question;
  }

  async deleteQuestion(userId: number, questionId: string) {
    this.validateCanUserManageQuestion(userId, questionId);
    const question = await this.questionEntity.findByPk(questionId);
    if (!question) throw new NotFoundException('Question not found');
    await question.destroy();
  }
}
