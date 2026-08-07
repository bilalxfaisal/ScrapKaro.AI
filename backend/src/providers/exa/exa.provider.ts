import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExaApiSearchResponse } from './exa.types';

const EXA_SEARCH_URL = 'https://api.exa.ai/search';
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Thin wrapper around the Exa search API.
 *
 * This provider is ONLY responsible for talking to Exa — it holds no
 * business logic (no deduplication, no categorization, no combining of
 * results across queries). That belongs to `SearchService`.
 */
@Injectable()
export class ExaProvider {
  private readonly logger = new Logger(ExaProvider.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('EXA_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'EXA_API_KEY is not configured. Please set it in your .env file.',
      );
    }

    this.apiKey = apiKey;
  }

  /**
   * Runs a single search query against Exa and returns the raw response.
   *
   * @param query the search query text
   * @param numResults max number of results Exa should return for this query
   */
  async search(query: string, numResults = 5): Promise<ExaApiSearchResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      this.logger.log(`Querying Exa for: "${query}"`);

      const response = await fetch(EXA_SEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          query,
          numResults,
          type: 'auto',
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(
          `Exa API responded with status ${response.status}${
            errorBody ? `: ${errorBody}` : ''
          }`,
        );
      }

      const data = (await response.json()) as ExaApiSearchResponse;

      if (!data || !Array.isArray(data.results)) {
        throw new Error('Exa API returned an unexpected response shape.');
      }

      return data;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error(`Exa search timed out for query: "${query}"`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
