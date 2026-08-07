import { Injectable, Logger } from '@nestjs/common';
import { ExaProvider } from '../providers/exa/exa.provider';
import { ExaApiSearchResultItem } from '../providers/exa/exa.types';
import {
  SearchResult,
  SearchResultType,
} from '../common/search-result.interface';

/** MVP guardrails — see project notes for why these are hardcoded for now. */
const MAX_QUERIES = 5;
const RESULTS_PER_QUERY = 5;

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly exaProvider: ExaProvider) {}

  /**
   * Runs each query against Exa, normalizes + combines + deduplicates the
   * results, and returns a single provider-independent SearchResult[].
   *
   * A failure on one query does not fail the whole batch — it's logged and
   * skipped so the remaining queries can still contribute results.
   */
  async searchQueries(queries: string[]): Promise<SearchResult[]> {
    const limitedQueries = queries.slice(0, MAX_QUERIES);

    if (limitedQueries.length === 0) {
      return [];
    }

    const settled = await Promise.allSettled(
      limitedQueries.map((query) =>
        this.exaProvider.search(query, RESULTS_PER_QUERY),
      ),
    );

    const rawResults: ExaApiSearchResultItem[] = [];

    settled.forEach((outcome, index) => {
      if (outcome.status === 'fulfilled') {
        rawResults.push(...outcome.value.results);
      } else {
        this.logger.warn(
          `Search query failed, skipping: "${limitedQueries[index]}" — ${outcome.reason}`,
        );
      }
    });

    const failedCount = settled.filter((s) => s.status === 'rejected').length;
    if (failedCount === settled.length) {
      this.logger.warn(
        'All Exa search queries failed — returning an empty result set.',
      );
    }

    const normalized = rawResults.map((item) => this.normalize(item));

    return this.deduplicate(normalized);
  }

  private normalize(item: ExaApiSearchResultItem): SearchResult {
    return {
      title: item.title?.trim() || item.url,
      url: item.url,
      publishedDate: item.publishedDate ?? undefined,
      author: item.author ?? undefined,
      source: this.extractSource(item.url),
      type: this.categorize(item.url),
    };
  }

  /** Deterministic, non-AI URL-based categorization (per project rules). */
  private categorize(url: string): SearchResultType {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return 'website';
    }

    const path = parsed.pathname.toLowerCase();

    if (path.endsWith('.pdf')) {
      return 'pdf';
    }

    // A bare root path (the domain's homepage) reads as a generic website;
    // anything with a deeper path reads as a specific article/page.
    const isRootPath = path === '' || path === '/';
    return isRootPath ? 'website' : 'article';
  }

  private extractSource(url: string): string | undefined {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return undefined;
    }
  }

  /** Deduplicates by normalized URL (strips hash, trailing slash, casing). */
  private deduplicate(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    const deduped: SearchResult[] = [];

    for (const result of results) {
      const key = this.normalizeUrl(result.url);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      deduped.push(result);
    }

    return deduped;
  }

  private normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      parsed.hash = '';
      let normalized = `${parsed.origin}${parsed.pathname}${parsed.search}`;
      if (normalized.length > 1 && normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
      }
      return normalized.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }
}
