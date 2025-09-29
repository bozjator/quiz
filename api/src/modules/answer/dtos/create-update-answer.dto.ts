import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUpdateAnswer {
  @IsString()
  @ApiProperty()
  questionId: string;

  @IsString()
  @ApiProperty()
  answer: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  explanation?: string;

  @IsBoolean()
  @ApiProperty()
  isCorrect: boolean;
}
