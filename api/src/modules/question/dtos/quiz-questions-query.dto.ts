import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { QuizType } from 'src/modules/quiz/model/quiz-type.enum';
import { ApiPropertyEnum } from 'src/shared/decorators/api-property-enum.decorator';

export class QuizQuestionsQuery {
  @ApiPropertyEnum(QuizType, 'type')
  type: QuizType;

  @IsNumber()
  @ApiProperty()
  count: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Percentage of new questions that have not been seen yet.',
  })
  percentOfNew?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description:
      'Percentage of questions sorted based on oldest last seen first.',
  })
  percentOfSeenOldest?: number;
}
