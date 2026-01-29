import { editor, select } from "@inquirer/prompts";
import chalk from "chalk";
import { COMMAND_NAME } from "./common/constants/commands";
import { MODEL_PROVIDERS } from "./common/constants/model-provider";
import userInput from "./common/utils/user-input";
import { AIService } from "./features/ai/ai.service";

export const getUserAnswer = async () => {
  let answer: string;

  while (true) {
    const input = await userInput({
      message: ">",
    });

    if (input === COMMAND_NAME.EDITOR) {
      answer = await editor({
        message: "",
      });
      break;
    }

    if (input === COMMAND_NAME.MODEL) {
      const newModel = await select({
        message: "모델 선택",
        choices: MODEL_PROVIDERS.map((model) => ({ value: model })),
      });
      const aiService = AIService.getInstance();
      aiService.updateModel(newModel);
      console.log(chalk.gray("-".repeat(30)));
      continue;
    }

    answer = input;
    break;
  }

  return answer;
};
