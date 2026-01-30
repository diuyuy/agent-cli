import { google } from "@ai-sdk/google";
import { generateText, Output, tool } from "ai";
import z from "zod";
import { sanitizeFileName } from "../../../common/utils/sanitize-file-name";
import { braveSearch } from "../../brave-search/brave-search";
import { DEEP_SEARCH_INSTRUCTIONS } from "../instructions/deep-search-instructions";

export const deepSearch = tool({
  description: "",
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    const { output: queries } = await generateText({
      model: google("gemini-2.5-flash"),
      system: DEEP_SEARCH_INSTRUCTIONS,
      prompt: query,
      output: Output.array({
        element: z.string(),
      }),
    });

    const results: string[] = ["# Search results"];

    for await (const searchQuery of queries) {
      const searchResult = await braveSearch(searchQuery);
      results.push(
        `## ${searchQuery}:\n\n ${JSON.stringify(searchResult, null, 2)}`,
      );
    }

    await Bun.write(
      `/resources/deep-search/${sanitizeFileName(query)}.md`,
      results.join("\n\n"),
    );

    return { output: "작업을 성공적으로 완료했습니다." };
  },
});
