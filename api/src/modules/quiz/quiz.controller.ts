import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { QuizService } from './quiz.service';
import { CreateQuiz } from './dtos/create-quiz.dto';
import { Quiz } from './dtos/quiz.dto';
import { UserInRequest } from 'src/auth/models/user-in-request.model';
import { ReqUser } from 'src/auth/decorators/req-user.decorator';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiOperation({
    summary: 'Get all public quizzes that are published.',
  })
  @ApiCreatedResponse({
    type: [Quiz],
  })
  @Get('public')
  getPublicQuizzes() {
    return this.quizService.getPublicQuizzes();
  }

  @AuthUser()
  @ApiOperation({
    summary: 'Get all user quizzes.',
  })
  @ApiCreatedResponse({
    type: [Quiz],
  })
  @Get('/user')
  getUserQuizzes(@ReqUser() user: UserInRequest) {
    return this.quizService.getUserQuizzes(user.id);
  }

  @AuthUser()
  @ApiOperation({
    summary: 'Create quiz.',
  })
  @ApiCreatedResponse({
    type: Quiz,
  })
  @Post()
  create(@Body() dto: CreateQuiz, @ReqUser() user: UserInRequest) {
    return this.quizService.createQuiz(dto, user.id);
  }
}
