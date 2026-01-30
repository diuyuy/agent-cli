import { getUserQuery } from "./get-user-query";

async function main() {
  try {
    const anwser = await getUserQuery();
    console.log("🚀 ~ main ~ anwser:", anwser);
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      return;
    }

    throw error;
  }
}

main().catch(console.error);
