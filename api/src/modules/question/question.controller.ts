import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { QuestionService } from './question.service';
import { QuestionEntity } from './entities/question.entity';
import { CreateUpdateQuestion } from './dtos/create-update-question.dto';
import { Question } from './dtos/question.dto';
import { RecordQuestionAnswer } from './dtos/record-question-answer.dto';
import { UserInRequest } from 'src/auth/models/user-in-request.model';
import { ReqUser } from 'src/auth/decorators/req-user.decorator';
import { QuizQuestionsQuery } from './dtos/quiz-questions-query.dto';

@AuthUser()
@ApiTags('question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({
    summary: 'Get questions by quiz ID.',
  })
  @ApiOkResponse({
    type: Question,
    isArray: true,
  })
  @Get('quiz/:quizId')
  async getQuestionsByQuizId(
    @Param('quizId') quizId: string,
  ): Promise<QuestionEntity[]> {
    return this.questionService.getQuestionsByQuizId(quizId);
  }

  @ApiOperation({
    summary: 'Get questions to play the quiz.',
  })
  @ApiOkResponse({
    type: Question,
    isArray: true,
  })
  @Get('quiz/:quizId/play')
  async getQuestionsToPlay(
    @Param('quizId') quizId: string,
    @Query() query: QuizQuestionsQuery,
    @ReqUser() user: UserInRequest,
  ) {
    return this.questionService.getQuestionsToPlay(quizId, user.id, query);
  }

  @ApiOperation({
    summary: 'Create question.',
  })
  @ApiCreatedResponse({
    type: Question,
  })
  @Post()
  async createQuestion(
    @Body() dto: CreateUpdateQuestion,
    @ReqUser() user: UserInRequest,
  ) {
    return this.questionService.createQuestion(user.id, dto);
  }

  @ApiOperation({
    summary: "Record user's answer for a question.",
  })
  @Post(':questionId/answer')
  async recordAnswer(
    @Param('questionId') questionId: string,
    @Body() dto: RecordQuestionAnswer,
    @ReqUser() user: UserInRequest,
  ) {
    return this.questionService.recordAnswer(
      user.id,
      questionId,
      dto.selectedAnswerIds,
    );
  }

  @ApiOperation({ summary: 'Update question.' })
  @ApiOkResponse({
    type: Question,
  })
  @Put(':questionId')
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() dto: CreateUpdateQuestion,
    @ReqUser() user: UserInRequest,
  ) {
    return await this.questionService.updateQuestion(user.id, questionId, dto);
  }

  @ApiOperation({ summary: 'Delete question.' })
  @ApiOkResponse()
  @Delete(':questionId')
  async deleteQuestion(
    @Param('questionId') questionId: string,
    @ReqUser() user: UserInRequest,
  ) {
    await this.questionService.deleteQuestion(user.id, questionId);
  }
}
