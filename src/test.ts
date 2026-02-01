import { braveSearch } from "./features/brave-search/brave-search";
import { sanitizeFileName } from "./utils/sanitize-file-name";

async function test() {
  try {
    const queries = [
      "PostgreSQL index types comparison and performance",
      "PostgreSQL index optimization best practices",
      "How to choose the right index type in PostgreSQL",
      "PostgreSQL index usage examples and scenarios",
      "PostgreSQL index monitoring and tuning",
    ];
    console.log("🚀 ~ queries:", queries);

    const results: string[] = ["# Search results"];

    let isFirstQuery = true;

    for (const searchQuery of queries) {
      if (!isFirstQuery) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const searchResult = await braveSearch(searchQuery, 10);
      console.log(
        "🚀 ~ test ~ searchResult:",
        JSON.stringify(searchResult, null, 2),
      );
      results.push(
        `## ${searchQuery}:\n\n ${JSON.stringify(searchResult, null, 2)}`,
      );

      if (isFirstQuery) {
        isFirstQuery = false;
      }
    }

    await Bun.write(
      `/resources/deep-search/${sanitizeFileName("PosgreSQL")}.md`,
      results.join("\n\n"),
    );

    return { output: "작업을 성공적으로 완료했습니다." };
  } catch (error) {
    console.error(error);
    return { output: "작업 실패" };
  }
}

test();
