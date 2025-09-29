import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AnswerService } from './answer.service';
import { Answer } from './dtos/answer.dto';
import { CreateUpdateAnswer } from './dtos/create-update-answer.dto';

@AuthUser()
@ApiTags('answer')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOperation({
    summary: 'Create answer.',
  })
  @ApiCreatedResponse({
    type: Answer,
  })
  @Post()
  async createAnswer(@Body() dto: CreateUpdateAnswer) {
    return this.answerService.createAnswer(dto);
  }

  @ApiOperation({
    summary: 'Create multiple answers.',
  })
  @ApiCreatedResponse({
    type: Answer,
    isArray: true,
  })
  @ApiBody({ type: CreateUpdateAnswer, isArray: true })
  @Post('bulk')
  async createAnswers(@Body() dtos: CreateUpdateAnswer[]) {
    return this.answerService.createAnswers(dtos);
  }

  @ApiOperation({ summary: 'Update answer.' })
  @ApiOkResponse({
    type: Answer,
  })
  @Put(':id')
  async updateAnswer(@Param('id') id: string, @Body() dto: CreateUpdateAnswer) {
    return this.answerService.updateAnswer(id, dto);
  }

  @ApiOperation({ summary: 'Delete answer.' })
  @ApiOkResponse()
  @Delete(':id')
  async deleteAnswer(@Param('id') id: string) {
    return this.answerService.deleteAnswer(id);
  }
}
