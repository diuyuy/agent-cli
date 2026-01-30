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
  errors: {
    detail: string;
  }[];
}
