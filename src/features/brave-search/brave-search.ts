import type {
  BraveSearchErrorResponse,
  BraveSearchResult,
} from "./types/types";

export const braveSearch = async (query: string) => {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error("Brave Search API_KEY가 존재하지 않습니다.");
  }

  const requestUrl = new URL("https://api.search.brave.com/res/v1/web/search");

  requestUrl.searchParams.append("q", query);
  requestUrl.searchParams.append("count", "20");

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!response.ok) {
    const errorData: BraveSearchErrorResponse =
      (await response.json()) as BraveSearchErrorResponse;

    throw new Error(errorData.errors[0]?.detail ?? "Brave Search Error");
  }

  const responseData = (await response.json()) as BraveSearchResult;

  return responseData;
};
