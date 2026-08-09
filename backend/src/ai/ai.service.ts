import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

interface GeminiRequestOptions {
  model?: string;
  responseSchema?: unknown;
  maxOutputTokens?: number;
  temperature?: number;
}

interface GeminiRequestTrace {
  model: string;
  promptSize: number;
  estimatedTokens: number;
  responseSize: number;
  durationMs: number;
  retryCount: number;
  finishReason?: string;
  safetyBlocks?: string;
}

@Injectable()
export class AiService {
  private readonly gemini: GoogleGenAI;
  private readonly logger = new Logger(AiService.name);
  private readonly fallbackModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3-pro-preview'];

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is not configured. Please set it in your .env file.',
      );
    }

    this.gemini = new GoogleGenAI({
      apiKey,
    });
  }

  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    options: GeminiRequestOptions = {},
  ): Promise<string> {
    const result = await this.generateText(systemPrompt, userPrompt, options);
    return result.text;
  }

  async generateJson<T>(
    systemPrompt: string,
    userPrompt: string,
    responseSchema: unknown,
    options: GeminiRequestOptions = {},
  ): Promise<T> {
    const result = await this.generateText(systemPrompt, userPrompt, {
      ...options,
      responseSchema,
    });

    try {
      return JSON.parse(result.text) as T;
    } catch (error) {
      this.logger.warn(
        `Structured Gemini response was not valid JSON. Raw response: ${result.text}`,
      );
      throw new InternalServerErrorException(
        `Gemini returned invalid structured JSON: ${(error as Error).message}`,
      );
    }
  }

  private async generateText(
    systemPrompt: string,
    userPrompt: string,
    options: GeminiRequestOptions = {},
  ): Promise<{ text: string; trace: GeminiRequestTrace }> {
    const promptSize = systemPrompt.length + userPrompt.length;
    const estimatedTokens = this.estimateTokens(systemPrompt, userPrompt);
    const fallbackModels = this.getModelCandidates(options.model);

    let lastError: unknown;

    for (const model of fallbackModels) {
      for (let attempt = 0; attempt <= 3; attempt += 1) {
        const startedAt = Date.now();
        try {
          const response = await this.gemini.models.generateContent({
            model,
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: options.responseSchema,
              maxOutputTokens: options.maxOutputTokens ?? this.defaultMaxOutputTokens(systemPrompt, userPrompt),
              temperature: options.temperature ?? 0.1,
            },
          });

          const text = this.extractText(response);

          if (!text) {
            throw new InternalServerErrorException('Gemini returned an empty response.');
          }

          const trace: GeminiRequestTrace = {
            model,
            promptSize,
            estimatedTokens,
            responseSize: text.length,
            durationMs: Date.now() - startedAt,
            retryCount: attempt,
            finishReason: this.extractFinishReason(response),
            safetyBlocks: this.extractSafetyBlockReason(response),
          };

          this.logger.log(
            `Gemini response accepted | model=${trace.model} | promptChars=${trace.promptSize} | estimatedTokens=${trace.estimatedTokens} | responseChars=${trace.responseSize} | durationMs=${trace.durationMs} | retries=${trace.retryCount} | finishReason=${trace.finishReason ?? 'unknown'} | safetyBlocks=${trace.safetyBlocks ?? 'none'}`,
          );

          return { text, trace };
        } catch (error) {
          lastError = error;
          const status = this.extractStatus(error);
          const message = this.extractMessage(error);
          const shouldRetry = this.shouldRetry(status, message);
          const shouldFallback = this.shouldFallback(status, message);

          this.logger.warn(
            `Gemini attempt failed | model=${model} | attempt=${attempt + 1} | status=${status ?? 'unknown'} | message=${message} | retryable=${shouldRetry}`,
          );

          if (shouldRetry && attempt < 3) {
            const delayMs = 1000 * 2 ** attempt;
            await this.delay(delayMs);
            continue;
          }

          if (shouldFallback && model !== fallbackModels[fallbackModels.length - 1]) {
            break;
          }

          break;
        }
      }
    }

    const error = lastError as Error;
    this.logger.error(`Gemini failed after all retries and fallbacks | message=${error?.message ?? 'unknown'}`);
    throw new InternalServerErrorException(
      `Gemini API error: ${error?.message ?? 'Unknown Gemini failure'}`,
    );
  }

  private defaultMaxOutputTokens(systemPrompt: string, userPrompt: string): number {
    const estimatedChars = systemPrompt.length + userPrompt.length;
    return Math.min(2048, Math.max(1024, Math.ceil(estimatedChars / 3)));
  }

  private getModelCandidates(preferredModel?: string): string[] {
    const models = new Set<string>([preferredModel, ...this.fallbackModels].filter(Boolean) as string[]);
    return Array.from(models);
  }

  private shouldRetry(status?: number, message = ''): boolean {
    return [429, 500, 503, 504].includes(status ?? 0) || /unavailable|overloaded|timeout|resource exhausted/i.test(message);
  }

  private shouldFallback(status?: number, message = ''): boolean {
    return [400, 401, 403, 404].includes(status ?? 0) || /permission|model.*not|not available|unsupported/i.test(message);
  }

  private extractStatus(error: unknown): number | undefined {
    if (typeof error === 'object' && error !== null) {
      const status = (error as { status?: number }).status;
      if (typeof status === 'number') {
        return status;
      }
    }
    return undefined;
  }

  private extractMessage(error: unknown): string {
    if ((error as Error).message) {
      return (error as Error).message;
    }
    return JSON.stringify(error ?? {});
  }

  private extractText(response: unknown): string {
    if (typeof response === 'object' && response !== null && 'text' in response) {
      const text = (response as { text?: string }).text;
      if (typeof text === 'string' && text.trim()) {
        return text;
      }
    }

    const candidates = (response as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates;
    if (Array.isArray(candidates)) {
      const parts = candidates[0]?.content?.parts;
      if (Array.isArray(parts)) {
        const joined = parts.map((part) => part?.text ?? '').join('');
        if (joined.trim()) {
          return joined;
        }
      }
    }

    return '';
  }

  private extractFinishReason(response: unknown): string | undefined {
    if (typeof response === 'object' && response !== null) {
      const candidates = (response as { candidates?: Array<{ finishReason?: string }> }).candidates;
      if (Array.isArray(candidates) && candidates[0]?.finishReason) {
        return candidates[0].finishReason;
      }
    }
    return undefined;
  }

  private extractSafetyBlockReason(response: unknown): string | undefined {
    if (typeof response === 'object' && response !== null) {
      const promptFeedback = (response as { promptFeedback?: { blockReason?: string } }).promptFeedback;
      if (promptFeedback?.blockReason) {
        return promptFeedback.blockReason;
      }
    }
    return undefined;
  }

  private estimateTokens(systemPrompt: string, userPrompt: string): number {
    return Math.ceil((systemPrompt.length + userPrompt.length) / 4);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}