import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AnswerEntity } from './entities/answer.entity';
import { CreateUpdateAnswer } from './dtos/create-update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(AnswerEntity) private answerEntity: typeof AnswerEntity,
  ) {}

  async createAnswer(
    createDto: Partial<CreateUpdateAnswer>,
  ): Promise<AnswerEntity> {
    const answer = await this.answerEntity.create(createDto);
    return answer;
  }

  async createAnswers(
    createDtos: Partial<CreateUpdateAnswer>[],
  ): Promise<AnswerEntity[]> {
    const answers = await this.answerEntity.bulkCreate(createDtos);
    return answers;
  }

  async updateAnswer(
    id: string,
    updateDto: Partial<CreateUpdateAnswer>,
  ): Promise<AnswerEntity> {
    const answer = await this.answerEntity.findByPk(id);
    if (!answer) {
      throw new Error('Answer not found');
    }
    await answer.update(updateDto);
    return answer;
  }

  async deleteAnswer(id: string): Promise<void> {
    const answer = await this.answerEntity.findByPk(id);
    if (!answer) {
      throw new Error('Answer not found');
    }
    await answer.destroy();
  }
}
