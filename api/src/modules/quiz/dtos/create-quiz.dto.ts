import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateQuiz {
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isPublic?: boolean;
}
