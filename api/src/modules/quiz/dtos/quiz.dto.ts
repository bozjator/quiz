import { ApiProperty } from '@nestjs/swagger';
import { QuizUserProgress } from './quiz-user-progress.dto';

export class Quiz {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userProgress?: QuizUserProgress;
}
