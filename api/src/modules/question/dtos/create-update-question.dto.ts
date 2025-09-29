import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUpdateQuestion {
  @IsString()
  @ApiProperty()
  quizId: string;

  @IsString()
  @ApiProperty()
  question: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  explanation?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  feedbackOnCorrect?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  feedbackOnIncorrect?: string;
}
