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

    const systemPrompt = `You are an expert research assistant. Return only a JSON object with these exact fields: researchGoal, searchQueries, keywords, recommendedSources. Use concise values. Do not add any text outside the JSON.`;

    const userPrompt = `Topic: ${topic}
Purpose: ${purpose}
Sources: ${sourceTypes.join(', ')}
Focus: ${focus ?? 'Not specified'}`;

    this.logger.log(`Generating research plan for topic: "${topic}"`);

    let raw: string;
    try {
      raw = await this.aiService.generateCompletion(systemPrompt, userPrompt, {
        model: 'gemini-3.6-flash',
        maxOutputTokens: 1200,
      });
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
