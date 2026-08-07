import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { PlannerService } from './planner.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [ResearchController],
  providers: [ResearchService, PlannerService],
})
export class ResearchModule {}
