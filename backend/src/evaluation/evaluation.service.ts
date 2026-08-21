import { Injectable, Logger } from '@nestjs/common';
import { Type } from '@google/genai';
import { AiService } from '../ai/ai.service';
import { SearchResult } from '../common/search-result.interface';
import {
  EvaluatedSource,
  RawSourceEvaluation,
  SourceEvaluation,
  EvaluatedSourceType,
  EvaluationRecommendation,
} from './evaluation.interface';

const DEFAULT_MAX_EVALUATION_SOURCES = 5;
const EVALUATION_BATCH_SIZE = 2;
const VALID_SOURCE_TYPES: ReadonlySet<string> = new Set([
  'academic',
  'article',
  'website',
  'pdf',
]);
const VALID_RECOMMENDATIONS: ReadonlySet<string> = new Set([
  'high',
  'medium',
  'low',
]);

@Injectable()
export class EvaluationService {
  private readonly logger = new Logger(EvaluationService.name);

  constructor(private readonly aiService: AiService) {}

  async evaluateSources(
    topic: string,
    researchGoal: string,
    sources: SearchResult[],
    apiKey?: string,
    maxSources: number = DEFAULT_MAX_EVALUATION_SOURCES,
  ): Promise<EvaluatedSource[]> {
    const limitedSources = sources.slice(0, maxSources);

    if (!limitedSources.length) {
      this.logger.log('No sources to evaluate. Returning empty source list.');
      return [];
    }

    if (sources.length > maxSources) {
      this.logger.log(
        `Limiting source evaluation to first ${maxSources} of ${sources.length} returned by Exa.`,
      );
    }

    const sourcePayload = limitedSources.map((source) => ({
      title: this.normalizePromptText(source.title),
      url: this.normalizePromptText(source.url),
      description: this.normalizePromptText(source.description ?? ''),
    }));

    const systemPrompt = `You are an academic research evaluator. Return a JSON array of objects. Each object must have exactly these fields: url, relevanceScore, qualityScore, sourceType, recommendation, explanation. Use integers 0-100 for scores. Use one of these sourceType values: academic, article, website, pdf. Use one of these recommendations: high, medium, low. Do not include markdown or extra text.`;

    const evaluations: RawSourceEvaluation[] = [];

    try {
      this.logger.log(
        `Evaluating ${sourcePayload.length} sources in batches of ${EVALUATION_BATCH_SIZE}`,
      );

      for (
        let index = 0;
        index < sourcePayload.length;
        index += EVALUATION_BATCH_SIZE
      ) {
        const batch = sourcePayload.slice(index, index + EVALUATION_BATCH_SIZE);
        const userPrompt = `Topic: ${this.normalizePromptText(topic)}
Goal: ${this.normalizePromptText(researchGoal)}
Sources: ${JSON.stringify(batch, null, 2)}`;

        const batchResult = await this.aiService.generateJson<
          RawSourceEvaluation[]
        >(
          systemPrompt,
          userPrompt,
          {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                url: { type: Type.STRING },
                relevanceScore: { type: Type.INTEGER },
                qualityScore: { type: Type.INTEGER },
                sourceType: {
                  type: Type.STRING,
                  enum: ['academic', 'article', 'website', 'pdf'],
                },
                recommendation: {
                  type: Type.STRING,
                  enum: ['high', 'medium', 'low'],
                },
                explanation: { type: Type.STRING },
              },
              required: [
                'url',
                'relevanceScore',
                'qualityScore',
                'sourceType',
                'recommendation',
                'explanation',
              ],
            },
          },
          {
            model: 'gemini-3.6-flash',
            maxOutputTokens: 1200,
            apiKey,
          },
        );

        evaluations.push(...(batchResult ?? []));
      }

      const evaluatedSources = this.mergeEvaluations(
        limitedSources,
        evaluations,
      );

      const rankedResults = evaluatedSources.sort((a, b) => {
        const aEval = a.evaluation;
        const bEval = b.evaluation;

        if (!aEval || !bEval) return 0;

        const recScore = { high: 3, medium: 2, low: 1 };
        const aRec = recScore[aEval.recommendation] || 0;
        const bRec = recScore[bEval.recommendation] || 0;

        if (bRec !== aRec) return bRec - aRec;

        if (bEval.relevanceScore !== aEval.relevanceScore) {
          return bEval.relevanceScore - aEval.relevanceScore;
        }
        return bEval.qualityScore - aEval.qualityScore;
      });

      this.logger.log(
        `Evaluation complete | evaluated=${rankedResults.length}`,
      );
      return rankedResults;
    } catch (error) {
      this.logger.warn(
        `Gemini evaluation failed: ${(error as Error).message}. Returning original Exa results.`,
      );
      return limitedSources.map((source) => ({ ...source }));
    }
  }

  private normalizePromptText(value: string): string {
    return value
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$2')
      .replace(/\((https?:\/\/[^)]+)\)/g, '$1')
      .replace(/\\([~_:\-])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private mergeEvaluations(
    sources: SearchResult[],
    evaluations: RawSourceEvaluation[],
  ): EvaluatedSource[] {
    const sourceMap = new Map<string, SearchResult>();
    const titleMap = new Map<string, SearchResult>();

    sources.forEach((source) => {
      sourceMap.set(this.normalizeUrl(source.url), source);
      titleMap.set(this.normalizeTitle(source.title), source);
    });

    const evaluationMap = new Map<string, SourceEvaluation>();

    for (const rawEvaluation of evaluations) {
      const evaluation: SourceEvaluation = {
        relevanceScore: this.normalizeScore(rawEvaluation.relevanceScore),
        qualityScore: this.normalizeScore(rawEvaluation.qualityScore),
        sourceType: rawEvaluation.sourceType,
        recommendation: rawEvaluation.recommendation,
        explanation: rawEvaluation.explanation,
      };

      const normalizedUrl = rawEvaluation.url
        ? this.normalizeUrl(rawEvaluation.url)
        : undefined;
      const matchedSource = normalizedUrl
        ? sourceMap.get(normalizedUrl)
        : undefined;

      if (matchedSource && normalizedUrl) {
        evaluationMap.set(this.normalizeUrl(matchedSource.url), evaluation);
        continue;
      }

      if (rawEvaluation.title) {
        const matchedByTitle = titleMap.get(
          this.normalizeTitle(rawEvaluation.title),
        );
        if (matchedByTitle) {
          evaluationMap.set(this.normalizeUrl(matchedByTitle.url), evaluation);
          continue;
        }
      }

      // If no direct match by URL or title, add evaluation to the first unmatched source.
      const unmatchedSource = sources.find(
        (source) => !evaluationMap.has(this.normalizeUrl(source.url)),
      );

      if (unmatchedSource) {
        evaluationMap.set(this.normalizeUrl(unmatchedSource.url), evaluation);
      }
    }

    return sources.map((source) => ({
      ...source,
      evaluation: evaluationMap.get(this.normalizeUrl(source.url)),
    }));
  }

  private normalizeScore(value: unknown): number {
    const score = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(score)) {
      return 0;
    }
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private normalizeSourceType(value: string): EvaluatedSourceType | undefined {
    const normalized = value.trim().toLowerCase();
    if (
      normalized.includes('academic') ||
      normalized.includes('arxiv') ||
      normalized.includes('ieee') ||
      normalized.includes('acm') ||
      normalized.includes('springer') ||
      normalized.includes('elsevier') ||
      normalized.endsWith('.edu')
    ) {
      return 'academic';
    }
    if (normalized === 'pdf' || normalized.includes('pdf')) {
      return 'article';
    }
    if (
      normalized.includes('article') ||
      normalized.includes('blog') ||
      normalized.includes('news') ||
      normalized.includes('tutorial')
    ) {
      return 'article';
    }
    if (
      normalized.includes('website') ||
      normalized.includes('site') ||
      normalized.includes('webpage')
    ) {
      return 'website';
    }
    return 'website';
  }

  private normalizeTitle(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private normalizeRecommendation(
    value: string,
  ): EvaluationRecommendation | undefined {
    const normalized = value.trim().toLowerCase();
    if (
      normalized === 'high' ||
      normalized === 'recommend high' ||
      normalized === 'strong'
    ) {
      return 'high';
    }
    if (
      normalized === 'medium' ||
      normalized === 'recommend medium' ||
      normalized === 'moderate'
    ) {
      return 'medium';
    }
    if (
      normalized === 'low' ||
      normalized === 'recommend low' ||
      normalized === 'weak'
    ) {
      return 'low';
    }
    return undefined;
  }

  private normalizeUrl(url: string): string {
    const cleaned = url
      .replace(/[\\[\\]\\(>\\)\\`\\'\\"]/g, '')
      .replace(/\\\\/g, '')
      .trim();
    try {
      const parsed = new URL(cleaned);
      parsed.hash = '';
      let normalized = `${parsed.origin}${parsed.pathname}${parsed.search}`;
      if (normalized.length > 1 && normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
      }
      return normalized.toLowerCase();
    } catch {
      return cleaned.toLowerCase();
    }
  }
}
