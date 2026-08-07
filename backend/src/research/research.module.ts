import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { PlannerService } from './planner.service';
import { AiModule } from '../ai/ai.module';
import { SearchModule } from '../search/search.module';
import { EvaluationModule } from '../evaluation/evaluation.module';

@Module({
  imports: [AiModule, SearchModule, EvaluationModule],
  controllers: [ResearchController],
  providers: [ResearchService, PlannerService],
})
export class ResearchModule {}
