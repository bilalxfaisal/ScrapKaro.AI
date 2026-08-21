import { Injectable, Logger } from '@nestjs/common';
import { ExaProvider } from '../providers/exa/exa.provider';
import { ExaApiSearchResultItem } from '../providers/exa/exa.types';
import {
  SearchResult,
  SearchResultType,
} from '../common/search-result.interface';

/** MVP guardrails — see project notes for why these are hardcoded for now. */
const MAX_QUERIES = 5;
const BASE_RESULTS_PER_QUERY = 5;
const MAX_RESULTS_PER_QUERY = 10;
const RESULT_OVERFETCH_FACTOR = 2;

export interface SearchOptions {
  /** Minimum number of deduplicated results the caller wants back. */
  minResults?: number;
}

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
  async searchQueries(
    queries: string[],
    apiKey?: string,
    options: SearchOptions = {},
  ): Promise<SearchResult[]> {
    const limitedQueries = queries.slice(0, MAX_QUERIES);

    if (limitedQueries.length === 0) {
      return [];
    }

    const resultsPerQuery = Math.min(
      MAX_RESULTS_PER_QUERY,
      Math.max(
        BASE_RESULTS_PER_QUERY,
        Math.ceil(
          ((options.minResults ?? BASE_RESULTS_PER_QUERY) *
            RESULT_OVERFETCH_FACTOR) /
            limitedQueries.length,
        ),
      ),
    );

    const settled = await Promise.allSettled(
      limitedQueries.map((query) =>
        this.exaProvider.search(query, resultsPerQuery, apiKey),
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
    const cleanedUrl = this.cleanUrl(item.url);
    return {
      title: item.title?.trim() || cleanedUrl,
      url: cleanedUrl,
      publishedDate: item.publishedDate ?? undefined,
      author: item.author ?? undefined,
      source: this.extractSource(cleanedUrl),
      type: this.categorize(cleanedUrl),
    };
  }

  private cleanUrl(url: string): string {
    // Remove markdown syntax, escaped characters, and backslashes
    return url
      .replace(/[\\[\\]\\(>\\)\\`\\'\\"]/g, '')
      .replace(/\\\\/g, '')
      .trim();
  }

  /** Deterministic, non-AI URL-based categorization (per project rules). */
  private categorize(url: string): SearchResultType {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return 'website';
    }

    const domain = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const path = parsed.pathname.toLowerCase();

    // academic: arxiv.org, ieee.org, acm.org, springer.com, elsevier.com, university domains (.edu)
    const academicDomains = [
      'arxiv.org',
      'ieee.org',
      'acm.org',
      'springer.com',
      'elsevier.com',
    ];
    if (academicDomains.includes(domain) || domain.endsWith('.edu')) {
      return 'academic';
    }

    if (path.endsWith('.pdf')) {
      return 'pdf';
    }

    const isArticle =
      path.includes('/blog/') ||
      path.includes('/news/') ||
      path.includes('/tutorial/') ||
      path.includes('/post/');
    if (isArticle) {
      return 'article';
    }

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
