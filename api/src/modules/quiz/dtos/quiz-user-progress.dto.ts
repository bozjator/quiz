import { ApiProperty } from '@nestjs/swagger';

export class QuizUserProgress {
  @ApiProperty()
  totalQuestions: number;

  @ApiProperty()
  notAnswered: number;

  @ApiProperty()
  positiveReinforcement: number;

  @ApiProperty()
  negativeReinforcement: number;

  @ApiProperty()
  neutralReinforcement: number;

  constructor() {
    this.totalQuestions = 0;
    this.notAnswered = 0;
    this.positiveReinforcement = 0;
    this.negativeReinforcement = 0;
    this.neutralReinforcement = 0;
  }
}
