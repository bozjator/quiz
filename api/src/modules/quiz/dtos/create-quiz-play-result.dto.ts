import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateQuizPlayResult {
  @IsNumber()
  @ApiProperty()
  questionsCount: number;

  @IsNumber()
  @ApiProperty()
  correctAnswersCount: number;

  @IsNumber()
  @ApiProperty()
  duration: number;
}
