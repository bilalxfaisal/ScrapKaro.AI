import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { CreateResearchDto } from './dto/create-research.dto';

export interface ResearchPlan {
  researchGoal: string;
  searchQueries: string[];
  keywords: string[];
  recommendedSources: string[];
}

@Injectable()
export class PlannerService {
  private readonly logger = new Logger(PlannerService.name);

  constructor(private readonly aiService: AiService) { }

  async generatePlan(dto: CreateResearchDto): Promise<ResearchPlan> {
    const { topic, purpose, sourceTypes, focus } = dto;

    const systemPrompt = `You are an expert research assistant. Analyze the user's research goal and create a structured research plan.

You MUST respond with a valid JSON object containing exactly these fields:
{
  "researchGoal": "<a clear, one-sentence description of the research objective>",
  "searchQueries": ["<query 1>", "<query 2>", "<query 3>", "<query 4>", "<query 5>"],
  "keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "recommendedSources": ["<source type 1>", "<source type 2>", "<source type 3>"]
}

Rules:
- researchGoal: a single, clear sentence describing what the researcher wants to achieve.
- searchQueries: 4-6 specific, targeted search queries the user should use.
- keywords: 5-8 important academic/technical keywords relevant to the topic.
- recommendedSources: 2-4 specific source types most appropriate for this research (e.g. "PubMed", "IEEE Xplore", "arXiv", "Google Scholar").
- Do NOT include any text outside the JSON object.`;

    const userPrompt = `Research Topic: ${topic}
Purpose: ${purpose}
Requested Sources: ${sourceTypes.join(', ')}
Focus Area: ${focus ?? 'Not specified'}

Please generate a research plan for this request.`;

    this.logger.log(`Generating research plan for topic: "${topic}"`);

    let raw: string;
    try {
      raw = await this.aiService.generateCompletion(systemPrompt, userPrompt);
    } catch (error) {
      throw error;
    }

    let plan: ResearchPlan;
    try {
      plan = JSON.parse(raw) as ResearchPlan;
    } catch {
      this.logger.error('Failed to parse AI response as JSON:', raw);
      throw new InternalServerErrorException(
        'AI returned an invalid response. Please try again.',
      );
    }

    // Validate required fields
    if (
      !plan.researchGoal ||
      !Array.isArray(plan.searchQueries) ||
      !Array.isArray(plan.keywords) ||
      !Array.isArray(plan.recommendedSources)
    ) {
      this.logger.error('AI response is missing required fields:', plan);
      throw new InternalServerErrorException(
        'AI response is missing required fields. Please try again.',
      );
    }

    return plan;
  }
}
