import { editor } from "@inquirer/prompts";
import { COMMAND_NAME, COMMANDS } from "../constants/commands";
import type { StateManager } from "../state/state-manager";
import userInput from "../utils/user-input";
import type { CommandProcessor } from "./command-processor";

export class UserQueryHandler {
  constructor(private readonly commandProcessor: CommandProcessor) {}

  async getUserQuery(stateManager: StateManager) {
    while (true) {
      const answer = await userInput({
        message: ">",
        commands: COMMANDS,
      });

      if (answer === COMMAND_NAME.EDITOR) {
        return await editor({
          message: "",
        });
      }

      if (this.isCommand(answer)) {
        await this.commandProcessor.process(answer, stateManager);

        continue;
      }

      return answer;
    }
  }

  private isCommand(value: string) {
    return Object.values(COMMAND_NAME).includes(value);
  }
}
