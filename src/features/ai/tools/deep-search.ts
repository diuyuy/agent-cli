import { google } from "@ai-sdk/google";
import { generateText, Output, tool } from "ai";
import path from "path";
import z from "zod";
import { DEEP_SEARCH_RESULT_PATH } from "../../../constants/app-constants";
import { sanitizeFileName } from "../../../utils/sanitize-file-name";
import { braveSearch } from "../../brave-search/brave-search";
import { DEEP_SEARCH_INSTRUCTIONS } from "../instructions/deep-search-instructions";

export const deepSearch = tool({
  description:
    "Performs an in-depth web search on a given topic and saves comprehensive search results as a JSON file. The topic must be provided in English. Use this when the user needs detailed research or wants to save search findings for later analysis.",
  inputSchema: z.object({
    topic: z.string(),
  }),
  execute: async ({ topic: target }) => {
    try {
      const { output: queries } = await generateText({
        model: google("gemini-2.5-flash"),
        system: DEEP_SEARCH_INSTRUCTIONS,
        prompt: target,
        output: Output.array({
          element: z.string(),
        }),
      });
      console.log("🚀 ~ queries:", queries);

      const results: string[] = ["# Search results"];
      const urls: string[] = [];

      let isFirstQuery = true;

      for (const searchQuery of queries) {
        if (!isFirstQuery) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }

        const searchResult = await braveSearch(searchQuery, 10);
        const webResults = searchResult.web.results.map(
          ({ title, url, description }) => ({
            title,
            url,
            description,
          }),
        );

        results.push(
          `## ${searchQuery}:\n\n ${JSON.stringify(webResults, null, 2)}`,
        );
        urls.push(...searchResult.web.results.map(({ url }) => url));

        if (isFirstQuery) {
          isFirstQuery = false;
        }
      }

      results.push(`## URL List\n\n${urls.join("\n\n")}`);

      const filepath = path.join(
        process.cwd(),
        DEEP_SEARCH_RESULT_PATH,
        `${sanitizeFileName(target)}.md`,
      );

      await Bun.write(filepath, results.join("\n\n"));

      return {
        output: "작업을 성공적으로 완료했습니다.",
        searchQueries: queries,
      };
    } catch (error) {
      console.error(error);
      return { output: "작업 실패" };
    }
  },
});
