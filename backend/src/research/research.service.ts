import { Injectable, Logger } from '@nestjs/common';
import { CreateResearchDto } from './dto/create-research.dto';
import { PlannerService, ResearchPlan } from './planner.service';
import { SearchService } from '../search/search.service';
import { SearchResult } from '../common/search-result.interface';
import { EvaluationService } from '../evaluation/evaluation.service';
import { SourceEvaluation } from '../evaluation/evaluation.interface';

export interface ResearchResult {
  success: boolean;
  research: {
    topic: string;
    plan: ResearchPlan;
    results: EvaluatedSearchResult[];
  };
}

export interface EvaluatedSearchResult extends SearchResult {
  evaluation?: SourceEvaluation;
}

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(ResearchService.name);

  constructor(
    private readonly plannerService: PlannerService,
    private readonly searchService: SearchService,
    private readonly evaluationService: EvaluationService,
  ) { }

  async createResearch(dto: CreateResearchDto): Promise<ResearchResult> {
    this.logger.log(`Processing research request for topic: "${dto.topic}"`);

    const plan = await this.plannerService.generatePlan(dto);

    this.logger.log(
      `Fetching real search results for ${Math.min(
        plan.searchQueries.length,
        5,
      )} of ${plan.searchQueries.length} generated quer${plan.searchQueries.length === 1 ? 'y' : 'ies'
      }`,
    );

    const results = await this.searchService.searchQueries(
      plan.searchQueries,
    );

    const evaluatedResults = await this.evaluationService.evaluateSources(
      dto.topic,
      plan.researchGoal,
      results,
    );

    return {
      success: true,
      research: {
        topic: dto.topic,
        plan,
        results: evaluatedResults,
      },
    };
  }
}
