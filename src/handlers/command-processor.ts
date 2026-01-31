import chalk from "chalk";
import { IsNotCommand } from "../errors/is-not-command";
import type { SessionManager } from "../state/session-manager";
import type { CommandHandler } from "./create-command-handlers";

export class CommandProcessor {
  constructor(private readonly handlers: Record<string, CommandHandler>) {}

  async process(command: string, sessionManager: SessionManager) {
    const handler = this.handlers[command];

    if (!handler) {
      throw new IsNotCommand();
    }

    try {
      await handler(sessionManager);
      this.printSeparator();
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        throw error;
      }
      console.error(chalk.red("명령어 처리 중 오류가 발생했습니다:"), error);
      this.printSeparator();
    }
  }

  private printSeparator(): void {
    console.log(chalk.gray("-".repeat(100)));
  }
}
