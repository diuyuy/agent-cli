import { AIService } from "./features/ai/ai.service";
import { getUserAnswer } from "./get-user-answer";

async function main() {
  try {
    const anwser = await getUserAnswer();
    console.log("🚀 ~ main ~ anwser:", anwser);

    const aiService = AIService.getInstance();
    console.log(aiService.getModel());
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      return;
    }

    throw error;
  }
}

main().catch(console.error);
