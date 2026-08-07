import { SearchResult } from '../common/search-result.interface';

export type EvaluatedSourceType = 'academic' | 'article' | 'website';
export type EvaluationRecommendation = 'high' | 'medium' | 'low';

export interface SourceEvaluation {
  relevanceScore: number;
  qualityScore: number;
  sourceType: EvaluatedSourceType;
  recommendation: EvaluationRecommendation;
  explanation: string;
}

export interface EvaluatedSource extends SearchResult {
  evaluation?: SourceEvaluation;
}
