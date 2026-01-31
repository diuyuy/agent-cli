import { select } from "@inquirer/prompts";
import { COMMAND_NAME } from "../constants/commands";
import { MODEL_PROVIDERS } from "../constants/model-provider";
import type { SessionManager } from "../state/session-manager";

export type CommandHandler = (sessionManager: SessionManager) => Promise<void>;

export const createCommandHandlers = (): Record<string, CommandHandler> => {
  return {
    [COMMAND_NAME.MODEL]: async (sessionManager) => {
      const newModel = await select({
        message: "모델 선택",
        choices: MODEL_PROVIDERS.map((model) => ({ value: model })),
      });
      sessionManager.updateModel(newModel);
    },

    [COMMAND_NAME.CLEAR]: async (sessionManager) => {
      sessionManager.clearSession();
    },

    [COMMAND_NAME.SAVE]: async (sessionManager) => {
      await sessionManager.save();
    },

    [COMMAND_NAME.LOAD_SESSION]: async (sessionManager) => {
      await sessionManager.load();
    },
  };
};
