import { search, select } from "@inquirer/prompts";
import chalk from "chalk";
import clipboard from "clipboardy";
import fg from "fast-glob";
import ora from "ora";
import path from "path";
import { COMMAND_NAME } from "../constants/commands";
import { MODEL_PROVIDERS } from "../constants/model-provider";
import type { StateManager } from "../state/state-manager";

export type CommandHandler = (StateManager: StateManager) => Promise<void>;

export const createCommandHandlers = (): Record<string, CommandHandler> => {
  return {
    [COMMAND_NAME.MODEL]: async (stateManager) => {
      const newModel = await select({
        message: "모델 선택",
        choices: MODEL_PROVIDERS.map((model) => ({ value: model })),
      });
      stateManager.updateModel(newModel);
    },

    [COMMAND_NAME.CLEAR]: async (stateManager) => {
      stateManager.clearSession();
    },

    [COMMAND_NAME.SAVE]: async (stateManager) => {
      await stateManager.save();
    },

    [COMMAND_NAME.LOAD_SESSION]: async (stateManager) => {
      await stateManager.load();
    },

    [COMMAND_NAME.COPY]: async () => {
      const resourceList = await fg(["resources/**/*"], {
        cwd: process.cwd(),
        dot: true,
      });

      const fileName = await search<string>({
        message: "파일을 선택하세요:",
        source: async (input) => {
          if (!input) {
            return resourceList;
          }

          const matchedFiles = resourceList.filter((resource) =>
            resource.toLowerCase().includes(input.toLowerCase()),
          );

          return matchedFiles;
        },
        theme: {
          style: {
            highlight: chalk.green,
          },
        },
      });

      const spinner = ora("Loading...");
      spinner.start();

      const buffer = Bun.file(path.join(process.cwd(), fileName));

      const content = await buffer.text();

      await clipboard.write(content);

      spinner.stop();

      console.log(chalk.cyan("\n클립보드에 성공적으로 복사되었습니다."));
    },
  };
};
