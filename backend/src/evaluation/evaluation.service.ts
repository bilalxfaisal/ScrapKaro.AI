import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { SearchResult } from '../common/search-result.interface';
import {
  EvaluatedSource,
  SourceEvaluation,
  EvaluatedSourceType,
  EvaluationRecommendation,
} from './evaluation.interface';

const MAX_EVALUATION_SOURCES = 20;
const VALID_SOURCE_TYPES: ReadonlySet<string> = new Set(['academic', 'article', 'website']);
const VALID_RECOMMENDATIONS: ReadonlySet<string> = new Set(['high', 'medium', 'low']);

@Injectable()
export class EvaluationService {
  private readonly logger = new Logger(EvaluationService.name);

  constructor(private readonly aiService: AiService) {}

  async evaluateSources(
    topic: string,
    researchGoal: string,
    sources: SearchResult[],
  ): Promise<EvaluatedSource[]> {
    const limitedSources = sources.slice(0, MAX_EVALUATION_SOURCES);

    if (!limitedSources.length) {
      this.logger.log('No sources to evaluate. Returning empty source list.');
      return [];
    }

    if (sources.length > MAX_EVALUATION_SOURCES) {
      this.logger.log(
        `Limiting source evaluation to first ${MAX_EVALUATION_SOURCES} of ${sources.length} returned by Exa.`,
      );
    }

    const sourcePayload = limitedSources.map((source) => ({
      title: source.title,
      url: source.url,
      description: source.description ?? '',
    }));

    const systemPrompt = `You are an expert academic research assistant. Evaluate the quality and relevance of these sources for the user's research goal.

Return ONLY valid JSON, with no markdown, explanation, or extra text. The output must be a JSON array.
Each item in the array must contain the following fields:
- title (string)
- url (string)
- relevanceScore (integer 0-100)
- qualityScore (integer 0-100)
- sourceType ("academic" | "article" | "website")
- recommendation ("high" | "medium" | "low")
- explanation (string)

Rank the sources according to:
1. Relevance to the research topic and goal
2. Academic credibility
3. Source authority
4. Recency
5. Usefulness for the user's purpose.
`;

    const userPrompt = `Research Topic:
${topic}

Research Goal:
${researchGoal}

Sources:
${JSON.stringify(sourcePayload, null, 2)}
`;

    try {
      const rawResponse = await this.aiService.generateCompletion(
        systemPrompt,
        userPrompt,
      );

      const evaluations = this.parseEvaluationResponse(rawResponse);

      if (!evaluations) {
        this.logger.warn(
          'Gemini returned invalid evaluation JSON. Falling back to original Exa results.',
        );
        return limitedSources.map((source) => ({ ...source }));
      }

      const evaluatedSources = this.mergeEvaluations(limitedSources, evaluations);

      return evaluatedSources.sort((a, b) => {
        const aEval = a.evaluation;
        const bEval = b.evaluation;

        if (!aEval || !bEval) return 0;
        if (bEval.relevanceScore !== aEval.relevanceScore) {
          return bEval.relevanceScore - aEval.relevanceScore;
        }
        return bEval.qualityScore - aEval.qualityScore;
      });
    } catch (error) {
      this.logger.warn(
        `Gemini evaluation failed: ${(error as Error).message}. Returning original Exa results.`,
      );
      return limitedSources.map((source) => ({ ...source }));
    }
  }

  private parseEvaluationResponse(rawResponse: string): SourceEvaluation[] | null {
    const jsonText = this.extractJsonArray(rawResponse);
    if (!jsonText) {
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return null;
    }

    if (!Array.isArray(parsed)) {
      return null;
    }

    const evaluations: SourceEvaluation[] = [];

    for (const item of parsed) {
      if (!this.isValidEvaluation(item)) {
        return null;
      }

      evaluations.push({
        title: item.title.trim(),
        url: item.url.trim(),
        relevanceScore: this.normalizeScore(item.relevanceScore),
        qualityScore: this.normalizeScore(item.qualityScore),
        sourceType: item.sourceType as EvaluatedSourceType,
        recommendation: item.recommendation as EvaluationRecommendation,
        explanation: item.explanation.trim(),
      });
    }

    return evaluations;
  }

  private mergeEvaluations(
    sources: SearchResult[],
    evaluations: SourceEvaluation[],
  ): EvaluatedSource[] {
    const sourceMap = new Map<string, SearchResult>();
    sources.forEach((source) => sourceMap.set(source.url, source));

    const matched: EvaluatedSource[] = [];

    for (const evaluation of evaluations) {
      const source = sourceMap.get(evaluation.url);
      if (!source) {
        const fallback = sources.find((item) => item.title === evaluation.title);
        if (fallback) {
          matched.push({ ...fallback, evaluation });
        }
        continue;
      }
      matched.push({ ...source, evaluation });
    }

    return matched.length > 0
      ? matched
      : sources.map((source) => ({ ...source }));
  }

  private extractJsonArray(rawResponse: string): string | null {
    const trimmed = rawResponse.trim();
    const firstBracket = trimmed.indexOf('[');
    const lastBracket = trimmed.lastIndexOf(']');

    if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
      return null;
    }

    return trimmed.substring(firstBracket, lastBracket + 1);
  }

  private isValidEvaluation(item: unknown): item is SourceEvaluation {
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const candidate = item as Record<string, unknown>;

    return (
      typeof candidate.title === 'string' &&
      candidate.title.trim().length > 0 &&
      typeof candidate.url === 'string' &&
      candidate.url.trim().length > 0 &&
      (typeof candidate.relevanceScore === 'number' ||
        (typeof candidate.relevanceScore === 'string' && !Number.isNaN(Number(candidate.relevanceScore)))) &&
      (typeof candidate.qualityScore === 'number' ||
        (typeof candidate.qualityScore === 'string' && !Number.isNaN(Number(candidate.qualityScore)))) &&
      typeof candidate.sourceType === 'string' &&
      VALID_SOURCE_TYPES.has(candidate.sourceType) &&
      typeof candidate.recommendation === 'string' &&
      VALID_RECOMMENDATIONS.has(candidate.recommendation) &&
      typeof candidate.explanation === 'string' &&
      candidate.explanation.trim().length > 0
    );
  }

  private normalizeScore(value: unknown): number {
    const score = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(score)) {
      return 0;
    }
    return Math.min(100, Math.max(0, Math.round(score)));
  }
}
