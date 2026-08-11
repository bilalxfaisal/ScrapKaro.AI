import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { CreateResearchDto } from './dto/create-research.dto';
import { PlannerService, ResearchPlan } from './planner.service';
import { SearchService } from '../search/search.service';
import { SearchResult } from '../common/search-result.interface';
import { EvaluationService } from '../evaluation/evaluation.service';
import { SourceEvaluation } from '../evaluation/evaluation.interface';
import type { Database } from '../db/db';
import { DATABASE } from '../db/database.module';
import { researchSessions } from '../db/schema';

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
    @Inject(DATABASE) private readonly db: Database,
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

    console.log('ResearchService: sources before evaluation', results);
    const evaluatedResults = await this.evaluationService.evaluateSources(
      dto.topic,
      plan.researchGoal,
      results,
    );
    console.log('ResearchService: evaluated results', evaluatedResults);

    await this.db
      .insert(researchSessions)
      .values({
        topic: dto.topic,
        purpose: dto.purpose,
        focus: dto.focus || null,
        sourceTypes: dto.sourceTypes,
        researchGoal: plan.researchGoal,
        searchQueries: plan.searchQueries,
        keywords: plan.keywords,
        recommendedSources: plan.recommendedSources,
        results: evaluatedResults,
      })
      .returning();

    return {
      success: true,
      research: {
        topic: dto.topic,
        plan,
        results: evaluatedResults,
      },
    };
  }

  async getHistory() {
    return this.db
      .select({
        id: researchSessions.id,
        topic: researchSessions.topic,
        purpose: researchSessions.purpose,
        focus: researchSessions.focus,
        researchGoal: researchSessions.researchGoal,
        results: researchSessions.results,
        createdAt: researchSessions.createdAt,
      })
      .from(researchSessions)
      .orderBy(desc(researchSessions.createdAt));
  }

  async getSession(id: string) {
    const [session] = await this.db
      .select()
      .from(researchSessions)
      .where(eq(researchSessions.id, id));

    if (!session) {
      throw new NotFoundException('Research session not found.');
    }

    return session;
  }

  async deleteSession(id: string) {
    const [session] = await this.db
      .delete(researchSessions)
      .where(eq(researchSessions.id, id))
      .returning({ id: researchSessions.id });

    if (!session) {
      throw new NotFoundException('Research session not found.');
    }

    return session;
  }
}
