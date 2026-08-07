import { Injectable, Logger } from '@nestjs/common';
import { CreateResearchDto } from './dto/create-research.dto';
import { PlannerService, ResearchPlan } from './planner.service';
import { SearchService } from '../search/search.service';
import { SearchResult } from '../common/search-result.interface';

export interface ResearchResult {
  success: boolean;
  research: {
    topic: string;
    plan: ResearchPlan;
    results: SearchResult[];
  };
}

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(ResearchService.name);

  constructor(
    private readonly plannerService: PlannerService,
    private readonly searchService: SearchService,
  ) {}

  async createResearch(dto: CreateResearchDto): Promise<ResearchResult> {
    this.logger.log(`Processing research request for topic: "${dto.topic}"`);

    const plan = await this.plannerService.generatePlan(dto);

    this.logger.log(
      `Fetching real search results for ${Math.min(
        plan.searchQueries.length,
        5,
      )} of ${plan.searchQueries.length} generated quer${
        plan.searchQueries.length === 1 ? 'y' : 'ies'
      }`,
    );

    const results = await this.searchService.searchQueries(
      plan.searchQueries,
    );

    return {
      success: true,
      research: {
        topic: dto.topic,
        plan,
        results,
      },
    };
  }
}
