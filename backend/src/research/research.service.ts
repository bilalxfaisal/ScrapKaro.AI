import { Injectable, Logger } from '@nestjs/common';
import { CreateResearchDto } from './dto/create-research.dto';
import { PlannerService, ResearchPlan } from './planner.service';

export interface ResearchResult {
  success: boolean;
  research: {
    topic: string;
    plan: ResearchPlan;
  };
}

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(ResearchService.name);

  constructor(private readonly plannerService: PlannerService) {}

  async createResearch(dto: CreateResearchDto): Promise<ResearchResult> {
    this.logger.log(`Processing research request for topic: "${dto.topic}"`);

    const plan = await this.plannerService.generatePlan(dto);

    return {
      success: true,
      research: {
        topic: dto.topic,
        plan,
      },
    };
  }
}
