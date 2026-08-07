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
      'Submit a research request. The backend sends the data to Gemini to generate a structured research plan ' +
      '(research.plan), then runs the plan\'s searchQueries (max 5) against Exa to fetch real internet results, ' +
      'normalizes/deduplicates them, and returns them alongside the plan (research.results).',
  })
  @ApiBody({ type: CreateResearchDto })
  @ApiResponse({
    status: 200,
    description:
      'AI-generated research plan and real Exa search results returned successfully. ' +
      'research.plan contains: researchGoal (string), searchQueries (string[]), keywords (string[]), ' +
      'recommendedSources (string[]). research.results is an array of SearchResult objects, each with: ' +
      'title (string), url (string), description (string, optional), publishedDate (string, optional), ' +
      'author (string, optional), source (string, optional — the result\'s domain), and ' +
      'type ("article" | "pdf" | "website", determined deterministically from the URL).',
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
          results: [
            {
              title: 'A Survey of Large Language Models',
              url: 'https://arxiv.org/abs/2303.18223',
              publishedDate: '2023-03-31',
              author: 'Wayne Xin Zhao et al.',
              source: 'arxiv.org',
              type: 'article',
            },
            {
              title: 'Attention Is All You Need',
              url: 'https://arxiv.org/pdf/1706.03762.pdf',
              publishedDate: '2017-06-12',
              author: 'Ashish Vaswani et al.',
              source: 'arxiv.org',
              type: 'pdf',
            },
          ],
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
