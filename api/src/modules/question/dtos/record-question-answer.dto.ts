import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class RecordQuestionAnswer {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  selectedAnswerIds: string[];
}
