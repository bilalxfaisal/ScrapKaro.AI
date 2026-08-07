import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
