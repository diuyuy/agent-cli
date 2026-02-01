import { createAIService } from "./features/ai/create-ai-service";
import { CommandProcessor } from "./handlers/command-processor";
import { createCommandHandlers } from "./handlers/create-command-handlers";
import { UserQueryHandler } from "./handlers/use-query-handler";
import { StateManager } from "./state/state-manager";
import { printSeparator } from "./utils/print-seperator";

async function main() {
  const handlers = createCommandHandlers();
  const aiService = createAIService();

  const stateManager = new StateManager(aiService);
  const commandProcessor = new CommandProcessor(handlers);
  const userQueryHandler = new UserQueryHandler(commandProcessor);

  try {
    while (true) {
      const anwser = await userQueryHandler.getUserQuery(stateManager);

      try {
        await aiService.generateResponse(anwser);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Stream was cancelled");
          printSeparator();
          continue;
        }

        throw error;
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      return;
    }

    throw error;
  }
}

main().catch(console.error);
