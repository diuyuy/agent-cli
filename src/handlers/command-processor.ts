import chalk from "chalk";
import { IsNotCommand } from "../errors/is-not-command";
import type { StateManager } from "../state/state-manager";
import { printSeparator } from "../utils/print-seperator";
import type { CommandHandler } from "./create-command-handlers";

export class CommandProcessor {
  constructor(private readonly handlers: Record<string, CommandHandler>) {}

  async process(command: string, stateManager: StateManager) {
    const handler = this.handlers[command];

    if (!handler) {
      throw new IsNotCommand();
    }

    try {
      await handler(stateManager);
      printSeparator();
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        throw error;
      }
      console.error(chalk.red("명령어 처리 중 오류가 발생했습니다:"), error);
      printSeparator();
    }
  }
}
