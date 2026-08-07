import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ResearchService } from './research.service';
import { CreateResearchDto } from './dto/create-research.dto';

@ApiTags('Research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create a research request',
    description:
      'Submit a research request. The backend sends the data to Gemini and returns a structured research plan.',
  })
  @ApiBody({ type: CreateResearchDto })
  @ApiResponse({
    status: 200,
    description: 'AI-generated research plan returned successfully.',
    schema: {
      example: {
        success: true,
        research: {
          topic: 'Artificial Intelligence',
          plan: {
            researchGoal:
              'Understand the current state of large language models and their applications in AI research.',
            searchQueries: [
              'large language models survey 2024',
              'GPT-4 architecture and capabilities',
              'LLM applications in research papers',
              'transformer models natural language processing',
              'prompt engineering techniques for LLMs',
            ],
            keywords: [
              'large language models',
              'transformer architecture',
              'natural language processing',
              'GPT',
              'BERT',
              'fine-tuning',
              'prompt engineering',
            ],
            recommendedSources: [
              'arXiv',
              'Google Scholar',
              'IEEE Xplore',
              'ACL Anthology',
            ],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    schema: {
      example: {
        statusCode: 400,
        message: ['topic must be longer than or equal to 3 characters'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Gemini API error or configuration issue.',
    schema: {
      example: {
        statusCode: 500,
        message: 'GEMINI_API_KEY is not configured.',
        error: 'Internal Server Error',
      },
    },
  })
  create(@Body() createResearchDto: CreateResearchDto) {
    return this.researchService.createResearch(createResearchDto);
  }
}
