/**
 * Raw shapes returned by the Exa `/search` endpoint.
 *
 * These types intentionally mirror Exa's API response as closely as
 * possible. They should never leak outside of the `providers/exa` folder —
 * `SearchService` is responsible for converting these into the app's
 * provider-independent `SearchResult` shape.
 *
 * @see https://docs.exa.ai/reference/search
 */

export interface ExaApiSearchResultItem {
  id: string;
  url: string;
  title: string | null;
  score?: number;
  publishedDate?: string | null;
  author?: string | null;
}

export interface ExaApiSearchResponse {
  requestId?: string;
  autopromptString?: string;
  resolvedSearchType?: string;
  results: ExaApiSearchResultItem[];
}
