import { ApiProperty } from '@nestjs/swagger';

export class QuizPlayResult {
  @ApiProperty()
  questionsCount: number;

  @ApiProperty()
  correctAnswersCount: number;

  @ApiProperty()
  resultPercentages: number;

  @ApiProperty()
  duration: number;
}
