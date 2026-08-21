import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export const MIN_SOURCES = 5;
export const MAX_SOURCES = 15;

export class UpdateApiKeysDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @Length(16, 512)
  geminiApiKey?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @Length(16, 512)
  exaApiKey?: string;

  @ApiPropertyOptional({
    description: `Maximum number of evaluated sources returned per research run (${MIN_SOURCES}-${MAX_SOURCES}).`,
    example: 10,
    minimum: MIN_SOURCES,
    maximum: MAX_SOURCES,
  })
  @IsOptional()
  @IsInt()
  @Min(MIN_SOURCES)
  @Max(MAX_SOURCES)
  maxSources?: number;
}
