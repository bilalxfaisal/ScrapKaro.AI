import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResearchDto {
  @ApiProperty({
    description: 'The research topic',
    example: 'Machine Learning',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  topic: string;

  @ApiProperty({
    description: 'The purpose of the research',
    example: 'Assignment',
  })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({
    description: 'List of source types to search',
    example: ['Articles', 'Research Papers', 'PDFs'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  sourceTypes: string[];

  @ApiPropertyOptional({
    description: 'Optional focus area for the research',
    example: 'Healthcare',
  })
  @IsOptional()
  @IsString()
  focus?: string;
}
