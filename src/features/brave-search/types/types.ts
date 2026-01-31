export interface WebSearchResult {
  title: string;
  url: string;
  description?: string;
}

export interface BraveSearchResult {
  web: {
    results: WebSearchResult[];
  };
}

export interface BraveSearchErrorResponse {
  error: {
    detail: string;
  };
}
