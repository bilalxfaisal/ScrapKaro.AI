import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { PlannerService } from './planner.service';
import { AiModule } from '../ai/ai.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [AiModule, SearchModule],
  controllers: [ResearchController],
  providers: [ResearchService, PlannerService],
})
export class ResearchModule {}
