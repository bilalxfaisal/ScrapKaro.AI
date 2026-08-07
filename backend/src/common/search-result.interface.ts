/**
 * Classification of a search result, derived deterministically from its URL.
 */
export type SearchResultType = 'article' | 'pdf' | 'website';

/**
 * Provider-independent shape for a single search result.
 *
 * Nothing outside of `providers/*` should ever depend on a specific search
 * provider's raw response format — everything is normalized into this shape
 * before it leaves the search layer.
 */
export interface SearchResult {
  title: string;
  url: string;
  description?: string;
  publishedDate?: string;
  author?: string;
  source?: string;
  type: SearchResultType;
}
